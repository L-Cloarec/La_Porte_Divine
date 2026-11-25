
/* ========================================= */
/* GESTION DES ESSENCES D'ESPÈCE              */
/* ========================================= */

/* ========================================= */
/* GESTION DES ESSENCES PERSONNALISÉS         */
/* ========================================= */

// Liste initiale des essences disponibles
let essencesPersonnalises = [
    {
        nom: "Feu",
        description: "Essence de la chaleur, des flammes et de la destruction. Elle permet de consumer, brûler ou embraser."
    },
    {
        nom: "Eau",
        description: "Essence de la fluidité, de l'adaptation et du mouvement. Elle permet de manipuler les liquides et les courants."
    },
    {
        nom: "Terre",
        description: "Essence de la matière, de la stabilité et de la résistance. Elle permet de façonner la roche, le sable et les minéraux."
    },
    {
        nom: "Air",
        description: "Essence du vent, de la liberté et du mouvement. Elle permet de créer des bourrasques et de manipuler les courants aériens."
    },
    {
        nom: "Foudre",
        description: "Essence de l'énergie électrique et de la vitesse. Elle permet de produire des décharges et de transmettre des impulsions."
    },
    {
        nom: "Glace",
        description: "Essence du froid, de l'immobilité et de la conservation. Elle permet de geler, ralentir ou emprisonner."
    },
    {
        nom: "Lumière",
        description: "Essence de l'éclat, de la révélation et de la pureté. Elle permet d'illuminer, révéler ou aveugler."
    },
    {
        nom: "Ombre",
        description: "Essence de l'obscurité, du secret et de la dissimulation. Elle permet de masquer, obscurcir ou dissimuler."
    },
    {
        nom: "Vie",
        description: "Essence de la vitalité et de la croissance. Elle permet de stimuler les organismes et de favoriser la régénération."
    },
    {
        nom: "Mort",
        description: "Essence de la fin, du déclin et du repos éternel. Elle permet d'affaiblir, flétrir ou manipuler les énergies résiduelles."
    }
].map((essence, index) => ({
    id: index + 1,
    nom: essence.nom,
    description: essence.description
}));










// Ordre personnalisé des essences affichées
let ordreEssences = essencesPersonnalises.map(
    essence => String(essence.id)
);

// Identifiants des essences supprimées sur cette fiche
let essencesSupprimes = [];

let prochainIdEssence = essencesPersonnalises.length + 1;

let essenceEnCoursEdition = null;

let modeReorganisationEssences = false;

let depotEssenceDansZoneSuppression = false;

// Ligne actuellement déplacée
let ligneEssenceEnCoursDeplacement = null;


/* ========================================= */
/* CRÉATION D'UNE ESSENCE PERSONNALISÉ         */
/* ========================================= */

function creerEssence(nom = "", description = "") {

    return {
        id: prochainIdEssence++,
        nom: nom,
        description: description
    };

}

/* ========================================= */
/* ACTUALISATION DU COMPTEUR DES ESSENCES    */
/* ========================================= */

function actualiserCompteurEssences() {

    const nombreEssences = document.querySelector("#nombre-essences");
    const niveauEssences = document.querySelector("#niveau-essences");

    if (!nombreEssences || !niveauEssences) return;

    // Nombre d'essences visibles
    const nombre = essencesPersonnalises.filter(
        essence => !essencesSupprimes.includes(String(essence.id))
    ).length;

    nombreEssences.textContent = nombre;

    // Niveau actuel du personnage
    niveauEssences.textContent = champNiveauPersonnage.value;

}



/* ========================================= */
/* ACTUALISATION DU TABLEAU DES ESSENCES    */
/* ========================================= */

function actualiserTableauEssences() {

    // Récupérer les essences personnalisées
    const essencesVisibles = essencesPersonnalises.filter(
        essence => !essencesSupprimes.includes(String(essence.id))
    );

    // Appliquer l'ordre mémorisé
    if (ordreEssences.length > 0) {

        essencesVisibles.sort((a, b) => {

            const indexA = ordreEssences.indexOf(String(a.id));
            const indexB = ordreEssences.indexOf(String(b.id));

            // Les nouvelles essences sont placées à la fin
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;

        });

    }

    // Initialiser l'ordre des essences si nécessaire
    if (ordreEssences.length === 0) {

        ordreEssences = essencesVisibles.map(
            essence => String(essence.id)
        );

    }

    afficherEssences(essencesVisibles);

    actualiserCompteurEssences();

}

// Actualiser le compteur lorsque le niveau change
champNiveauPersonnage.addEventListener("input", () => {

    actualiserCompteurEssences();

});


/* ========================================= */
/* AFFICHAGE DES ESSENCES                     */
/* ========================================= */

function afficherEssences(essences) {

    const liste = document.getElementById("liste-essences");
    const modele = document.getElementById("modele-ligne-essence");

    if (!liste || !modele) return;

    liste.innerHTML = "";

    essences.forEach(essence => {

        const nouvelleLigne = modele.content.cloneNode(true);

        const ligne = nouvelleLigne.querySelector(".ligne-essence");

        // Associer l'identifiant du essence à sa ligne HTML
        ligne.dataset.id = essence.id;

        // Autoriser le déplacement uniquement en mode réorganisation
        ligne.draggable = modeReorganisationEssences;

        nouvelleLigne.querySelector(".nom-essence").textContent = essence.nom;

        nouvelleLigne.querySelector(".description-essence").textContent =
            essence.description;

        const boutonEdition = nouvelleLigne.querySelector(
            ".bouton-edition-essence"
        );

        // Ouvrir la fenêtre de modification de l'essence
        boutonEdition.addEventListener("click", () => {
            ouvrirFenetreEditionEssence(essence);
        });

        liste.appendChild(nouvelleLigne);

        // Configurer le déplacement de la ligne
        configurerDeplacementEssence(liste.lastElementChild);

    });

}


/* ========================================= */
/* DÉPLACEMENT DES ESSENCES                   */
/* ========================================= */

function configurerDeplacementEssence(ligne) {

    // Début du déplacement
    ligne.addEventListener("dragstart", (event) => {

        if (!modeReorganisationEssences) {
            event.preventDefault();
            return;
        }

        ligneEssenceEnCoursDeplacement = ligne;

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", ligne.dataset.id);

        ligne.classList.add("essence-en-deplacement");

        // Masquer l'aperçu natif qui suit la souris
        const imageVide = document.createElement("div");
        imageVide.style.width = "1px";
        imageVide.style.height = "1px";

        event.dataTransfer.setDragImage(imageVide, 0, 0);

    });

    // Survol d'une autre ligne
    ligne.addEventListener("dragover", (event) => {

        event.preventDefault();

        if (!ligneEssenceEnCoursDeplacement ||
            ligneEssenceEnCoursDeplacement === ligne) {
            return;
        }

        const rectangle = ligne.getBoundingClientRect();
        const milieu = rectangle.top + rectangle.height / 2;

        const liste = ligne.parentElement;

        if (event.clientY < milieu) {

            liste.insertBefore(
                ligneEssenceEnCoursDeplacement,
                ligne
            );

        } else {

            liste.insertBefore(
                ligneEssenceEnCoursDeplacement,
                ligne.nextElementSibling
            );

        }

    });

    // Fin du déplacement
    ligne.addEventListener("dragend", () => {

        ligne.classList.remove("essence-en-deplacement");

        // Réinitialiser l'état visuel de la zone de suppression
        zoneSuppressionEssences.classList.remove("zone-suppression-active");

        ligneEssenceEnCoursDeplacement = null;


        // Suppression d'un essence
        if (depotEssenceDansZoneSuppression) {

            depotEssenceDansZoneSuppression = false;

            const idEssence = ligne.dataset.id;

            const essence = essencesPersonnalises.find(
                element => String(element.id) === idEssence
            );

            if (essence && confirm(`Voulez-vous vraiment supprimer le essence "${essence.nom}" ?`)) {

                essencesSupprimes.push(idEssence);

                // Retirer l'essence de l'ordre mémorisé
                ordreEssences = ordreEssences.filter(
                    id => id !== idEssence
                );

                // Supprimer l'essence de la liste
                essencesPersonnalises = essencesPersonnalises.filter(
                    element => String(element.id) !== idEssence
                );

            }

            actualiserTableauEssences();
            return;

        }


        // Récupérer le nouvel ordre affiché
        const identifiantsAffiches = Array.from(
            document.querySelectorAll(
                "#liste-essences .ligne-essence"
            )
        ).map(ligne => ligne.dataset.id);

        // Conserver également l'ordre des essences non affichées
        const identifiantsMasques = ordreEssences.filter(
            id => !identifiantsAffiches.includes(id)
        );

        ordreEssences = [
            ...identifiantsAffiches,
            ...identifiantsMasques
        ];

    });

}


/* ========================================= */
/* OUVERTURE DE LA FENÊTRE DES ESSENCES       */
/* ========================================= */

const fenetreEssence = document.querySelector("#fenetre-essence");
const formulaireEssence = document.querySelector("#formulaire-essence");


/* OUVERTURE POUR CRÉER UN ESSENCE */

function ouvrirFenetreEssence() {

    essenceEnCoursEdition = null;

    formulaireEssence.reset();

    document.querySelector("#titre-fenetre-essence").textContent =
        "Nouvelle essence";

    fenetreEssence.showModal();

}


/* OUVERTURE POUR MODIFIER UN essence */

function ouvrirFenetreEditionEssence(essence) {

    essenceEnCoursEdition = essence;

    document.querySelector("#titre-fenetre-essence").textContent =
        "Modifier un essence";

    document.querySelector("#nom-essence").value = essence.nom;

    document.querySelector("#description-essence").value =
        essence.description || "";

    fenetreEssence.showModal();

}

/* ========================================= */
/* BOUTON D'AJOUT D'UNE essence                */
/* ========================================= */

document.querySelector(".bouton-ajout-essence")
    .addEventListener("click", () => {

        ouvrirFenetreEssence();

    });


/* ========================================= */
/* VALIDATION DU FORMULAIRE DES ESSENCES      */
/* ========================================= */

formulaireEssence.addEventListener("submit", function (event) {

    event.preventDefault();

    const nom = document.querySelector("#nom-essence").value.trim();
    const description = document.querySelector("#description-essence").value.trim();

    if (!nom) return;

    if (essenceEnCoursEdition !== null) {

        // Modification d'une essence existant

        essenceEnCoursEdition.nom = nom;
        essenceEnCoursEdition.description = description;

    } else {

        // Création d'un nouveau essence

        const nouveauEssence = creerEssence(nom, description);

        essencesPersonnalises.push(nouveauEssence);

    }

    essenceEnCoursEdition = null;

    actualiserTableauEssences();

    fenetreEssence.close();

});

/* ========================================= */
/* ANNULATION DU FORMULAIRE DES ESSENCES      */
/* ========================================= */

document.querySelector("#bouton-annuler-essence")
    .addEventListener("click", () => {

        essenceEnCoursEdition = null;

        formulaireEssence.reset();

        fenetreEssence.close();

    });


/* ========================================= */
/* MODE RÉORGANISATION DES ESSENCES           */
/* ========================================= */

document.querySelector(".bouton-reorganisation-essences")
    .addEventListener("click", () => {

        const activer = changerModeReorganisation("essences", () => {

            modeReorganisationEssences = false;

            document.querySelector(".colonne-essences")
                .classList.remove("mode-reorganisation");

            document.querySelectorAll("#liste-essences .ligne-essence")
                .forEach(ligne => {
                    ligne.draggable = false;
                });

        });

        modeReorganisationEssences = activer;

        document.querySelector(".colonne-essences")
            .classList.toggle("mode-reorganisation", activer);

        document.querySelectorAll("#liste-essences .ligne-essence")
            .forEach(ligne => {
                ligne.draggable = activer;
            });

    });

/* ========================================= */
/* ZONE DE SUPPRESSION DES ESSENCES           */
/* ========================================= */

const zoneSuppressionEssences = document.querySelector(
    ".zone-suppression-essences"
);

// Autoriser le dépôt dans la zone
zoneSuppressionEssences.addEventListener("dragover", event => {

    if (!modeReorganisationEssences) return;

    event.preventDefault();

    depotEssenceDansZoneSuppression = true;

    zoneSuppressionEssences.classList.add("zone-suppression-active");

});

// Détecter la sortie de la zone
zoneSuppressionEssences.addEventListener("dragleave", () => {

    depotEssenceDansZoneSuppression = false;

    zoneSuppressionEssences.classList.remove("zone-suppression-active");

});

// Confirmer le dépôt
zoneSuppressionEssences.addEventListener("drop", event => {

    if (!modeReorganisationEssences) return;

    event.preventDefault();

    depotEssenceDansZoneSuppression = true;

});

actualiserTableauEssences();