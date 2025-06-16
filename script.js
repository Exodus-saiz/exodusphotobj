// Affichage date/heure en haut
function updateDateTime() {
  const dt = new Date();
  document.getElementById('datetime').textContent = dt.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Prix des gaz
const prixGaz = {
  oryx3kg: 2000,
  oryx6kg: 4500,
  oryx12_5kg: 10000,
  oryx38kg: 30400,
  benin3kg: 2000,
  benin6kg: 4500,
  benin12_5kg: 10000,
};

// Gestion simple des ventes (stockage local temporaire)
const ventes = {};

document.getElementById('venteForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const cat = e.target.categorie.value;
  const qte = parseInt(e.target.quantite.value);
  if (!ventes[cat]) ventes[cat] = 0;
  ventes[cat] += qte;
  afficherResume();
  e.target.reset();
});

function afficherResume() {
  const div = document.getElementById('resumeVentes');
  div.innerHTML = '';
  let total = 0;
  for (const cat in ventes) {
    const prix = prixGaz[cat] || 0;
    const qte = ventes[cat];
    const sousTotal = prix * qte;
    total += sousTotal;
    div.innerHTML += `<p>${cat} : ${qte} vendus, total ${sousTotal} F</p>`;
  }
  div.innerHTML += `<hr><p><strong>Total général : ${total} F</strong></p>`;
}