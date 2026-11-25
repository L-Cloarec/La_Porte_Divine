/* ======= Sous-zone 1 : Identité, Espèce, Archétype, Bouton portrait, bouton inspiration, Portrait, Indication du niveau ======= */
/* ======= Sous-zone 1 : Identité, Espèce, Archétype, Bouton portrait, bouton inspiration, Portrait, Indication du niveau ======= */
/* ======= Sous-zone 1 : Identité, Espèce, Archétype, Bouton portrait, bouton inspiration, Portrait, Indication du niveau ======= */
/* ========================================= */
/* NIVEAU SUPERIEUR                    */
/* ========================================= */
const boutonNiveauSuperieur = document.querySelector(".bouton-niveau-superieur");
const champNiveauPersonnage = document.querySelector("#valeur-niveau-personnage");

boutonNiveauSuperieur.addEventListener("click", () => {

    const niveauActuel = Number(champNiveauPersonnage.value);

    if (!Number.isFinite(niveauActuel) || niveauActuel >= 20) return;

    champNiveauPersonnage.value = niveauActuel + 1;

    champNiveauPersonnage.dispatchEvent(new Event("input", { bubbles: true }));
    champNiveauPersonnage.dispatchEvent(new Event("change", { bubbles: true }));

});

/* ========================================= */
/* INSPIRATION HÉROÏQUE                     */
/* ========================================= */

const boutonInspiration = document.querySelector(".bouton-inspiration");

let inspirationActive = false;

function actualiserBoutonInspiration() {

    boutonInspiration.innerHTML = inspirationActive
        ? '<span class="symbole-inspiration actif">✦</span> Inspiration'
        : '<span class="symbole-inspiration">✧</span> Inspiration';
}

boutonInspiration.addEventListener("click", () => {

    inspirationActive = !inspirationActive;
    actualiserBoutonInspiration();

});

actualiserBoutonInspiration();


/* ========================================= */
/* Empêcher le niveau de déclencher le sélecteur de portrait    */
/* ========================================= */

const niveauPersonnage = document.querySelector(".niveau-personnage");


niveauPersonnage.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
});

/* ========================================= */
/* PORTRAIT DU PERSONNAGE                   */
/* ========================================= */

const fichierPortrait = document.getElementById("fichier-portrait");
const imagePortrait = document.getElementById("image-portrait");
const indicationPortrait = document.getElementById("indication-portrait");

// Charger une image sélectionnée
fichierPortrait.addEventListener("change", () => {

    const fichier = fichierPortrait.files[0];

    if (!fichier) return;

    // Vérifier qu'il s'agit bien d'une image
    if (!fichier.type.startsWith("image/")) return;

    // Créer une URL temporaire pour afficher l'image
    const urlImage = URL.createObjectURL(fichier);

    imagePortrait.src = urlImage;

    // Afficher l'image et masquer l'indication
    imagePortrait.style.display = "block";
    indicationPortrait.style.display = "none";

});









/* =======  Sous-zone 3 :  Caractéristiques, Sauvegarde et Compétences ======= */
/* =======  Sous-zone 3 :  Caractéristiques, Sauvegarde et Compétences ======= */
/* =======  Sous-zone 3 :  Caractéristiques, Sauvegarde et Compétences ======= */


/* =====================================================
   CALCUL DU MODIFICATEUR DE CARACTERISTIQUE
===================================================== */

function calculerModificateurCaracteristique(valeur) {
    const score = Number(valeur);

    if (!Number.isFinite(score)) return 0;

    return Math.floor((score - 10) / 2);
}

/* =====================================================
   ACTUALISATION DU MODIFICATEUR DE CARACTERISTIQUE
===================================================== */

function actualiserModificateurCaracteristique(caracteristique) {

    const noms = {
        FOR: "force",
        DEX: "dexterite",
        CON: "constitution",
        INT: "intelligence",
        SAG: "sagesse",
        CHA: "charisme"
    };

    const nom = noms[caracteristique];

    if (!nom) return;

    const champValeur = document.querySelector(`.champ-valeur-${nom}`);
    const champModificateur = document.querySelector(`.champ-modificateur-${nom}`);

    if (!champValeur || !champModificateur) return;

    const modificateur = calculerModificateurCaracteristique(champValeur.value);

    champModificateur.value = modificateur > 0 ? `+${modificateur}` : modificateur;

}

// Mise à jour automatique des modificateurs
["FOR", "DEX", "CON", "INT", "SAG", "CHA"].forEach(caracteristique => {
    actualiserModificateurCaracteristique(caracteristique);
});

// Mise à jour automatique des modificateurs
const nomsCaracteristiques = {
    FOR: "force",
    DEX: "dexterite",
    CON: "constitution",
    INT: "intelligence",
    SAG: "sagesse",
    CHA: "charisme"
};

Object.entries(nomsCaracteristiques).forEach(([caracteristique, nom]) => {

    const champValeur = document.querySelector(
        `.champ-valeur-${nom}`
    );

    if (!champValeur) return;

    champValeur.addEventListener("input", () => {
        actualiserModificateurCaracteristique(caracteristique);
    });

});

/* =====================================================
   RECUPERATION DU MODIFICATEUR DE CARACTERISTIQUE
===================================================== */

function recupererModificateurCaracteristique(caracteristique) {

    const classes = {
        FOR: ".champ-modificateur-force",
        DEX: ".champ-modificateur-dexterite",
        CON: ".champ-modificateur-constitution",
        INT: ".champ-modificateur-intelligence",
        SAG: ".champ-modificateur-sagesse",
        CHA: ".champ-modificateur-charisme"
    };

    const champ = document.querySelector(classes[caracteristique]);

    if (!champ) return 0;

    return Number(champ.value) || 0;
}


/* =====================================================
   GESTION DE LA MAITRISE DES SAUVEGARDES
===================================================== */
document.querySelectorAll('[class*="cercle-sauvegarde-"]').forEach(cercle => {

    cercle.addEventListener("click", () => {
        cercle.classList.toggle("maitrise");
    });

});

/* =====================================================
   GESTION DE LA MAITRISE ET DE L'EXPERTISE DES COMPÉTENCES
===================================================== */

document.querySelectorAll('[class*="cercle-competence-"]').forEach(cercle => {

    cercle.addEventListener("click", () => {

        // État normal → Maîtrise
        if (!cercle.classList.contains("maitrise") &&
            !cercle.classList.contains("expertise")) {

            cercle.classList.add("maitrise");

        }

        // Maîtrise → Expertise
        else if (cercle.classList.contains("maitrise")) {

            cercle.classList.remove("maitrise");
            cercle.classList.add("expertise");

        }

        // Expertise → État normal
        else if (cercle.classList.contains("expertise")) {

            cercle.classList.remove("expertise");

        }

    });

});




/* =======  Sous-zone 4 :  Bonus Combat & Incantation, Points de Mana, Dés de mana, Jets de sauv. des sorts, Initiative, Vitesse, Percpetion Passive, Repos ======= */
/* =======  Sous-zone 4 :  Bonus Combat & Incantation, Points de Mana, Dés de mana, Jets de sauv. des sorts, Initiative, Vitesse, Percpetion Passive, Repos ======= */
/* =======  Sous-zone 4 :  Bonus Combat & Incantation, Points de Mana, Dés de mana, Jets de sauv. des sorts, Initiative, Vitesse, Percpetion Passive, Repos ======= */

/* =====================================================
   GESTION DES BONUS DE COMBAT ET D'INCANTATION
===================================================== */

// Valeurs des caractéristiques
const valeurForce = document.querySelector(".champ-valeur-force");
const valeurDexterite = document.querySelector(".champ-valeur-dexterite");

const valeurIntelligence = document.querySelector(".champ-valeur-intelligence");

const valeurSagesse = document.querySelector(".champ-valeur-sagesse");
const valeurCharisme = document.querySelector(".champ-valeur-charisme");

// Boutons du bonus de combat
const boutonForceCombat = document.querySelector(".bouton-force-combat");
const boutonDexteriteCombat = document.querySelector(".bouton-dexterite-combat");

// Boutons du bonus d'incantation
const boutonIntelligenceIncantation = document.querySelector(".bouton-intelligence-incantation");
const boutonSagesseIncantation = document.querySelector(".bouton-sagesse-incantation");
const boutonCharismeIncantation = document.querySelector(".bouton-charisme-incantation");

// Champs des bonus
const champBonusCombat = document.querySelector(".champ-bonus-combat");
const champBonusIncantation = document.querySelector(".champ-bonus-incantation");

/* =====================================================
   CALCUL DU MODIFICATEUR DE CARACTÉRISTIQUE
===================================================== */

function calculerBonusCaracteristique(valeur) {

    const caracteristique = Number(valeur);

    // Vérification de la valeur
    if (
        valeur.trim() === "" ||
        !Number.isFinite(caracteristique)
    ) {
        return null;
    }

    // Calcul du bonus
    return Math.floor((caracteristique - 10) / 3);
}

/* =====================================================
   SÉLECTION DU BONUS DE COMBAT
===================================================== */

function selectionnerBonusCombat(bouton, valeurCaracteristique) {

    // Désactivation de tous les boutons
    boutonForceCombat.classList.remove("actif");
    boutonDexteriteCombat.classList.remove("actif");

    // Activation du bouton sélectionné
    bouton.classList.add("actif");

    // Calcul du bonus
    const bonus = calculerBonusCaracteristique(valeurCaracteristique.value);

    // Actualisation du champ
    champBonusCombat.value = bonus !== null ? bonus : "XX";

    if (typeof calculerPerceptionPassive === "function") {
        calculerPerceptionPassive();
    }

    if (typeof calculerInitiative === "function") {
        calculerInitiative();
    }

    if (typeof calculerSauvegardeSorts === "function") {
        calculerSauvegardeSorts();
    }

    if (typeof afficherTechniques === "function") {
        afficherTechniques();
    }

    if (typeof afficherSorts === "function") {
        afficherSorts();
    }

    if (typeof actualiserTousLesBlocsHitDC === "function") {
        actualiserTousLesBlocsHitDC();
    }

    if (typeof actualiserTousLesSeuilsDegats === "function") {
        actualiserTousLesSeuilsDegats();
    }
}

/* =====================================================
   ÉCOUTEURS DES BOUTONS DE COMBAT
===================================================== */

// Bouton FOR
boutonForceCombat.addEventListener("click", () => {

    selectionnerBonusCombat(boutonForceCombat, valeurForce);

});

// Bouton DEX
boutonDexteriteCombat.addEventListener("click", () => {

    selectionnerBonusCombat(boutonDexteriteCombat, valeurDexterite);

});


/* =====================================================
   SÉLECTION DU BONUS D'INCANTATION
===================================================== */

function selectionnerBonusIncantation(bouton, valeurCaracteristique) {

    // Désactivation de tous les boutons
    boutonIntelligenceIncantation.classList.remove("actif");
    boutonSagesseIncantation.classList.remove("actif");
    boutonCharismeIncantation.classList.remove("actif");

    // Activation du bouton sélectionné
    bouton.classList.add("actif");

    // Calcul du bonus d'incantation
    const bonus = calculerBonusCaracteristique(valeurCaracteristique.value);

    // Actualisation du champ
    champBonusIncantation.value = bonus !== null ? bonus : "XX";

    if (typeof calculerPerceptionPassive === "function") {
        calculerPerceptionPassive();
    }

    if (typeof calculerInitiative === "function") {
        calculerInitiative();
    }

    if (typeof calculerSauvegardeSorts === "function") {
        calculerSauvegardeSorts();
    }

    if (typeof actualiserTypeDesMana === "function") {
        actualiserTypeDesMana();
    }

    if (typeof afficherTechniques === "function") {
        afficherTechniques();
    }

    if (typeof afficherSorts === "function") {
    afficherSorts();
    }

    if (typeof actualiserTousLesBlocsHitDC === "function") {
        actualiserTousLesBlocsHitDC();
    }

    if (typeof actualiserTousLesSeuilsDegats === "function") {
        actualiserTousLesSeuilsDegats();
    }

    // Actualisation de la mana
    calculerManaMaximum();
    actualiserBarreMana();
}

/* =====================================================
   ÉCOUTEURS DES BOUTONS D'INCANTATION
===================================================== */

// Bouton INT
boutonIntelligenceIncantation.addEventListener("click", () => {

    selectionnerBonusIncantation(boutonIntelligenceIncantation, valeurIntelligence);

});

// Bouton SAG
boutonSagesseIncantation.addEventListener("click", () => {

    selectionnerBonusIncantation(boutonSagesseIncantation, valeurSagesse);

});

// Bouton CHA
boutonCharismeIncantation.addEventListener("click", () => {

    selectionnerBonusIncantation(boutonCharismeIncantation, valeurCharisme);

});

/* =====================================================
   ACTUALISATION AUTOMATIQUE DU BONUS DE COMBAT
===================================================== */

// Modification de la Force
valeurForce.addEventListener("input", () => {

    if (boutonForceCombat.classList.contains("actif")) {
        selectionnerBonusCombat(boutonForceCombat, valeurForce);
    }

    if (typeof afficherTechniques === "function") {
        afficherTechniques();
    }

    if (typeof afficherSorts === "function") {
        afficherSorts();
    }

    if (typeof calculerSauvegardeSorts === "function") {
        calculerSauvegardeSorts();
    }

});

// Modification de la Dextérité
valeurDexterite.addEventListener("input", () => {

    if (boutonDexteriteCombat.classList.contains("actif")) {
        selectionnerBonusCombat(boutonDexteriteCombat, valeurDexterite);
    }

    if (typeof afficherTechniques === "function") {
        afficherTechniques();
    }

    if (typeof afficherSorts === "function") {
        afficherSorts();
    }

    if (typeof calculerSauvegardeSorts === "function") {
        calculerSauvegardeSorts();
    }
});

/* =====================================================
   ACTUALISATION AUTOMATIQUE DU BONUS D'INCANTATION
===================================================== */

// Modification de l'Intelligence
valeurIntelligence.addEventListener("input", () => {

    if (boutonIntelligenceIncantation.classList.contains("actif")) {
        selectionnerBonusIncantation(boutonIntelligenceIncantation, valeurIntelligence);
    }

    if (typeof afficherTechniques === "function") {
        afficherTechniques();
    }

    if (typeof afficherSorts === "function") {
        afficherSorts();
    }

    if (typeof calculerSauvegardeSorts === "function") {
        calculerSauvegardeSorts();
    }
});

// Modification de la Sagesse
valeurSagesse.addEventListener("input", () => {

    if (boutonSagesseIncantation.classList.contains("actif")) {
        selectionnerBonusIncantation(boutonSagesseIncantation, valeurSagesse);
    }

    if (typeof calculerSauvegardeSorts === "function") {
        calculerSauvegardeSorts();
    }

    if (typeof afficherTechniques === "function") {
        afficherTechniques();
    }

    if (typeof afficherSorts === "function") {
        afficherSorts();
    }

    if (typeof calculerSauvegardeSorts === "function") {
        calculerSauvegardeSorts();
    }

    if (typeof calculerPerceptionPassive === "function") {
        calculerPerceptionPassive();
    }

});

// Modification du Charisme
valeurCharisme.addEventListener("input", () => {

    if (boutonCharismeIncantation.classList.contains("actif")) {
        selectionnerBonusIncantation(boutonCharismeIncantation, valeurCharisme);
    }

    if (typeof afficherTechniques === "function") {
        afficherTechniques();
    }
    
    if (typeof afficherSorts === "function") {
        afficherSorts();
    }

    if (typeof calculerSauvegardeSorts === "function") {
        calculerSauvegardeSorts();
    }
});




/* =====================================================
   JET DE SAUVEGARDE DES SORTS
===================================================== */

const champSauvegardeSorts = document.querySelector(".valeur-sauvegarde-sorts");


function calculerSauvegardeSorts() {

    const bonusCombat = Number(champBonusCombat.value);
    const bonusIncantation = Number(champBonusIncantation.value);
    const meilleurBonus = Math.max(bonusCombat, bonusIncantation);

    let caracteristiqueIncantation;

    if (boutonIntelligenceIncantation.classList.contains("actif")) {
        caracteristiqueIncantation = valeurIntelligence;
    }
    else if (boutonSagesseIncantation.classList.contains("actif")) {
        caracteristiqueIncantation = valeurSagesse;
    }
    else if (boutonCharismeIncantation.classList.contains("actif")) {
        caracteristiqueIncantation = valeurCharisme;
    }

    if (
        champBonusCombat.value.trim() === "" ||
        champBonusIncantation.value.trim() === "" ||
        !Number.isFinite(bonusCombat) ||
        !Number.isFinite(bonusIncantation) ||
        !caracteristiqueIncantation
    ) {
        champSauvegardeSorts.value = "XX";
        return;
    }

    const modificateur = calculerModificateurCaracteristique(
        caracteristiqueIncantation.value
    );

    if (modificateur === null) {
        champSauvegardeSorts.value = "XX";
        return;
    }

    champSauvegardeSorts.value = 8 + meilleurBonus + modificateur;
}






/* =====================================================
   INITIATIVE
===================================================== */

const champInitiative = document.querySelector(".valeur-initiative");


function calculerInitiative() {

    const bonusCombat = Number(champBonusCombat.value);
    const bonusIncantation = Number(champBonusIncantation.value);

    // Vérifier que les deux bonus sont valides
    if (
        champBonusCombat.value.trim() === "" ||
        champBonusIncantation.value.trim() === "" ||
        !Number.isFinite(bonusCombat) ||
        !Number.isFinite(bonusIncantation)
    ) {
        champInitiative.value = "XX";
        return;
    }

    // Récupérer le meilleur bonus entre BC et BI
    const meilleurBonus = Math.max(bonusCombat, bonusIncantation);

    // Récupérer le multiplicateur de la sous-race
    const multiplicateur = window.obtenirMultiplicateurInitiative
        ? window.obtenirMultiplicateurInitiative()
        : 1;

    // Calculer l'initiative
    const bonusInitiative = meilleurBonus * multiplicateur;

    champInitiative.value = bonusInitiative > 0
        ? `+${bonusInitiative}`
        : bonusInitiative;
}


window.actualiserInitiative = calculerInitiative;

calculerInitiative();



/* =====================================================
   PERCPETION PASSIVE
===================================================== */
const champPerceptionPassive = document.querySelector(".valeur-perception-passive");

function calculerPerceptionPassive() {

    const bonusCombat = Number(champBonusCombat.value);
    const bonusIncantation = Number(champBonusIncantation.value);

    // Vérifier que les deux bonus sont valides
    if (
        champBonusCombat.value.trim() === "" ||
        champBonusIncantation.value.trim() === "" ||
        !Number.isFinite(bonusCombat) ||
        !Number.isFinite(bonusIncantation)
    ) {
        champPerceptionPassive.value = "XX";
        return;
    }

    // Récupérer le meilleur bonus entre BC et BI
    const meilleurBonus = Math.max(bonusCombat, bonusIncantation);

    // Calculer le modificateur de Sagesse
    const modificateurSagesse = calculerModificateurCaracteristique(
        valeurSagesse.value
    );

    if (modificateurSagesse === null) {
        champPerceptionPassive.value = "XX";
        return;
    }

    // Calculer la perception passive
    champPerceptionPassive.value = 10 + meilleurBonus + modificateurSagesse;
}

calculerPerceptionPassive();

















/* =====================================================
   VARIABLES DU SYSTÈME DU SCRIPT
===================================================== */

let modeReorganisationActif = null;

let fonctionDesactivationModeReorganisation = null;


/* =====================================================
   FONCTION POUR EMPECHER PLUSIEURS REARRANGEMENT EN MEME TEMPS
===================================================== */


function changerModeReorganisation(nomMode, fonctionDesactivation) {

    // Si le mode demandé est déjà actif : le désactiver
    if (modeReorganisationActif === nomMode) {

        fonctionDesactivation();

        modeReorganisationActif = null;
        fonctionDesactivationModeReorganisation = null;

        return false;
    }

    // Désactiver le mode précédent
    if (fonctionDesactivationModeReorganisation) {
        fonctionDesactivationModeReorganisation();
    }

    // Activer le nouveau mode
    modeReorganisationActif = nomMode;
    fonctionDesactivationModeReorganisation = fonctionDesactivation;

    return true;
}




/* =====================================================
   DÉFILEMENT LIGNE PAR LIGNE
===================================================== */

function initialiserDefilementLigneParLigne() {

    const conteneurs = [
        document.querySelector(".conteneur-lignes-techniques"),
        document.querySelector(".conteneur-lignes-sorts"),
        document.querySelector(".conteneur-lignes-equipement"),
        document.querySelector(".conteneur-lignes-inventaire"),
        document.querySelector(".conteneur-lignes-traits"),
        document.querySelector(".conteneur-lignes-essences")
    ];

    conteneurs.forEach(conteneur => {

        if (!conteneur) return;

        conteneur.addEventListener("wheel", event => {

            if (event.deltaY === 0) return;

            event.preventDefault();

            const ligne = conteneur.querySelector("tbody tr");

            if (!ligne) return;

            const hauteurLigne = ligne.getBoundingClientRect().height;

            conteneur.scrollTop += Math.sign(event.deltaY) * hauteurLigne;

        }, { passive: false });

    });

}

initialiserDefilementLigneParLigne();













/* =====================================================
   ICÔNE FLOTTANTE DU CHAT
===================================================== */

let chatOuvert = false;

const boutonChat = document.getElementById("bouton-chat");
const iconePorteChat = document.getElementById("icone-porte-chat");

boutonChat.addEventListener("mouseenter", () => {

    if (!chatOuvert) {
    iconePorteChat.src = "image_porte/porte_etat2.svg";
    }

});

boutonChat.addEventListener("mouseleave", () => {

    if (!chatOuvert) {
    iconePorteChat.src = "image_porte/porte_etat1.svg";
    }

});

boutonChat.addEventListener("click", () => {

    chatOuvert = !chatOuvert;

    iconePorteChat.src = chatOuvert
        ? "image_porte/porte_etat3.svg"
        : "image_porte/porte_etat1.svg";

    document.getElementById("fenetre-chat").style.display =
        chatOuvert ? "flex" : "none";


    // Placer le curseur directement après le /roll
    if (chatOuvert) {

        saisieChat.focus();

    }

});


/* Fermeture du chat avec la croix */

document.getElementById("fermer-chat").addEventListener("click", () => {

    chatOuvert = false;

    document.getElementById("fenetre-chat").style.display = "none";

    iconePorteChat.src = "image_porte/porte_etat1.svg";

});


/* =====================================================
   ENVOI DES MESSAGES DU CHAT
===================================================== */

const historiqueChat = document.getElementById("historique-chat");
const saisieChat = document.getElementById("saisie-chat");
const envoyerChat = document.getElementById("envoyer-chat");
const nomPersonnageChat = document.getElementById("nom-personnage");



// Créer l'identité temporelle d'un message
function creerEnteteMessageChat() {

    const entete = document.createElement("div");
    entete.classList.add("entete-message-chat");

    const maintenant = new Date();

    const nom = nomPersonnageChat.value.trim() || "Personnage";

    const heure = maintenant.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const date = maintenant.toLocaleDateString("fr-FR");

    entete.textContent = `${nom} (${heure} - ${date})`;

    return entete;
}



function envoyerMessageChat() {

    const jet = saisieChat.value.trim();

    if (jet === "") return;

    const message = `/roll ${jet}`;


    if (message === "") return;

    // Afficher le message du joueur
    const nouveauMessage = document.createElement("div");
    nouveauMessage.classList.add("message-chat", "message-commande");

    // Ajouter l'identité temporelle
    nouveauMessage.appendChild(creerEnteteMessageChat());

    // Ajouter le contenu du message
    const contenuMessage = document.createElement("div");
    contenuMessage.textContent = message;

    nouveauMessage.appendChild(contenuMessage);

    historiqueChat.appendChild(nouveauMessage);

    // Vérifier s'il s'agit d'une commande de dés
    if (message.toLowerCase().startsWith("/roll")) {

        const correspondance = message.match(
            /^\/roll\s+(\d*)d(\d+)\s*([+-]\s*\d+)?$/i
        );

        if (!correspondance) {

            afficherResultatChat("Commande invalide. Exemple : /roll 2d6+3");

        } else {

            const nombreDes = correspondance[1] === ""
                ? 1
                : parseInt(correspondance[1]);

            const facesDe = parseInt(correspondance[2]);

            const modificateur = correspondance[3]
                ? parseInt(correspondance[3].replace(/\s/g, ""))
                : 0;

            if (
                nombreDes < 1 ||
                nombreDes > 100 ||
                facesDe < 2 ||
                facesDe > 1000
            ) {

                afficherResultatChat("Nombre de dés ou de faces invalide.");

            } else {

                let resultats = [];

                for (let i = 0; i < nombreDes; i++) {

                    resultats.push(
                        Math.floor(Math.random() * facesDe) + 1
                    );

                }

                const totalDes = resultats.reduce(
                    (total, valeur) => total + valeur,
                    0
                );

                const totalFinal = totalDes + modificateur;

                afficherResultatChat(resultats, modificateur, totalFinal);

            }

        }

    }

    historiqueChat.scrollTop = historiqueChat.scrollHeight;


    // Réinitialisation du champ après l'envoi
    saisieChat.value = "";

    saisieChat.focus();

}


// Afficher un résultat dans le chat
function afficherResultatChat(resultats, modificateur, totalFinal) {

    const resultat = document.createElement("div");
    resultat.classList.add("message-chat", "message-resultat");

    const contenu = document.createElement("div");
    contenu.classList.add("contenu-resultat-des");

    // Gérer les messages d'erreur
    if (typeof resultats === "string") {

        contenu.textContent = resultats;

    } else {

        // Créer un hexagone pour chaque dé
        resultats.forEach(valeur => {

            const hexagone = document.createElement("div");
            hexagone.classList.add("hexagone-resultat");
            hexagone.textContent = valeur;

            contenu.appendChild(hexagone);

        });

        // Ajouter le modificateur si nécessaire
        if (modificateur !== 0) {

            const modificateurElement = document.createElement("span");
            modificateurElement.classList.add("modificateur-resultat");

            modificateurElement.textContent =
                `${modificateur > 0 ? "+" : "−"} ${Math.abs(modificateur)}`;

            contenu.appendChild(modificateurElement);

        }

        // Signe égal
        const egal = document.createElement("span");
        egal.classList.add("egal-resultat");
        egal.textContent = "=";

        contenu.appendChild(egal);

        // Total final
        const total = document.createElement("span");
        total.classList.add("total-final-resultat");
        total.textContent = totalFinal;

        contenu.appendChild(total);

    }

    // Ajouter l'identité temporelle
    resultat.appendChild(creerEnteteMessageChat());

    // Ajouter le contenu du résultat
    resultat.appendChild(contenu);

    historiqueChat.appendChild(resultat);

    // Descendre automatiquement en bas de l'historique
    historiqueChat.scrollTop = historiqueChat.scrollHeight;

}


// Afficher le type de jet dans le chat
function afficherMessageTypeJet(nomJet) {

    const message = document.createElement("div");
    message.classList.add("message-chat", "message-commande");

    // Ajouter l'identité temporelle
    message.appendChild(creerEnteteMessageChat());

    // Ajouter le nom du jet
    const contenu = document.createElement("div");
    contenu.textContent = nomJet;

    message.appendChild(contenu);

    // Ajouter au chat
    historiqueChat.appendChild(message);

    // Descendre automatiquement en bas de l'historique
    historiqueChat.scrollTop = historiqueChat.scrollHeight;

}


// Envoi du message dans le chat
envoyerChat.addEventListener("click", envoyerMessageChat);

saisieChat.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        envoyerMessageChat();
    }

});







































