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
  const url = `https://raider.io/api/v1/guilds/profile?region=${REGION}&realm=${REALM}&name=${encodeURIComponent(GUILD_NAME)}&fields=raid_progression`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Réponse API invalide");
    const data = await res.json();
    renderProgression(data.raid_progression);
  } catch (err) {
    ["progression-list-s1", "progression-list-s2"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '<p class="loading">Progression indisponible pour le moment.</p>';
    });
    console.error(err);
  }
}

function buildBlock(slug, raid) {
  const summary = raid.summary || "—";
  const [killed, total] = summary.split("/").map(s => parseInt(s));
  const bosses = (typeof RAID_BOSSES !== "undefined" && RAID_BOSSES[slug]) || null;

  // Raid à un seul boss connu : icône à gauche + petite barre compacte.
  if (bosses && bosses.length === 1 && total === 1) {
    const boss = bosses[0];
    const lit = killed >= 1 ? "lit" : "";
    const iconHtml = boss.url
      ? `<img class="single-boss-icon" src="${boss.url}"
             alt="${boss.name}" title="${boss.name}" loading="lazy"
             onerror="this.style.visibility='hidden'">`
      : `<div class="single-boss-icon single-boss-icon-placeholder" title="${boss.name}"></div>`;
    return `
      <div class="progress-block">
        <p class="progress-name">${prettifyRaidName(slug)}</p>
        <div class="single-boss-row">
          ${iconHtml}
          <div class="single-boss-info">
            <p class="progress-value">${summary}</p>
            <div class="ember-bar ember-bar-mini"><span class="${lit}"></span></div>
          </div>
        </div>
      </div>
    `;
  }

  const bars = (!isNaN(killed) && !isNaN(total))
    ? Array.from({ length: total }, (_, i) =>
        `<span class="${i < killed ? "lit" : ""}"></span>`
      ).join("")
    : "";

  let iconsRow = "";
  if (bosses && bosses.length === total) {
    iconsRow = `<div class="boss-icons">${bosses.map((b, i) => {
      const img = b.url
        ? `<img src="${b.url}"
               alt="${b.name}" title="${b.name}" loading="lazy"
               class="${i < killed ? "" : "boss-icon-pending"}"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
           <span class="boss-icon-fallback" title="${b.name}" style="display:none"></span>`
        : `<span class="boss-icon-fallback" title="${b.name}"></span>`;
      return `<span>${img}</span>`;
    }).join("")}</div>`;
  }

  return `
    <div class="progress-block">
      <p class="progress-name">${prettifyRaidName(slug)}</p>
      <p class="progress-value">${summary}</p>
      ${iconsRow}
      <div class="ember-bar">${bars}</div>
    </div>
  `;
}

function renderProgression(progression) {
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
      ? s1.map(([slug, raid]) => buildBlock(slug, raid)).join("")
      : '<p class="loading">Aucune donnée.</p>';
  }
  if (s2Container) {
    s2Container.innerHTML = s2.length
      ? s2.map(([slug, raid]) => buildBlock(slug, raid)).join("")
      : '<p class="loading">Aucune donnée.</p>';
  }
}

loadGuildData();
