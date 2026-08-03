const REGION = "eu";
const REALM = "ysondre";
const GUILD_NAME = "Waít for it";

// Traduction des identifiants de raid renvoyés par l'API en noms lisibles.
// La saison est indiquée par le titre du cadre, donc on ne la répète pas ici.
const RAID_NAME_MAP = {
  "tier-mn-1": "Voidspire / Dreamrift / March on Quel'Danas",
  "mn-tier-1": "Voidspire / Dreamrift / March on Quel'Danas",
  "sporefall": "Sporefall",
  "the-venomous-abyss": "The Venomous Abyss",
  "venomous-abyss": "The Venomous Abyss",
  "the-tidebound-grotto": "The Tidebound Grotto",
  "tidebound-grotto": "The Tidebound Grotto",
  "voidspire": "The Voidspire",
  "the-voidspire": "The Voidspire",
  "dreamrift": "Dreamrift",
  "march-on-quel-danas": "March on Quel'Danas",
  "march-on-queldanas": "March on Quel'Danas"
};

// Identifiants (ou fragments d'identifiants) qui appartiennent à la Saison 1.
// Tout ce qui ne matche pas ici est classé en Saison 2.
const SEASON_1_HINTS = ["tier", "voidspire", "dreamrift", "quel-danas", "queldanas", "sporefall"];

function prettifyRaidName(slug) {
  if (RAID_NAME_MAP[slug]) return RAID_NAME_MAP[slug];
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function isSeason1(slug) {
  const s = slug.toLowerCase();
  return SEASON_1_HINTS.some(hint => s.includes(hint));
}

async function loadGuildData() {
  const url = `https://raider.io/api/v1/guilds/profile?region=${REGION}&realm=${REALM}&name=${encodeURIComponent(GUILD_NAME)}&fields=raid_progression,raid_rankings`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Réponse API invalide");
    const data = await res.json();
    renderProgression(data.raid_progression, data.raid_rankings);
  } catch (err) {
    ["progression-list-s1", "progression-list-s2"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '<p class="loading">Progression indisponible pour le moment.</p>';
    });
    console.error(err);
  }
}

function getDifficultyKey(summary) {
  const letter = (summary || "").trim().slice(-1).toUpperCase();
  if (letter === "M") return "mythic";
  if (letter === "H") return "heroic";
  if (letter === "N") return "normal";
  return null;
}

function buildRankLine(slug, raid, rankings) {
  if (!rankings || !rankings[slug]) return "";
  const diffKey = getDifficultyKey(raid.summary);
  const r = diffKey && rankings[slug][diffKey];
  if (!r) return "";

  // L'API publique raider.io ne fournit que world / region / realm.
  // Le classement "FR" (faction-realm) affiché sur raider.io est calculé
  // côté site web uniquement et n'est pas exposé par cette API.
  const parts = [];
  if (r.realm != null) parts.push(`#REALM: ${r.realm}`);
  if (r.region != null) parts.push(`#EU: ${r.region}`);
  if (r.world != null) parts.push(`#WORLD: ${r.world}`);

  return parts.length ? `<p class="progress-rank">${parts.join("&nbsp;&nbsp;")}</p>` : "";
}

function buildBlock(slug, raid, rankings) {
  const summary = raid.summary || "—";
  const [killed, total] = summary.split("/").map(s => parseInt(s));
  const bosses = (typeof RAID_BOSSES !== "undefined" && RAID_BOSSES[slug]) || null;
  const rankLine = buildRankLine(slug, raid, rankings);

  const bars = (!isNaN(killed) && !isNaN(total))
    ? Array.from({ length: total }, (_, i) =>
        `<span class="${i < killed ? "lit" : ""}"></span>`
      ).join("")
    : "";

  let iconsRow = "";
  if (bosses && bosses.length === total) {
    const singleClass = bosses.length === 1 ? " boss-icons-single" : "";
    iconsRow = `<div class="boss-icons${singleClass}">${bosses.map((b, i) => {
      const img = b.url
        ? `<img src="${b.url}"
               alt="${b.name}" title="${b.name}" loading="lazy"
               class="${i < killed ? "" : "boss-icon-pending"}"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <span class="boss-icon-fallback" title="${b.name}" style="display:none"></span>`
        : `<span class="boss-icon-fallback" title="${b.name}"></span>`;
      return `<span>${img}</span>`;
    }).join("")}</div>`;
  }

  return `
    <div class="progress-block">
      <p class="progress-name">${prettifyRaidName(slug)}</p>
      <p class="progress-value">${summary}</p>
      ${rankLine}
      ${iconsRow}
      <div class="ember-bar">${bars}</div>
    </div>
  `;
}

function renderProgression(progression, rankings) {
  const entries = Object.entries(progression || {});
  const s1Container = document.getElementById("progression-list-s1");
  const s2Container = document.getElementById("progression-list-s2");

  if (entries.length === 0) {
    if (s1Container) s1Container.innerHTML = '<p class="loading">Aucune donnée.</p>';
    if (s2Container) s2Container.innerHTML = '<p class="loading">Aucune donnée.</p>';
    return;
  }

  // L'API renvoie les raids du plus ancien au plus récent : on inverse
  // pour afficher le raid le plus récent de chaque saison en premier.
  const ordered = [...entries].reverse();

  const s1 = ordered.filter(([slug]) => isSeason1(slug));
  const s2 = ordered.filter(([slug]) => !isSeason1(slug));

  if (s1Container) {
    s1Container.innerHTML = s1.length
      ? s1.map(([slug, raid]) => buildBlock(slug, raid, rankings)).join("")
      : '<p class="loading">Aucune donnée.</p>';
  }
  if (s2Container) {
    s2Container.innerHTML = s2.length
      ? s2.map(([slug, raid]) => buildBlock(slug, raid, rankings)).join("")
      : '<p class="loading">Aucune donnée.</p>';
  }
}

loadGuildData();
