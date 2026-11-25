/* =======  Sous-zone 2 :  Classe d'armure, Points de vie & Dés de vie ======= */
/* =======  Sous-zone 2 :  Classe d'armure, Points de vie & Dés de vie ======= */
/* =======  Sous-zone 2 :  Classe d'armure, Points de vie & Dés de vie ======= */

// DEBUT CALCUL DES PV MAX
// DEBUT CALCUL DES PV MAX

const champEspecePV = document.getElementById("espece");
const champSousRacePV = document.getElementById("sous-race");

const pvActuels = document.querySelector(".valeur-pv-actuelle");
const pvMaximum = document.querySelector(".valeur-pv-max");
const remplissagePV = document.querySelector(".remplissage-pv");
const pvTemporaires = document.querySelector(".valeur-pv-temp");

// Éléments de gestion des dégâts et des soins
const valeurDegats = document.querySelector(".valeur-nombre-degats");
const boutonDegats = document.querySelector(".bouton-degats");
const boutonSoin = document.querySelector(".bouton-soin");

// Actualiser les PV au niveau 1 selon l'espèce et la Constitution
function actualiserPVNiveau1(initialiserPVActuels = false) {

    // Récupérer l'espèce et la sous-race sélectionnées
    const cleEspece = champEspecePV.value;
    const cleSousRace = champSousRacePV.value;
    const espece = donneesEspeces[cleEspece];

    if (!espece) return;

    const sousRace = espece.sousRaces?.[cleSousRace];

    // Récupérer le dé de vie racial, en tenant compte de la sous-race
    const deVie = sousRace?.caracteristiques?.deVie
        ?? espece.caracteristiques.deVie;

    // Récupérer le modificateur de Constitution
    const champModificateurCON = document.querySelector(".champ-modificateur-constitution");

    if (!champModificateurCON) return;

    const modificateurCON = Number(champModificateurCON.value);

    // Calculer les PV maximum au niveau 1
    const nouveauxPVMax = deVie.faces + modificateurCON;

    pvMaximum.value = nouveauxPVMax;

    // Initialiser ou limiter les PV actuels
    if (initialiserPVActuels) {
        pvActuels.value = nouveauxPVMax;
    }
    else {
        pvActuels.value = Math.min(
            Number(pvActuels.value),
            nouveauxPVMax
        );
    }

    // Actualiser la barre de PV
    actualiserBarrePV();
}

// Écouter les changements d'espèce et de sous-race
champEspecePV.addEventListener("change", () => {
    actualiserPVNiveau1(true);
});

champSousRacePV.addEventListener("change", () => {
    actualiserPVNiveau1(true);
});

// Écouter les changements de Constitution
document.querySelector(".champ-valeur-constitution")
    .addEventListener("input", () => {
        actualiserPVNiveau1();
    });

// Initialiser les PV au chargement
actualiserPVNiveau1(true);

// FIN CALCUL DES PV MAX
// FIN CALCUL DES PV MAX



/* =====================================================
   GESTION DE LA BARRE DE POINTS DE VIE
===================================================== */



function actualiserBarrePV() {

    // Gestion des alertes visuelles selon les PV
    const cadrePV = document.querySelector(".cadre-points-de-vie");

    // Réinitialisation des alertes
    cadrePV.classList.remove(
        "alerte-pv-legere",
        "alerte-pv-moyenne",
        "alerte-pv-critique"
    );

    const actuels = Number(pvActuels.value);
    const maximum = Number(pvMaximum.value);

    // Évite les calculs invalides
    if (
        pvActuels.value.trim() === "" ||
        pvMaximum.value.trim() === "" ||
        !Number.isFinite(actuels) ||
        !Number.isFinite(maximum) ||
        maximum <= 0
    ) {
        remplissagePV.style.width = "0%";
        return;
    }

    // Calcul du pourcentage
    const pourcentage = Math.min(
        100,
        Math.max(0, (actuels / maximum) * 100)
    );

    // Largeur de la barre
    remplissagePV.style.width = pourcentage + "%";

    // Couleur dynamique : vert vers rouge
    const teinte = pourcentage * 1.2;

    remplissagePV.style.backgroundColor =
    `hsl(${teinte}, 100%, 45%)`;

    // Gestion de la pulsation selon les PV
    if (pourcentage <= 75) {

        cadrePV.classList.add("alerte-pv");

        let vitesse;

        if (pourcentage <= 25) {
            vitesse = "0.6s";
        }
        else if (pourcentage <= 50) {
            vitesse = "1.2s";
        }
        else {
            vitesse = "2s";
        }

        cadrePV.style.setProperty("--vitesse-pulsation", vitesse);

    }
    else {
        cadrePV.classList.remove("alerte-pv");
    }

}


/* =====================================================
   APPLICATION DES DÉGÂTS
===================================================== */

function appliquerDegats(degats) {

    // Vérification de la valeur
    if (!Number.isFinite(degats) || degats <= 0) {
        return;
    }

    let degatsRestants = degats;

    // Les PV temporaires absorbent les dégâts en premier
    const temporaires = Number(pvTemporaires.value) || 0;

    if (temporaires > 0) {

        const degatsAbsorbes = Math.min(temporaires, degatsRestants);

        pvTemporaires.value = temporaires - degatsAbsorbes;

        degatsRestants -= degatsAbsorbes;
    }

    // Le surplus est retiré des PV actuels
    if (degatsRestants > 0) {

        const actuels = Number(pvActuels.value);

        pvActuels.value = Math.max(0, actuels - degatsRestants);
    }

    // Actualisation de la barre de PV
    actualiserBarrePV();
}

/* =====================================================
   APPLICATION DES SOINS
===================================================== */

function appliquerSoin(soin) {

    // Vérification de la valeur
    if (!Number.isFinite(soin) || soin <= 0) {
        return;
    }

    const actuels = Number(pvActuels.value);
    const maximum = Number(pvMaximum.value);

    // Vérification des PV actuels et maximum
    if (
        !Number.isFinite(actuels) ||
        !Number.isFinite(maximum) ||
        maximum <= 0
    ) {
        return;
    }

    // Ajout des soins sans dépasser les PV maximum
    pvActuels.value = Math.min(maximum, actuels + soin);

    // Actualisation de la barre de PV
    actualiserBarrePV();
}

/* =====================================================
   ÉCOUTEURS DES BOUTONS DÉGÂTS ET SOINS
===================================================== */

// Bouton dégâts
boutonDegats.addEventListener("click", () => {

    const degats = Number(valeurDegats.value);

    appliquerDegats(degats);

});

// Bouton soins
boutonSoin.addEventListener("click", () => {

    const soin = Number(valeurDegats.value);

    appliquerSoin(soin);

});

// Actualisation lors d'une modification des PV
pvActuels.addEventListener("input", actualiserBarrePV);
pvMaximum.addEventListener("input", actualiserBarrePV);

// Initialisation
actualiserBarrePV();




// DEBUT INITIALISATION NOMBRE DES DE VIE
// DEBUT INITIALISATION NOMBRE DES DE VIE
const champDeVieTotal = document.querySelector(".valeur-de-vie-total");
const champDeVieActuelle = document.querySelector(".valeur-de-vie-actuelle");

// Actualiser le total de dés de vie selon le niveau
function actualiserTotalDeVie(initialisation = false) {
    if (!champNiveauPersonnage || !champDeVieTotal) return;

    champDeVieTotal.value = champNiveauPersonnage.value;

    // Initialiser les dés de vie disponibles uniquement au chargement
    if (initialisation && champDeVieActuelle) {
        champDeVieActuelle.value = champNiveauPersonnage.value;
    }

    // Vérifier que les dés disponibles ne dépassent pas le total
    verifierDesDeVieDisponibles();

    // Vérifier que le total ne dépasse pas le niveau
    verifierTotalDeVieNiveau();
}

// Limiter les dés de vie disponibles au total
function verifierDesDeVieDisponibles() {
    if (!champDeVieActuelle || !champDeVieTotal) return;

    const disponibles = Number(champDeVieActuelle.value);
    const total = Number(champDeVieTotal.value);

    if (disponibles > total) {
        champDeVieActuelle.value = total;
    }
}

// Limiter le total de dés de vie au niveau du personnage
function verifierTotalDeVieNiveau() {
    if (!champDeVieTotal || !champNiveauPersonnage) return;

    const total = Number(champDeVieTotal.value);
    const niveau = Number(champNiveauPersonnage.value);

    if (total > niveau) {
        champDeVieTotal.value = niveau;
    }
}

// Écouter les modifications manuelles du total de dés de vie
champDeVieTotal.addEventListener("input", verifierTotalDeVieNiveau);

// Écouter les modifications des dés de vie disponibles
champDeVieActuelle.addEventListener("input", verifierDesDeVieDisponibles);

// Vérifier la limite lors d'un changement du total
champDeVieTotal.addEventListener("input", verifierDesDeVieDisponibles);

// Écouter les changements de niveau
champNiveauPersonnage.addEventListener("input", () => actualiserTotalDeVie());

// Initialiser le total et les dés de vie disponibles au chargement
actualiserTotalDeVie(true);