// Éditez ce tableau pour mettre à jour l'état de recrutement.
// status : "ouvert" | "sur-demande" | "complet"
const SPECS = [
  { class: "Death Knight", spec: "Sang",       role: "tank",  icon: "spell_deathknight_bloodpresence",       status: "complet" },
  { class: "Death Knight", spec: "Givre",      role: "dps",   icon: "spell_deathknight_frostpresence",       status: "sur-demande" },
  { class: "Death Knight", spec: "Impie",      role: "dps",   icon: "spell_deathknight_unholypresence",      status: "sur-demande" },

  { class: "Chasseur de démons", spec: "Dévastation", role: "dps",  icon: "ability_demonhunter_specdps",     status: "complet" },
  { class: "Chasseur de démons", spec: "Vengeance",   role: "tank", icon: "ability_demonhunter_spectank",    status: "sur-demande" },

  { class: "Druide", spec: "Équilibre",     role: "dps",   icon: "spell_nature_starfall",           status: "ouvert" },
  { class: "Druide", spec: "Farouche",      role: "dps",   icon: "ability_druid_catform",           status: "sur-demande" },
  { class: "Druide", spec: "Gardien",       role: "tank",  icon: "ability_racial_bearform",         status: "complet" },
  { class: "Druide", spec: "Restauration",  role: "heal",  icon: "spell_nature_healingtouch",       status: "ouvert" },

  { class: "Évocateur", spec: "Dévastation",   role: "dps",  icon: "ability_evoker_specdevastation",   status: "sur-demande" },
  { class: "Évocateur", spec: "Préservation",  role: "heal", icon: "ability_evoker_specpreservation",  status: "ouvert" },
  { class: "Évocateur", spec: "Augmentation",  role: "dps",  icon: "ability_evoker_specaugmentation",  status: "sur-demande" },

  { class: "Chasseur", spec: "Bête",          role: "dps", icon: "ability_hunter_bestialdiscipline", status: "sur-demande" },
  { class: "Chasseur", spec: "Précision",     role: "dps", icon: "ability_hunter_focusedaim",        status: "complet" },
  { class: "Chasseur", spec: "Survie",        role: "dps", icon: "ability_hunter_camouflage",        status: "sur-demande" },

  { class: "Mage", spec: "Arcanes", role: "dps", icon: "spell_holy_magicalsentry", status: "sur-demande" },
  { class: "Mage", spec: "Feu",     role: "dps", icon: "spell_fire_firebolt02",    status: "complet" },
  { class: "Mage", spec: "Givre",   role: "dps", icon: "spell_frost_frostbolt02",  status: "sur-demande" },

  { class: "Moine", spec: "Brasseur",     role: "tank", icon: "spell_monk_brewmaster_spec",   status: "complet" },
  { class: "Moine", spec: "Tisse-Vent",   role: "dps",  icon: "spell_monk_windwalker_spec",   status: "ouvert" },
  { class: "Moine", spec: "Tisse-Brume",  role: "heal", icon: "spell_monk_mistweaver_spec",   status: "ouvert" },

  { class: "Paladin", spec: "Sacré",        role: "heal", icon: "spell_holy_holybolt",             status: "ouvert" },
  { class: "Paladin", spec: "Protection",   role: "tank", icon: "ability_paladin_shieldofthetemplar", status: "sur-demande" },
  { class: "Paladin", spec: "Vindicte",     role: "dps",  icon: "spell_holy_auraoflight",          status: "sur-demande" },

  { class: "Prêtre", spec: "Discipline",  role: "heal", icon: "spell_holy_powerwordshield", status: "ouvert" },
  { class: "Prêtre", spec: "Sacré",       role: "heal", icon: "spell_holy_guardianspirit",  status: "sur-demande" },
  { class: "Prêtre", spec: "Ombre",       role: "dps",  icon: "spell_shadow_shadowwordpain", status: "complet" },

  { class: "Voleur", spec: "Assassinat", role: "dps", icon: "ability_rogue_deadlybrew", status: "sur-demande" },
  { class: "Voleur", spec: "Hors-la-loi", role: "dps", icon: "ability_rogue_waylay",    status: "sur-demande" },
  { class: "Voleur", spec: "Subtilité",  role: "dps", icon: "ability_stealth",          status: "complet" },

  { class: "Chaman", spec: "Élémentaire", role: "dps",  icon: "spell_nature_lightning",           status: "sur-demande" },
  { class: "Chaman", spec: "Amélioration", role: "dps", icon: "spell_shaman_improvedstormstrike", status: "sur-demande" },
  { class: "Chaman", spec: "Restauration", role: "heal", icon: "spell_nature_magicimmunity",      status: "ouvert" },

  { class: "Démoniste", spec: "Affliction",   role: "dps", icon: "spell_shadow_deathcoil",     status: "sur-demande" },
  { class: "Démoniste", spec: "Démonologie",  role: "dps", icon: "spell_shadow_metamorphosis", status: "sur-demande" },
  { class: "Démoniste", spec: "Destruction",  role: "dps", icon: "spell_shadow_rainoffire",    status: "complet" },

  { class: "Guerrier", spec: "Armes",       role: "dps",  icon: "ability_warrior_savageblow",       status: "sur-demande" },
  { class: "Guerrier", spec: "Fureur",      role: "dps",  icon: "ability_warrior_innerrage",        status: "complet" },
  { class: "Guerrier", spec: "Protection",  role: "tank", icon: "ability_warrior_defensivestance",  status: "sur-demande" }
];

const STATUS_LABEL = {
  "ouvert": "Ouvert",
  "sur-demande": "Sur demande",
  "complet": "Complet"
};

function renderSpecGrid() {
  const grid = document.getElementById("spec-grid");
  if (!grid) return;

  grid.innerHTML = SPECS.map(s => `
    <div class="spec-card status-${s.status}">
      <img class="spec-icon" src="https://wow.zamimg.com/images/wow/icons/medium/${s.icon}.jpg" alt="" loading="lazy"
           onerror="this.style.visibility='hidden'">
      <div class="spec-info">
        <p class="spec-name">${s.spec}</p>
        <p class="spec-class">${s.class}</p>
      </div>
      <span class="status-badge status-${s.status}" title="${STATUS_LABEL[s.status]}"></span>
    </div>
  `).join("");
}

renderSpecGrid();
