const REGION = "eu";
const REALM = "ysondre";
const GUILD_NAME = "Waít for it";

// Traduction des identifiants de raid renvoyés par l'API en noms lisibles.
// Complétez cette table si un nouveau raid apparaît avec un nom brut peu lisible.
const RAID_NAME_MAP = {
  "sporefall": "Sporefall (S2)",
  "the-venomous-abyss": "The Venomous Abyss (S2)",
  "venomous-abyss": "The Venomous Abyss (S2)",
  "voidspire": "The Voidspire (Tier 1)",
  "the-voidspire": "The Voidspire (Tier 1)",
  "dreamrift": "Dreamrift (Tier 1)",
  "march-on-quel-danas": "March on Quel'Danas (Tier 1)",
  "march-on-queldanas": "March on Quel'Danas (Tier 1)"
};

function prettifyRaidName(slug) {
  if (RAID_NAME_MAP[slug]) return RAID_NAME_MAP[slug];
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

async function loadGuildData() {
  const url = `https://raider.io/api/v1/guilds/profile?region=${REGION}&realm=${REALM}&name=${encodeURIComponent(GUILD_NAME)}&fields=raid_progression`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Réponse API invalide");
    const data = await res.json();
    renderProgression(data.raid_progression);
  } catch (err) {
    const container = document.getElementById("progression-list");
    if (container) {
      container.innerHTML = '<p class="loading">Progression indisponible pour le moment.</p>';
    }
    console.error(err);
  }
}

function renderProgression(progression) {
  const container = document.getElementById("progression-list");
  if (!container) return;

  const entries = Object.entries(progression || {});
  if (entries.length === 0) {
    container.innerHTML = '<p class="loading">Aucune donnée de progression.</p>';
    return;
  }

  // L'API renvoie les raids du plus ancien au plus récent : on inverse
  // pour afficher la saison en cours (S2) au-dessus de la précédente (Tier 1).
  const ordered = [...entries].reverse();

  container.innerHTML = ordered.map(([slug, raid]) => {
    const summary = raid.summary || "—";
    const [killed, total] = summary.split("/").map(s => parseInt(s));
    const bars = (!isNaN(killed) && !isNaN(total))
      ? Array.from({ length: total }, (_, i) =>
          `<span class="${i < killed ? "lit" : ""}"></span>`
        ).join("")
      : "";

    return `
      <div class="progress-block">
        <p class="progress-name">${prettifyRaidName(slug)}</p>
        <p class="progress-value">${summary}</p>
        <div class="ember-bar">${bars}</div>
      </div>
    `;
  }).join("");
}

loadGuildData();
