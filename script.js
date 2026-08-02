const REGION = "eu";
const REALM = "ysondre";
const GUILD_NAME = "Waít for it";

async function loadGuildData() {
  const url = `https://raider.io/api/v1/guilds/profile?region=${REGION}&realm=${REALM}&name=${encodeURIComponent(GUILD_NAME)}&fields=raid_progression`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Réponse API invalide");
    const data = await res.json();
    renderProgression(data.raid_progression);
  } catch (err) {
    console.error(err);
  }
}

function renderProgression(progression) {
  if (!progression) return;
  const raids = Object.values(progression);
  const current = raids[raids.length - 1];
  if (!current) return;

  document.getElementById("stat-progress").textContent = current.summary;

  const [killed, total] = current.summary.split("/").map(s => parseInt(s));
  const bar = document.getElementById("ember-bar");
  bar.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const seg = document.createElement("span");
    if (i < killed) seg.classList.add("lit");
    bar.appendChild(seg);
  }
}

loadGuildData();
