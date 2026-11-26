/* =====================================================
   CALCUL DE LA MANA MAXIMALE
===================================================== */

// Calcul du mana maximum
function calculerManaMaximum() {

    const niveau = Number(champNiveauPersonnage.value);
    const bonusIncantation = Number(champBonusIncantation.value);

    if (
        champNiveauPersonnage.value.trim() === "" ||
        champBonusIncantation.value.trim() === "" ||
        !Number.isFinite(niveau) ||
        !Number.isFinite(bonusIncantation)
    ) {
        manaMaximum.value = "XX";
        return;
    }

    manaMaximum.value = 5 + (2 * niveau) + (2 * bonusIncantation);

}

// Mise à jour automatique lorsque le niveau change
champNiveauPersonnage.addEventListener("input", () => {
    actualiserManaApresModification();
});

// Mise à jour automatique lorsque le bonus d'incantation change
champBonusIncantation.addEventListener("input", () => {
    actualiserManaApresModification();
});

/* =====================================================
   GESTION DE LA BARRE DE POINTS DE MANA
===================================================== */

const manaActuel = document.querySelector(".valeur-mana-actuelle");
const manaMaximum = document.querySelector(".valeur-mana-max");
const remplissageMana = document.querySelector(".remplissage-mana");
const manaGestion = document.querySelector(".valeur-mana-gestion");

const boutonManaMoins = document.querySelector(".bouton-mana-moins");
const boutonManaPlus = document.querySelector(".bouton-mana-plus");

const nombreFacesDesMana = document.querySelector(".nombre-faces-des-mana");

// INITIALISATION DES POINTS DE MANA
const champManaTotal = document.querySelector(".valeur-des-mana-max");
const champManaActuel = document.querySelector(".valeur-des-mana-actuelle");

function actualiserBarreMana() {

    const actuels = Number(manaActuel.value);
    const maximum = Number(manaMaximum.value);

    // Évite les calculs invalides
    if (
        manaActuel.value.trim() === "" ||
        manaMaximum.value.trim() === "" ||
        !Number.isFinite(actuels) ||
        !Number.isFinite(maximum) ||
        maximum <= 0
    ) {
        remplissageMana.style.width = "0%";
        return;
    }

    // Calcul du pourcentage
    const pourcentage = Math.min(
        100,
        Math.max(0, (actuels / maximum) * 100)
    );

    // Actualisation de la largeur de la barre
    remplissageMana.style.width = pourcentage + "%";
}


/* =====================================================
   ACTUALISATION DU MANA APRÈS MODIFICATION DU MAXIMUM
===================================================== */

function actualiserManaApresModification() {

    // Recalculer le mana maximum
    calculerManaMaximum();

    const actuels = Number(manaActuel.value);
    const maximum = Number(manaMaximum.value);

    // Vérifier les valeurs
    if (
        !Number.isFinite(actuels) ||
        !Number.isFinite(maximum) ||
        maximum <= 0
    ) {
        return;
    }

    // Empêcher les points actuels de dépasser le maximum
    manaActuel.value = Math.min(actuels, maximum);

    // Actualiser la barre
    actualiserBarreMana();
}

/* =====================================================
   DÉPENSE DES POINTS DE MANA
===================================================== */

function depenserMana(quantite) {

    // Vérification de la valeur
    if (!Number.isFinite(quantite) || quantite <= 0) {
        return;
    }

    const actuels = Number(manaActuel.value);

    // Vérification des points actuels
    if (!Number.isFinite(actuels)) {
        return;
    }

    // Retrait des points sans descendre sous zéro
    manaActuel.value = Math.max(0, actuels - quantite);

    // Actualisation de la barre de mana
    actualiserBarreMana();
}

/* =====================================================
   RÉCUPÉRATION DES POINTS DE MANA
===================================================== */

function recupererMana(quantite) {

    // Vérification de la valeur
    if (!Number.isFinite(quantite) || quantite <= 0) {
        return;
    }

    const actuels = Number(manaActuel.value);
    const maximum = Number(manaMaximum.value);

    // Vérification des points actuels et maximum
    if (
        !Number.isFinite(actuels) ||
        !Number.isFinite(maximum) ||
        maximum <= 0
    ) {
        return;
    }

    // Ajout des points sans dépasser le maximum
    manaActuel.value = Math.min(maximum, actuels + quantite);

    // Actualisation de la barre de mana
    actualiserBarreMana();
}

/* =====================================================
   ÉCOUTEURS DES BOUTONS DE MANA
===================================================== */

// Bouton de dépense
boutonManaMoins.addEventListener("click", () => {

    const quantite = Number(manaGestion.value);

    depenserMana(quantite);

});

// Bouton de récupération
boutonManaPlus.addEventListener("click", () => {

    const quantite = Number(manaGestion.value);

    recupererMana(quantite);

});

// Vérification lors d'une modification du mana actuel
manaActuel.addEventListener("input", () => {

    const actuels = Number(manaActuel.value);
    const maximum = Number(manaMaximum.value);

    if (
        manaActuel.value.trim() !== "" &&
        Number.isFinite(actuels) &&
        Number.isFinite(maximum) &&
        actuels > maximum
    ) {
        manaActuel.value = maximum;
    }

    actualiserBarreMana();
});

// Actualisation lors d'une modification du mana maximum
manaMaximum.addEventListener("input", actualiserManaApresModification);

// Initialisation des bonus au chargement
selectionnerBonusCombat(boutonForceCombat, valeurForce);

selectionnerBonusIncantation(
    boutonIntelligenceIncantation,
    valeurIntelligence
);

// Initialisation de la mana
calculerManaMaximum();

// Initialiser les points de mana actuels au maximum
manaActuel.value = manaMaximum.value;

// Actualiser la barre de mana
actualiserBarreMana();


// Actualiser le type de dé de mana selon le bonus d'incantation
function actualiserTypeDesMana() {
    const bonusIncantation = Number(champBonusIncantation.value);

    if (
        champBonusIncantation.value.trim() === "" ||
        !Number.isFinite(bonusIncantation)
    ) {
        nombreFacesDesMana.value = "XX";
    }
    else if (bonusIncantation < 0) {
        nombreFacesDesMana.value = "-";
        champManaActuel.value = "-";
        champManaTotal.value = "-";
    }
    else {
        champManaTotal.value = champNiveauPersonnage.value;
        champManaActuel.value = champNiveauPersonnage.value;

        if (bonusIncantation === 0) {
            nombreFacesDesMana.value = 4;
        }
        else if (bonusIncantation === 1) {
            nombreFacesDesMana.value = 6;
        }
        else if (bonusIncantation <= 3) {
            nombreFacesDesMana.value = 8;
        }
        else {
            nombreFacesDesMana.value = 10;
        }
    }
}

champBonusIncantation.addEventListener("input", () => {
    actualiserTypeDesMana();
});




// Actualiser le mana total
function actualiserTotalMana(initialisation = false) {

    if (!champNiveauPersonnage || !champManaTotal) return;

    // Le nombre total de dés de mana correspond au niveau
    champManaTotal.value = champNiveauPersonnage.value;

    // Initialiser le mana disponible uniquement au chargement
    if (initialisation && champManaActuel) {
        champManaActuel.value = champManaTotal.value;
    }

    // Vérifier que le mana disponible ne dépasse pas le total
    verifierManaDisponible();

    // Vérifier que le total respecte sa valeur calculée
    verifierTotalMana();
}

// Limiter le mana disponible au mana total
function verifierManaDisponible() {

    if (!champManaActuel || !champManaTotal) return;

    const disponibles = Number(champManaActuel.value);
    const total = Number(champManaTotal.value);

    if (disponibles > total) {
        champManaActuel.value = total;
    }
}

// Limiter le mana total à sa valeur calculée
function verifierTotalMana() {

    if (!champManaTotal) return;

    const total = Number(champManaTotal.value);
    const niveau = Number(champNiveauPersonnage.value);

    if (total > niveau) {
        champManaTotal.value = niveau;
    }
}

// Écouter les modifications manuelles du mana total
champManaTotal.addEventListener("input", verifierTotalMana);

// Écouter les modifications du mana disponible
champManaActuel.addEventListener("input", verifierManaDisponible);

// Vérifier la limite lors d'un changement du mana total
champManaTotal.addEventListener("input", verifierManaDisponible);

// Écouter les changements de niveau
champNiveauPersonnage.addEventListener("input", () => actualiserTotalMana());

// Initialiser le mana total et le mana disponible au chargement
actualiserTotalMana(true);

actualiserTypeDesMana();