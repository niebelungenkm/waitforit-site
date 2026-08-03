// Liste des boss par raid, dans l'ordre d'apparition, avec leur icône (wowhead/zamimg).
// Sert à afficher un portrait au-dessus de chaque case de la barre de progression.
// Un raid absent de cette table s'affiche simplement sans portraits (juste la barre).
// Si une icône ne s'affiche pas correctement, corrigez son "icon" ci-dessous.
const RAID_BOSSES = {
  "tier-mn-1": [
    { name: "Lightblinded Vanguard",   icon: "achievement_boss_lightblindedvanguard" },
    { name: "Vaelgor & Ezzorak",       icon: "achievement_boss_vaelgorezzorak" },
    { name: "Fallen-King Salhadaar",   icon: "achievement_boss_fallenkingsalhadaar" },
    { name: "Vorasius",                icon: "achievement_boss_vorasius" },
    { name: "Imperator Averzian",      icon: "achievement_boss_imperatoraverzian" },
    { name: "Crown of the Cosmos",     icon: "achievement_boss_crownofthecosmos" },
    { name: "Chimaerus, the Undreamt God", icon: "achievement_boss_chimaerus" },
    { name: "Belo'ren, Child of Al'ar", icon: "achievement_boss_beloren" },
    { name: "Midnight Falls",          icon: "achievement_boss_midnightfalls" }
  ],
  "mn-tier-1": [
    { name: "Lightblinded Vanguard",   icon: "achievement_boss_lightblindedvanguard" },
    { name: "Vaelgor & Ezzorak",       icon: "achievement_boss_vaelgorezzorak" },
    { name: "Fallen-King Salhadaar",   icon: "achievement_boss_fallenkingsalhadaar" },
    { name: "Vorasius",                icon: "achievement_boss_vorasius" },
    { name: "Imperator Averzian",      icon: "achievement_boss_imperatoraverzian" },
    { name: "Crown of the Cosmos",     icon: "achievement_boss_crownofthecosmos" },
    { name: "Chimaerus, the Undreamt God", icon: "achievement_boss_chimaerus" },
    { name: "Belo'ren, Child of Al'ar", icon: "achievement_boss_beloren" },
    { name: "Midnight Falls",          icon: "achievement_boss_midnightfalls" }
  ],
  "sporefall": [
    { name: "Rotmire", icon: "achievement_boss_rotmire" }
  ]
  // "the-venomous-abyss" et "the-tidebound-grotto" : liste de boss pas encore
  // connue/documentée -> ces raids s'affichent sans portraits pour l'instant.
};
