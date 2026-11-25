
/* ========================================= */
/* GESTION DES TRAITS D'ESPÈCE              */
/* ========================================= */

/* ========================================= */
/* GESTION DES TRAITS PERSONNALISÉS         */
/* ========================================= */

let traitsPersonnalises = [];

// Ordre personnalisé des traits affichés
let ordreTraits = [];

// Identifiants des traits supprimés sur cette fiche
let traitsSupprimes = [];

let prochainIdTrait = 1;

let traitEnCoursEdition = null;

let modeReorganisationTraits = false;

let depotTraitDansZoneSuppression = false;

// Ligne actuellement déplacée
let ligneTraitEnCoursDeplacement = null;


/* ========================================= */
/* CRÉATION D'UN TRAIT PERSONNALISÉ         */
/* ========================================= */

function creerTrait(nom = "", description = "") {

    return {
        id: prochainIdTrait++,
        nom: nom,
        description: description
    };

}

/* ========================================= */
/* RÉCUPÉRATION DES TRAITS                  */
/* ========================================= */

function recupererTraitsEspece(cleEspece, cleSousRace) {

    const espece = donneesEspeces[cleEspece];

    if (!espece) return [];

    // Récupérer les traits communs à l'espèce
    const traits = espece.traits.map((trait, index) => ({
        ...trait,
        id: `espece-${cleEspece}-${index}`
    }));

    // Récupérer les traits de la sous-race
    const sousRace = espece.sousRaces[cleSousRace];

    if (sousRace) {

        const traitsSousRace = (sousRace.traits || []).map((trait, index) => ({
            ...trait,
            id: `sous-race-${cleEspece}-${cleSousRace}-${index}`
        }));

        traits.push(...traitsSousRace);

    }

    return traits;
}


/* ========================================= */
/* ACTUALISATION DU TABLEAU DES TRAITS      */
/* ========================================= */

function actualiserTableauTraits() {

    const cleEspece = document.querySelector("#espece").value;
    const cleSousRace = document.querySelector("#sous-race").value;

    // Récupérer les traits raciaux
    const traitsRaciaux = recupererTraitsEspece(
        cleEspece,
        cleSousRace
    );

    // Ajouter les traits personnalisés
    const tousLesTraits = [
        ...traitsRaciaux,
        ...traitsPersonnalises
    ];

    // Exclure les traits supprimés
    const traitsVisibles = tousLesTraits.filter(
        trait => !traitsSupprimes.includes(String(trait.id))
    );

    // Appliquer l'ordre mémorisé
    if (ordreTraits.length > 0) {

        traitsVisibles.sort((a, b) => {

        const indexA = ordreTraits.indexOf(String(a.id));
        const indexB = ordreTraits.indexOf(String(b.id));

            // Les nouveaux traits sont placés à la fin
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;

        });

    }

    // Initialiser l'ordre des traits si nécessaire
    if (ordreTraits.length === 0) {

        ordreTraits = traitsVisibles.map(trait => String(trait.id));

    }

    afficherTraitsEspece(traitsVisibles);

}


/* ========================================= */
/* AFFICHAGE DES TRAITS                     */
/* ========================================= */

function afficherTraitsEspece(traits) {

    const liste = document.getElementById("liste-traits-especes");
    const modele = document.getElementById("modele-ligne-trait");

    if (!liste || !modele) return;

    liste.innerHTML = "";

    traits.forEach(trait => {

        const nouvelleLigne = modele.content.cloneNode(true);

        const ligne = nouvelleLigne.querySelector(".ligne-trait");

        // Associer l'identifiant du trait à sa ligne HTML
        ligne.dataset.id = trait.id;

        // Autoriser le déplacement uniquement en mode réorganisation
        ligne.draggable = modeReorganisationTraits;

        nouvelleLigne.querySelector(".nom-trait").textContent = trait.nom;

        nouvelleLigne.querySelector(".description-trait").textContent =
            trait.description;

        const boutonEdition = nouvelleLigne.querySelector(
            ".bouton-edition-trait"
        );

        // Seuls les traits personnalisés sont modifiables
        if (typeof trait.id === "number") {

            boutonEdition.addEventListener("click", () => {
                ouvrirFenetreEditionTrait(trait);
            });

        } else {

            boutonEdition.hidden = true;

        }

        liste.appendChild(nouvelleLigne);

        // Configurer le déplacement de la ligne
        configurerDeplacementTrait(liste.lastElementChild);

    });

}


/* ========================================= */
/* DÉPLACEMENT DES TRAITS                   */
/* ========================================= */

function configurerDeplacementTrait(ligne) {

    // Début du déplacement
    ligne.addEventListener("dragstart", (event) => {

        if (!modeReorganisationTraits) {
            event.preventDefault();
            return;
        }

        ligneTraitEnCoursDeplacement = ligne;

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", ligne.dataset.id);

        ligne.classList.add("trait-en-deplacement");

        // Masquer l'aperçu natif qui suit la souris
        const imageVide = document.createElement("div");
        imageVide.style.width = "1px";
        imageVide.style.height = "1px";

        event.dataTransfer.setDragImage(imageVide, 0, 0);

    });

    // Survol d'une autre ligne
    ligne.addEventListener("dragover", (event) => {

        event.preventDefault();

        if (!ligneTraitEnCoursDeplacement ||
            ligneTraitEnCoursDeplacement === ligne) {
            return;
        }

        const rectangle = ligne.getBoundingClientRect();
        const milieu = rectangle.top + rectangle.height / 2;

        const liste = ligne.parentElement;

        if (event.clientY < milieu) {

            liste.insertBefore(
                ligneTraitEnCoursDeplacement,
                ligne
            );

        } else {

            liste.insertBefore(
                ligneTraitEnCoursDeplacement,
                ligne.nextElementSibling
            );

        }

    });

    // Fin du déplacement
    ligne.addEventListener("dragend", () => {

        ligne.classList.remove("trait-en-deplacement");

        // Réinitialiser l'état visuel de la zone de suppression
        zoneSuppressionTraits.classList.remove("zone-suppression-active");

        ligneTraitEnCoursDeplacement = null;


        // Suppression d'un trait
        if (depotTraitDansZoneSuppression) {

            depotTraitDansZoneSuppression = false;

            const idTrait = ligne.dataset.id;

            const trait = [
                ...recupererTraitsEspece(
                    document.querySelector("#espece").value,
                    document.querySelector("#sous-race").value
                ),
                ...traitsPersonnalises
            ].find(element => String(element.id) === idTrait);

            if (trait && confirm(`Voulez-vous vraiment supprimer le trait "${trait.nom}" ?`)) {

                traitsSupprimes.push(idTrait);

                ordreTraits = ordreTraits.filter(id => id !== idTrait);

                // Supprimer également le trait personnalisé de sa liste
                traitsPersonnalises = traitsPersonnalises.filter(
                    element => String(element.id) !== idTrait
                );

            }

            actualiserTableauTraits();
            return;

        }


        // Récupérer le nouvel ordre affiché
        const identifiantsAffiches = Array.from(
            document.querySelectorAll(
                "#liste-traits-especes .ligne-trait"
            )
        ).map(ligne => ligne.dataset.id);

        // Conserver également l'ordre des traits non affichés
        const identifiantsMasques = ordreTraits.filter(
            id => !identifiantsAffiches.includes(id)
        );

        ordreTraits = [
            ...identifiantsAffiches,
            ...identifiantsMasques
        ];

    });

}


/* ========================================= */
/* OUVERTURE DE LA FENÊTRE DES TRAITS       */
/* ========================================= */

const fenetreTrait = document.querySelector("#fenetre-trait");
const formulaireTrait = document.querySelector("#formulaire-trait");


/* OUVERTURE POUR CRÉER UN TRAIT */

function ouvrirFenetreTrait() {

    traitEnCoursEdition = null;

    formulaireTrait.reset();

    document.querySelector("#titre-fenetre-trait").textContent =
        "Nouveau trait";

    fenetreTrait.showModal();

}


/* OUVERTURE POUR MODIFIER UN TRAIT */

function ouvrirFenetreEditionTrait(trait) {

    traitEnCoursEdition = trait;

    document.querySelector("#titre-fenetre-trait").textContent =
        "Modifier un trait";

    document.querySelector("#nom-trait").value = trait.nom;

    document.querySelector("#description-trait").value =
        trait.description || "";

    fenetreTrait.showModal();

}

/* ========================================= */
/* BOUTON D'AJOUT D'UN TRAIT                */
/* ========================================= */

document.querySelector(".bouton-ajout-trait")
    .addEventListener("click", () => {

        ouvrirFenetreTrait();

    });


/* ========================================= */
/* VALIDATION DU FORMULAIRE DES TRAITS      */
/* ========================================= */

formulaireTrait.addEventListener("submit", function (event) {

    event.preventDefault();

    const nom = document.querySelector("#nom-trait").value.trim();
    const description = document.querySelector("#description-trait").value.trim();

    if (!nom) return;

    if (traitEnCoursEdition !== null) {

        // Modification d'un trait existant

        traitEnCoursEdition.nom = nom;
        traitEnCoursEdition.description = description;

    } else {

        // Création d'un nouveau trait

        const nouveauTrait = creerTrait(nom, description);

        traitsPersonnalises.push(nouveauTrait);

    }

    traitEnCoursEdition = null;

    actualiserTableauTraits();

    fenetreTrait.close();

});

/* ========================================= */
/* ANNULATION DU FORMULAIRE DES TRAITS      */
/* ========================================= */

document.querySelector("#bouton-annuler-trait")
    .addEventListener("click", () => {

        traitEnCoursEdition = null;

        formulaireTrait.reset();

        fenetreTrait.close();

    });


/* ========================================= */
/* ACTUALISATION SELON L'ESPÈCE             */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const champSousRace = document.getElementById("sous-race");

    champSousRace.addEventListener("change", () => {

        actualiserTableauTraits();

    });

});

/* ========================================= */
/* MODE RÉORGANISATION DES TRAITS           */
/* ========================================= */


document.querySelector(".bouton-reorganisation-traits")
    .addEventListener("click", () => {

        const activer = changerModeReorganisation("traits", () => {

            modeReorganisationTraits = false;

            document.querySelector(".colonne-traits")
                .classList.remove("mode-reorganisation");

            document.querySelectorAll("#liste-traits-especes .ligne-trait")
                .forEach(ligne => {
                    ligne.draggable = false;
                });

        });

        modeReorganisationTraits = activer;

        document.querySelector(".colonne-traits")
            .classList.toggle("mode-reorganisation", activer);

        document.querySelectorAll("#liste-traits-especes .ligne-trait")
            .forEach(ligne => {
                ligne.draggable = activer;
            });

    });


/* ========================================= */
/* ZONE DE SUPPRESSION DES TRAITS           */
/* ========================================= */

const zoneSuppressionTraits = document.querySelector(
    ".zone-suppression-traits"
);

// Autoriser le dépôt dans la zone
zoneSuppressionTraits.addEventListener("dragover", event => {

    if (!modeReorganisationTraits) return;

    event.preventDefault();

    depotTraitDansZoneSuppression = true;

    zoneSuppressionTraits.classList.add("zone-suppression-active");

});

// Détecter la sortie de la zone
zoneSuppressionTraits.addEventListener("dragleave", () => {

    depotTraitDansZoneSuppression = false;

    zoneSuppressionTraits.classList.remove("zone-suppression-active");

});

// Confirmer le dépôt
zoneSuppressionTraits.addEventListener("drop", event => {

    if (!modeReorganisationTraits) return;

    event.preventDefault();

    depotTraitDansZoneSuppression = true;

});