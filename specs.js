// Les icônes et le regroupement par rôle sont définis ici. L'état de
// recrutement (Ouvert / Sur demande / Complet), lui, est piloté depuis ce
// Google Sheet — modifiez-le et le site se met à jour automatiquement :
// https://docs.google.com/spreadsheets/d/1ClFvkCpXQdvWpPqah8YCpS5A5EKQFIpp91Crp8v3Xx0/edit
//
// Chaque classe est regroupée par rôle (DPS / Tank / Heal) plutôt que par
// spécialisation individuelle. Quand une classe n'a qu'un seul rôle possible
// (ex. Mage, Rogue, Warlock = DPS uniquement), la case n'affiche que le nom
// de la classe, sans suffixe de rôle.
// role : "dps" | "tank" | "heal" | null (null = rôle unique, pas de suffixe)
const SPECS = [
  // Death Knight (Tank + DPS)
  { class: "Death Knight", role: "tank", icon: "spell_deathknight_bloodpresence" },
  { class: "Death Knight", role: "dps",  icon: "spell_deathknight_frostpresence" },

  // Demon Hunter (DPS + Tank)
  { class: "Demon Hunter", role: "dps",  icon: "ability_demonhunter_specdps" },
  { class: "Demon Hunter", role: "tank", icon: "ability_demonhunter_spectank" },

  // Druid (DPS + Tank + Heal)
  { class: "Druid", role: "dps",  icon: "spell_nature_starfall" },
  { class: "Druid", role: "tank", icon: "ability_racial_bearform" },
  { class: "Druid", role: "heal", icon: "spell_nature_healingtouch" },

  // Evoker (DPS + Heal)
  { class: "Evoker", role: "dps",  icon: "classicon_evoker_devastation" },
  { class: "Evoker", role: "heal", icon: "classicon_evoker_preservation" },

  // Hunter — DPS uniquement
  { class: "Hunter", role: null, icon: "ability_hunter_bestialdiscipline" },

  // Mage — DPS uniquement
  { class: "Mage", role: null, icon: "spell_holy_magicalsentry" },

  // Monk (Tank + DPS + Heal)
  { class: "Monk", role: "tank", icon: "spell_monk_brewmaster_spec" },
  { class: "Monk", role: "dps",  icon: "spell_monk_windwalker_spec" },
  { class: "Monk", role: "heal", icon: "spell_monk_mistweaver_spec" },

  // Paladin (Heal + Tank + DPS)
  { class: "Paladin", role: "heal", icon: "spell_holy_holybolt" },
  { class: "Paladin", role: "tank", icon: "ability_paladin_shieldofthetemplar" },
  { class: "Paladin", role: "dps",  icon: "spell_holy_auraoflight" },

  // Priest (Heal + DPS)
  { class: "Priest", role: "heal", icon: "spell_holy_powerwordshield" },
  { class: "Priest", role: "dps",  icon: "spell_shadow_shadowwordpain" },

  // Rogue — DPS uniquement
  { class: "Rogue", role: null, icon: "ability_rogue_deadlybrew" },

  // Shaman (DPS + Heal)
  { class: "Shaman", role: "dps",  icon: "spell_nature_lightning" },
  { class: "Shaman", role: "heal", icon: "spell_nature_magicimmunity" },

  // Warlock — DPS uniquement
  { class: "Warlock", role: null, icon: "spell_shadow_deathcoil" },

  // Warrior (DPS + Tank)
  { class: "Warrior", role: "dps",  icon: "ability_warrior_savageblow" },
  { class: "Warrior", role: "tank", icon: "ability_warrior_defensivestance" }
];

const ROLE_LABEL = {
  "dps": "DPS",
  "tank": "Tank",
  "heal": "Heal"
};

const STATUS_LABEL = {
  "ouvert": "Ouvert",
  "sur-demande": "Sur demande",
  "complet": "Complet"
};

// Convertit le texte du Google Sheet ("Ouvert" / "Sur demande" / "Complet")
// vers la clé interne utilisée pour la couleur de la pastille.
const STATUS_KEY_FROM_SHEET = {
  "ouvert": "ouvert",
  "sur demande": "sur-demande",
  "complet": "complet"
};

const STATUS_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2mXNJLwjO5Ks1y7Qo7LRxJa6xDwtcK4OZhN_KTze2j9EwgB8Jeqwk7x6ugmEkyTMlNpPNKTlpBnTn/pub?output=csv";

function parseCsv(text) {
  return text
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0)
    .map(line => line.split(",").map(cell => cell.replace(/^"|"$/g, "").trim()));
}

async function loadStatusMap() {
  try {
    const res = await fetch(STATUS_SHEET_CSV_URL);
    if (!res.ok) throw new Error("Réponse invalide");
    const rows = parseCsv(await res.text());
    const map = {};
    rows.slice(1).forEach(([cls, role, status]) => {
      if (!cls) return;
      const key = cls + "|" + (role || "");
      map[key] = STATUS_KEY_FROM_SHEET[(status || "").toLowerCase()] || "sur-demande";
    });
    return map;
  } catch (err) {
    console.error("Impossible de charger les statuts depuis le Google Sheet :", err);
    return {};
  }
}

function renderSpecGrid(statusMap) {
  const grid = document.getElementById("spec-grid");
  if (!grid) return;

  // Regroupe par classe, dans l'ordre d'apparition du tableau SPECS.
  const byClass = [];
  const index = {};
  SPECS.forEach(s => {
    if (!(s.class in index)) {
      index[s.class] = byClass.length;
      byClass.push({ class: s.class, entries: [] });
    }
    byClass[index[s.class]].entries.push(s);
  });

  grid.innerHTML = byClass.map(group => `
    <div class="class-row">
      ${group.entries.map(s => {
        const name = s.role ? `${s.class} ${ROLE_LABEL[s.role]}` : s.class;
        const key = s.class + "|" + (s.role || "");
        const status = statusMap[key] || "sur-demande";
        return `
          <div class="spec-card status-${status}">
            <img class="spec-icon" src="https://wow.zamimg.com/images/wow/icons/medium/${s.icon}.jpg" alt="" loading="lazy"
                 onerror="this.style.visibility='hidden'">
            <div class="spec-info">
              <p class="spec-name">${name}</p>
            </div>
            <span class="status-badge status-${status}" title="${STATUS_LABEL[status]}"></span>
          </div>
        `;
      }).join("")}
    </div>
  `).join("");
}

async function initSpecGrid() {
  const statusMap = await loadStatusMap();
  renderSpecGrid(statusMap);
}

initSpecGrid();
