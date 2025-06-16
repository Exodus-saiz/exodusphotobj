const prixGaz = {
    oryx: { "3": 2000, "6": 4500, "12.5": 10000, "38": 30400 },
    benin: { "3": 2000, "6": 4500, "12.5": 10000 }
};

function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

function getStockKey(type, weight) {
    return `${type}_${weight}`;
}

function getVenteTotalKey() {
    return "chiffre_total";
}

function setInitialStock() {
    const type = document.getElementById("gaz-type").value;
    const poids = document.getElementById("gaz-poids").value;
    const qty = parseInt(document.getElementById("initial-qty").value);
    if (!isNaN(qty) && qty >= 0) {
        localStorage.setItem(getStockKey(type, poids), qty);
        afficherStock();
    }
}

function updatePrixUnitaire() {
    const type = document.getElementById("vente-gaz-type").value;
    const poids = document.getElementById("vente-poids").value;
    const prix = prixGaz[type]?.[poids] || 0;
    document.getElementById("prix-unitaire").value = prix;
    updateTotal();
}

function updateTotal() {
    const prix = parseInt(document.getElementById("prix-unitaire").value) || 0;
    const quantite = parseInt(document.getElementById("quantite").value) || 0;
    document.getElementById("total").value = prix * quantite;
}

function enregistrerVente() {
    const type = document.getElementById("vente-gaz-type").value;
    const poids = document.getElementById("vente-poids").value;
    const quantite = parseInt(document.getElementById("quantite").value);
    const prix = parseInt(document.getElementById("prix-unitaire").value);
    const total = prix * quantite;

    if (!isNaN(quantite) && quantite > 0) {
        const key = getStockKey(type, poids);
        let current = parseInt(localStorage.getItem(key) || "0");
        if (current >= quantite) {
            localStorage.setItem(key, current - quantite);

            let chiffre = parseInt(localStorage.getItem(getVenteTotalKey()) || "0");
            chiffre += total;
            localStorage.setItem(getVenteTotalKey(), chiffre);

            afficherStock();
            afficherChiffre();
            alert("Vente enregistrée !");
        } else {
            alert("Stock insuffisant !");
        }
    }
}

function afficherStock() {
    const table = document.querySelector("#stock-table tbody");
    table.innerHTML = "";
    const types = ["oryx", "benin"];
    const poids = ["3", "6", "12.5", "38"];
    types.forEach(type => {
        let totalParType = 0;
        poids.forEach(p => {
            if (prixGaz[type]?.[p] !== undefined) {
                const key = getStockKey(type, p);
                const qty = parseInt(localStorage.getItem(key) || "0");
                totalParType += qty;
                const row = document.createElement("tr");
                if (qty < 5) row.classList.add("low-stock");
                row.innerHTML = `<td>${type}</td><td>${p} kg</td><td>${qty}</td>`;
                table.appendChild(row);
            }
        });
        const rowTotal = document.createElement("tr");
        rowTotal.innerHTML = `<td colspan="2"><strong>Total ${type}</strong></td><td><strong>${totalParType}</strong></td>`;
        table.appendChild(rowTotal);
    });
}

function afficherChiffre() {
    const chiffre = parseInt(localStorage.getItem(getVenteTotalKey()) || "0");
    document.getElementById("chiffre-total").textContent = `${chiffre} FCFA`;
}

window.onload = function () {
    updatePrixUnitaire();
    afficherStock();
    afficherChiffre();
};
