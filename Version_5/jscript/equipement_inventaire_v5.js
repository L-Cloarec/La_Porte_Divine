/* =====================================================
   DONNÉES ÉQUIPEMENT ET INVENTAIRE
===================================================== */

let objetsEquipementInventaire = [];
let prochainIdObjet = 1;
let objetEnCoursEdition = null;
let modeReorganisationObjets = false;
let depotObjetDansZoneSuppression = false;

/* =====================================================
   CRÉATION D'UN OBJET
===================================================== */

function creerObjet(
    nom = "",
    poids = 0,
    quantite = 1,
    emplacement = "inventaire",
    description = ""
) {
    return {
        id: prochainIdObjet++,
        nom: nom,
        poids: poids,
        quantite: quantite,
        emplacement: emplacement,
        equipe: false,
        description: description
    };
}


/* =====================================================
   DÉPLACEMENT DES LIGNES
===================================================== */

function configurerDeplacementObjet(ligne) {

    ligne.addEventListener("dragover", event => {

        if (!modeReorganisationObjets) return;

        const ligneEnDeplacement = document.querySelector(".ligne-en-deplacement");

        if (!ligneEnDeplacement || ligneEnDeplacement === ligne) return;

        // Autoriser le déplacement entre les tableaux
        const memeTableau = ligneEnDeplacement.parentNode === ligne.parentNode;

        const tableauEquipement = ligne.closest(".conteneur-lignes-equipement");
        const tableauInventaire = ligne.closest(".conteneur-lignes-inventaire");

        const destinationValide = tableauEquipement || tableauInventaire;

        if (!memeTableau && !destinationValide) return;

        event.preventDefault();


        // Adapter l'apparence selon le tableau survolé
        const emplacementCible = ligne.parentNode.id === "liste-equipement"
            ? "equipement"
            : "inventaire";

        const ligneEnCours = document.querySelector(".ligne-en-deplacement");

        const caseEquipe = ligneEnCours.querySelector(".case-equipe-equipement");

        if (emplacementCible === "equipement" && !caseEquipe) {

            // Ajouter temporairement la case "Équipé"
            const celluleNom = ligneEnCours.querySelector(
                ".conteneur-nom-equipement, .nom-inventaire"
            );

            const objet = objetsEquipementInventaire.find(
                element => element.id === Number(ligneEnCours.dataset.id)
            );

            const nouvelleCase = document.createElement("input");

            nouvelleCase.type = "checkbox";
            nouvelleCase.className = "case-equipe-equipement";
            nouvelleCase.checked = Boolean(objet?.equipe);
            nouvelleCase.disabled = true;

            celluleNom.insertBefore(nouvelleCase, celluleNom.firstChild);

        }

        else if (emplacementCible === "inventaire" && caseEquipe) {

            // Retirer temporairement la case "Équipé"
            caseEquipe.remove();

        }


        const rectangle = ligne.getBoundingClientRect();
        const apres = event.clientY > rectangle.top + rectangle.height / 2;

        ligne.parentNode.insertBefore(
            ligneEnDeplacement,
            apres ? ligne.nextSibling : ligne
        );

    });

    ligne.addEventListener("dragstart", event => {

        if (!modeReorganisationObjets) {
            event.preventDefault();
            return;
        }

        depotObjetDansZoneSuppression = false;

        ligne.classList.add("ligne-en-deplacement");

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", ligne.dataset.id);

        // Masquer l'aperçu natif qui suit la souris
        const imageVide = document.createElement("div");
        imageVide.style.width = "1px";
        imageVide.style.height = "1px";

        event.dataTransfer.setDragImage(imageVide, 0, 0);

    });

    ligne.addEventListener("dragend", () => {

        ligne.classList.remove("ligne-en-deplacement");

        // Suppression d'un objet
        if (depotObjetDansZoneSuppression) {

            depotObjetDansZoneSuppression = false;

            const objet = objetsEquipementInventaire.find(
                objet => objet.id === Number(ligne.dataset.id)
            );

            if (objet && confirm(`Voulez-vous vraiment supprimer l'objet "${objet.nom}" ?`)) {

                const index = objetsEquipementInventaire.findIndex(
                    element => element.id === objet.id
                );

                if (index !== -1) {
                    objetsEquipementInventaire.splice(index, 1);
                }

            }

            afficherObjetsEquipementInventaire();
            return;

        }

        // Enregistrement du nouvel ordre et de l'emplacement

        const tbody = ligne.parentNode;

        // Déterminer le nouvel emplacement
        const nouvelEmplacement = tbody.id === "liste-equipement"
            ? "equipement"
            : "inventaire";

        // Récupérer l'objet déplacé
        const objetDeplace = objetsEquipementInventaire.find(
            objet => objet.id === Number(ligne.dataset.id)
        );

        if (objetDeplace) {
            objetDeplace.emplacement = nouvelEmplacement;
        }

        // Mettre à jour l'ordre des objets dans le tableau de destination
        const ids = Array.from(tbody.querySelectorAll("tr"))
            .map(element => Number(element.dataset.id));

        const objetsTries = ids.map(id =>
            objetsEquipementInventaire.find(objet => objet.id === id)
        );

        let index = 0;

        objetsEquipementInventaire = objetsEquipementInventaire.map(objet => {

            if (objet.emplacement === nouvelEmplacement) {
                return objetsTries[index++];
            }

            return objet;

        });

        afficherObjetsEquipementInventaire();

    });
}

/* =====================================================
   ZONES DE SUPPRESSION DES OBJETS
===================================================== */

document.querySelectorAll(".zone-suppression-objets").forEach(zone => {

    zone.addEventListener("dragenter", event => {

        if (!modeReorganisationObjets) return;

        event.preventDefault();
        zone.classList.add("zone-suppression-active");

    });

    zone.addEventListener("dragover", event => {

        if (!modeReorganisationObjets) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

    });

    zone.addEventListener("dragleave", event => {

        if (!modeReorganisationObjets) return;

        if (!zone.contains(event.relatedTarget)) {
            zone.classList.remove("zone-suppression-active");
        }

    });

    zone.addEventListener("drop", event => {

        if (!modeReorganisationObjets) return;

        event.preventDefault();

        depotObjetDansZoneSuppression = true;

        zone.classList.remove("zone-suppression-active");

    });

});

/* =====================================================
   AFFICHAGE ÉQUIPEMENT ET INVENTAIRE
===================================================== */

function afficherObjetsEquipementInventaire() {

    const tbodyEquipement = document.querySelector("#liste-equipement");
    const tbodyInventaire = document.querySelector("#liste-inventaire");

    const modeleEquipement = document.querySelector("#modele-ligne-equipement");
    const modeleInventaire = document.querySelector("#modele-ligne-inventaire");

    if (!tbodyEquipement || !tbodyInventaire) return;
    if (!modeleEquipement || !modeleInventaire) return;

    tbodyEquipement.innerHTML = "";
    tbodyInventaire.innerHTML = "";

    objetsEquipementInventaire.forEach(objet => {

        if (objet.emplacement === "equipement") {

            const ligne = modeleEquipement.content.cloneNode(true);

            const ligneAjoutee = ligne.querySelector(".ligne-equipement");

            ligneAjoutee.dataset.id = objet.id;
            ligneAjoutee.dataset.emplacement = objet.emplacement;
            ligneAjoutee.draggable = modeReorganisationObjets;
            configurerDeplacementObjet(ligneAjoutee);

            ligne.querySelector(".texte-nom-equipement").textContent = objet.nom;
            ligne.querySelector(".poids-equipement").textContent = objet.poids;
            ligne.querySelector(".quantite-equipement").textContent = objet.quantite;

            const caseEquipe = ligne.querySelector(".case-equipe-equipement");
            caseEquipe.checked = objet.equipe;

            caseEquipe.addEventListener("change", () => {
                objet.equipe = caseEquipe.checked;
            });

            ligne.querySelector(".bouton-edition-equipement")
                .addEventListener("click", () => {
                    ouvrirFenetreEditionObjet(objet);
                });

            tbodyEquipement.appendChild(ligne);

        } else if (objet.emplacement === "inventaire") {

            const ligne = modeleInventaire.content.cloneNode(true);

            const ligneAjoutee = ligne.querySelector(".ligne-inventaire");

            ligneAjoutee.dataset.id = objet.id;
            ligneAjoutee.dataset.emplacement = objet.emplacement;
            ligneAjoutee.draggable = modeReorganisationObjets;
            configurerDeplacementObjet(ligneAjoutee);

            ligne.querySelector(".nom-inventaire").textContent = objet.nom;
            ligne.querySelector(".poids-inventaire").textContent = objet.poids;
            ligne.querySelector(".quantite-inventaire").textContent = objet.quantite;
            ligne.querySelector(".bouton-edition-inventaire")
                .addEventListener("click", () => {
                    ouvrirFenetreEditionObjet(objet);
                });
            tbodyInventaire.appendChild(ligne);

        }

    });

}

/* =====================================================
   OUVERTURE DU FORMULAIRE OBJET
===================================================== */

const fenetreObjet = document.querySelector("#fenetre-objet");
const formulaireObjet = document.querySelector("#formulaire-objet");

function ouvrirFenetreObjet() {

    formulaireObjet.reset();

    document.querySelector("#titre-fenetre-objet").textContent = "Nouvel objet";

    document.querySelector("#emplacement-objet").value = emplacementNouvelObjet;

    fenetreObjet.showModal();

}

/* =====================================================
   OUVERTURE DU FORMULAIRE EN MODE ÉDITION
===================================================== */

function ouvrirFenetreEditionObjet(objet) {

    objetEnCoursEdition = objet;

    document.querySelector("#titre-fenetre-objet").textContent = "Modifier un objet";

    document.querySelector("#nom-objet").value = objet.nom;
    document.querySelector("#poids-objet").value = objet.poids;
    document.querySelector("#quantite-objet").value = objet.quantite;
    document.querySelector("#description-objet").value = objet.description || "";

    document.querySelector("#emplacement-objet").value = objet.emplacement;

    fenetreObjet.showModal();

}



/* =====================================================
   BOUTONS D'AJOUT D'OBJET
===================================================== */

let emplacementNouvelObjet = "inventaire";

document.querySelector(".bouton-ajout-equipement")
    .addEventListener("click", () => {

        emplacementNouvelObjet = "equipement";
        ouvrirFenetreObjet();

    });

document.querySelector(".bouton-ajout-inventaire")
    .addEventListener("click", () => {

        emplacementNouvelObjet = "inventaire";
        ouvrirFenetreObjet();

    });

/* =====================================================
   RÉCUPÉRATION DES DONNÉES DU FORMULAIRE
===================================================== */

function recupererDonneesObjet() {

    return {
        nom: document.querySelector("#nom-objet").value.trim(),

        poids: Number(document.querySelector("#poids-objet").value) || 0,

        quantite: Number(document.querySelector("#quantite-objet").value) || 1,

        description: document.querySelector("#description-objet").value.trim(),

        emplacement: document.querySelector("#emplacement-objet").value
    };

}

/* =====================================================
   VALIDATION DU FORMULAIRE OBJET
===================================================== */

formulaireObjet.addEventListener("submit", function (event) {

    event.preventDefault();

    const donnees = recupererDonneesObjet();

    if (objetEnCoursEdition !== null) {

        // Modification d'un objet existant

        objetEnCoursEdition.nom = donnees.nom;
        objetEnCoursEdition.poids = donnees.poids;
        objetEnCoursEdition.quantite = donnees.quantite;
        objetEnCoursEdition.description = donnees.description;

        objetEnCoursEdition.emplacement = donnees.emplacement;

        // Un objet déplacé dans l'inventaire n'est plus équipé
        if (donnees.emplacement === "inventaire") {
            objetEnCoursEdition.equipe = false;
        }

    } else {

        // Création d'un nouvel objet

        const nouvelObjet = creerObjet(
            donnees.nom,
            donnees.poids,
            donnees.quantite,
            donnees.emplacement,
            donnees.description
        );

        objetsEquipementInventaire.push(nouvelObjet);

    }

    objetEnCoursEdition = null;

    afficherObjetsEquipementInventaire();

    fenetreObjet.close();

});

/* =====================================================
   ANNULATION DU FORMULAIRE OBJET
===================================================== */

document.querySelector("#bouton-annuler-objet")
    .addEventListener("click", () => {

        objetEnCoursEdition = null;

        fenetreObjet.close();

    });



/* =====================================================
   INITIALISATION ÉQUIPEMENT ET INVENTAIRE
===================================================== */

function initialiserEquipementInventaire() {
    afficherObjetsEquipementInventaire();
}

document.addEventListener("DOMContentLoaded", initialiserEquipementInventaire);

/* =====================================================
   MODE RÉORGANISATION ÉQUIPEMENT ET INVENTAIRE
===================================================== */


function activerModeReorganisationObjets() {

    const colonne = document.querySelector(".colonne-equipement-inventaire");

    const activer = changerModeReorganisation("objets", () => {

        modeReorganisationObjets = false;

        colonne.classList.remove("mode-reorganisation");

        document.querySelector(".bouton-ordre-equipement")
            .classList.remove("actif");

        document.querySelector(".bouton-ordre-inventaire")
            .classList.remove("actif");

        afficherObjetsEquipementInventaire();

    });

    modeReorganisationObjets = activer;

    colonne.classList.toggle("mode-reorganisation", activer);

    document.querySelector(".bouton-ordre-equipement")
        .classList.toggle("actif", activer);

    document.querySelector(".bouton-ordre-inventaire")
        .classList.toggle("actif", activer);

    afficherObjetsEquipementInventaire();

}


document.querySelector(".bouton-ordre-equipement")
    .addEventListener("click", activerModeReorganisationObjets);

document.querySelector(".bouton-ordre-inventaire")
    .addEventListener("click", activerModeReorganisationObjets);




/* =====================================================
   OBJET TEST TEMPORAIRE
===================================================== */



afficherObjetsEquipementInventaire();