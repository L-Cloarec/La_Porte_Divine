
const fichierPortrait = document.getElementById("fichier-portrait");
const imagePortrait = document.getElementById("image-portrait");
const indicationPortrait = document.getElementById("indication-portrait");

fichierPortrait.addEventListener("change", function () {
    const fichier = fichierPortrait.files[0];

    if (fichier) {
        imagePortrait.src = URL.createObjectURL(fichier);
        imagePortrait.style.display = "block";
        indicationPortrait.style.display = "none";
    }
});



document.addEventListener("DOMContentLoaded", function () {

    const boutonAjouter = document.getElementById("ajouter-technique");
    const listeTechniques = document.getElementById("liste-techniques");
    const modeleTechnique = document.getElementById("modele-technique");

    // Ajouter une nouvelle ligne vide
    function ajouterTechnique() {
        const nouvelleLigne = modeleTechnique.content.cloneNode(true);
        listeTechniques.appendChild(nouvelleLigne);
    }

    // Créer une première ligne au chargement
    for (let i = 0; i < 10; i++) {
    ajouterTechnique();
}

    // Ajouter une ligne à chaque clic
    boutonAjouter.addEventListener("click", ajouterTechnique);

    // Supprimer la ligne correspondant au bouton cliqué
    listeTechniques.addEventListener("click", function (event) {
        if (event.target.closest(".supprimer-technique")) {
            event.target.closest("tr").remove();
        }
    });

});


document.addEventListener("DOMContentLoaded", function () {

    const boutonAjouterSort = document.getElementById("ajouter-sort");
    const listeSorts = document.getElementById("liste-sorts");
    const modeleSort = document.getElementById("modele-sort");

    // Ajouter une nouvelle ligne vide
    function ajouterSort() {
        const nouveauSort = modeleSort.content.cloneNode(true);
        listeSorts.appendChild(nouveauSort);
    }

    // Créer un premier sort au chargement
    for (let i = 0; i < 10; i++) {
        ajouterSort();
    }

    // Ajouter une ligne à chaque clic
    boutonAjouterSort.addEventListener("click", ajouterSort);

    // Supprimer uniquement le sort sélectionné
    listeSorts.addEventListener("click", function (event) {
        const bouton = event.target.closest(".supprimer-sort");

        if (bouton) {
            bouton.closest("tr").remove();
        }
    });

});


/* ==================== ÉQUIPEMENT ==================== */

document.addEventListener("DOMContentLoaded", function () {
    const boutonAjouter = document.getElementById("ajouter-equipement");
    const liste = document.getElementById("liste-equipement");
    const modele = document.getElementById("modele-equipement");

    function ajouterEquipement() {
        const nouvelleLigne = modele.content.cloneNode(true);
        liste.appendChild(nouvelleLigne);
    }

    // Créer quatre lignes au démarrage
    for (let i = 0; i < 5; i++) {
        ajouterEquipement();
    }

    // Ajouter une ligne avec le bouton
    boutonAjouter.addEventListener("click", ajouterEquipement);

    // Supprimer une ligne
    liste.addEventListener("click", function (event) {
        const bouton = event.target.closest(".supprimer-equipement");

        if (bouton) {
            bouton.closest("tr").remove();
        }
    });
});


/* ==================== INVENTAIRE ==================== */

document.addEventListener("DOMContentLoaded", function () {
    const boutonAjouter = document.getElementById("ajouter-inventaire");
    const liste = document.getElementById("liste-inventaire");
    const modele = document.getElementById("modele-inventaire");

    function ajouterObjet() {
        const nouvelleLigne = modele.content.cloneNode(true);
        liste.appendChild(nouvelleLigne);
    }

    // Créer quatre lignes au démarrage
    for (let i = 0; i < 6; i++) {
        ajouterObjet();
    }

    // Ajouter une ligne avec le bouton
    boutonAjouter.addEventListener("click", ajouterObjet);

    // Supprimer une ligne
    liste.addEventListener("click", function (event) {
        const bouton = event.target.closest(".supprimer-inventaire");

        if (bouton) {
            bouton.closest("tr").remove();
        }
    });
});


/* ==================== TRAITS D'ESPÈCES ==================== */
document.addEventListener("DOMContentLoaded", function () {
    const boutonAjouter = document.getElementById("ajouter-trait-espece");
    const liste = document.getElementById("liste-traits-especes");
    const modele = document.getElementById("modele-trait-espece");

    function ajouterTrait() {
        liste.appendChild(modele.content.cloneNode(true));
    }

    for (let i = 0; i < 5; i++) {
        ajouterTrait();
    }

    boutonAjouter.addEventListener("click", ajouterTrait);

    liste.addEventListener("click", function (event) {
        const bouton = event.target.closest(".supprimer-trait-espece");
        if (bouton) bouton.closest("tr").remove();
    });
});

/* ==================== ESSENCES ==================== */
document.addEventListener("DOMContentLoaded", function () {
    const boutonAjouter = document.getElementById("ajouter-essence");
    const liste = document.getElementById("liste-essences");
    const modele = document.getElementById("modele-essence");

    function ajouterEssence() {
        liste.appendChild(modele.content.cloneNode(true));
    }

    for (let i = 0; i < 5; i++) {
        ajouterEssence();
    }

    boutonAjouter.addEventListener("click", ajouterEssence);

    liste.addEventListener("click", function (event) {
        const bouton = event.target.closest(".supprimer-essence");
        if (bouton) bouton.closest("tr").remove();
    });
});

