// Éditez ce tableau pour mettre à jour l'état de recrutement.
// Chaque classe est regroupée par rôle (DPS / Tank / Heal) plutôt que par
// spécialisation individuelle. Quand une classe n'a qu'un seul rôle possible
// (ex. Mage, Voleur, Démoniste = DPS uniquement), la case n'affiche que le
// nom de la classe, sans suffixe de rôle.
// status : "ouvert" | "sur-demande" | "complet"
// role   : "dps" | "tank" | "heal" | null (null = rôle unique, pas de suffixe)
const SPECS = [
  // Death Knight (Tank + DPS)
  { class: "Death Knight", role: "tank", icon: "spell_deathknight_bloodpresence",  status: "sur-demande" },
  { class: "Death Knight", role: "dps",  icon: "spell_deathknight_frostpresence",  status: "sur-demande" },

  // Chasseur de démons (DPS + Tank)
  { class: "Chasseur de démons", role: "dps",  icon: "ability_demonhunter_specdps",  status: "sur-demande" },
  { class: "Chasseur de démons", role: "tank", icon: "ability_demonhunter_spectank", status: "sur-demande" },

  // Druide (DPS + Tank + Heal)
  { class: "Druide", role: "dps",  icon: "spell_nature_starfall",     status: "sur-demande" },
  { class: "Druide", role: "tank", icon: "ability_racial_bearform",   status: "sur-demande" },
  { class: "Druide", role: "heal", icon: "spell_nature_healingtouch", status: "sur-demande" },

  // Évocateur (DPS + Heal)
  { class: "Évocateur", role: "dps",  icon: "classicon_evoker_devastation",  status: "sur-demande" },
  { class: "Évocateur", role: "heal", icon: "classicon_evoker_preservation", status: "sur-demande" },

  // Chasseur — DPS uniquement
  { class: "Chasseur", role: null, icon: "ability_hunter_bestialdiscipline", status: "sur-demande" },

  // Mage — DPS uniquement
  { class: "Mage", role: null, icon: "spell_holy_magicalsentry", status: "sur-demande" },

  // Moine (Tank + DPS + Heal)
  { class: "Moine", role: "tank", icon: "spell_monk_brewmaster_spec", status: "sur-demande" },
  { class: "Moine", role: "dps",  icon: "spell_monk_windwalker_spec", status: "sur-demande" },
  { class: "Moine", role: "heal", icon: "spell_monk_mistweaver_spec", status: "sur-demande" },

  // Paladin (Heal + Tank + DPS)
  { class: "Paladin", role: "heal", icon: "spell_holy_holybolt",                status: "sur-demande" },
  { class: "Paladin", role: "tank", icon: "ability_paladin_shieldofthetemplar", status: "sur-demande" },
  { class: "Paladin", role: "dps",  icon: "spell_holy_auraoflight",             status: "sur-demande" },

  // Prêtre (Heal + DPS)
  { class: "Prêtre", role: "heal", icon: "spell_holy_powerwordshield",  status: "sur-demande" },
  { class: "Prêtre", role: "dps",  icon: "spell_shadow_shadowwordpain", status: "sur-demande" },

  // Voleur — DPS uniquement
  { class: "Voleur", role: null, icon: "ability_rogue_deadlybrew", status: "sur-demande" },

  // Chaman (DPS + Heal)
  { class: "Chaman", role: "dps",  icon: "spell_nature_lightning",      status: "sur-demande" },
  { class: "Chaman", role: "heal", icon: "spell_nature_magicimmunity",  status: "sur-demande" },

  // Démoniste — DPS uniquement
  { class: "Démoniste", role: null, icon: "spell_shadow_deathcoil", status: "sur-demande" },

  // Guerrier (DPS + Tank)
  { class: "Guerrier", role: "dps",  icon: "ability_warrior_savageblow",      status: "sur-demande" },
  { class: "Guerrier", role: "tank", icon: "ability_warrior_defensivestance", status: "sur-demande" }
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

function renderSpecGrid() {
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
        return `
          <div class="spec-card status-${s.status}">
            <img class="spec-icon" src="https://wow.zamimg.com/images/wow/icons/medium/${s.icon}.jpg" alt="" loading="lazy"
                 onerror="this.style.visibility='hidden'">
            <div class="spec-info">
              <p class="spec-name">${name}</p>
            </div>
            <span class="status-badge status-${s.status}" title="${STATUS_LABEL[s.status]}"></span>
          </div>
        `;
      }).join("")}
    </div>
  `).join("");
}

renderSpecGrid();
