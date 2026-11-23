/* ======= Sous-zone 1 : Identité, Espèce, Archétype, Bouton portrait, bouton inspiration, Portrait, Indication du niveau ======= */
/* ======= Sous-zone 1 : Identité, Espèce, Archétype, Bouton portrait, bouton inspiration, Portrait, Indication du niveau ======= */
/* ======= Sous-zone 1 : Identité, Espèce, Archétype, Bouton portrait, bouton inspiration, Portrait, Indication du niveau ======= */

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




/* =======  Sous-zone 2 :  Classe d'armure, Points de vie & Dés de vie ======= */
/* =======  Sous-zone 2 :  Classe d'armure, Points de vie & Dés de vie ======= */
/* =======  Sous-zone 2 :  Classe d'armure, Points de vie & Dés de vie ======= */

/* =====================================================
   GESTION DE LA BARRE DE POINTS DE VIE
===================================================== */

const pvActuels = document.querySelector(".valeur-pv-actuelle");
const pvMaximum = document.querySelector(".valeur-pv-max");
const remplissagePV = document.querySelector(".remplissage-pv");
const pvTemporaires = document.querySelector(".valeur-pv-temp");

// Éléments de gestion des dégâts et des soins
const valeurDegats = document.querySelector(".valeur-nombre-degats");
const boutonDegats = document.querySelector(".bouton-degats");
const boutonSoin = document.querySelector(".bouton-soin");

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

    const noms = {
        FOR: "force",
        DEX: "dexterite",
        CON: "constitution",
        INT: "intelligence",
        SAG: "sagesse",
        CHA: "charisme"
    };

    // Initialisation des modificateurs au chargement
    ["FOR", "DEX", "CON", "INT", "SAG", "CHA"].forEach(caracteristique => {
        actualiserModificateurCaracteristique(caracteristique);
    });

    const champValeur = document.querySelector(
        `.champ-valeur-${noms[caracteristique]}`
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

});

// Modification de la Dextérité
valeurDexterite.addEventListener("input", () => {

    if (boutonDexteriteCombat.classList.contains("actif")) {
        selectionnerBonusCombat(boutonDexteriteCombat, valeurDexterite);
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

});

// Modification de la Sagesse
valeurSagesse.addEventListener("input", () => {

    if (boutonSagesseIncantation.classList.contains("actif")) {
        selectionnerBonusIncantation(boutonSagesseIncantation, valeurSagesse);
    }

});

// Modification du Charisme
valeurCharisme.addEventListener("input", () => {

    if (boutonCharismeIncantation.classList.contains("actif")) {
        selectionnerBonusIncantation(boutonCharismeIncantation, valeurCharisme);
    }

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

// Actualisation lors d'une modification des points de mana
manaActuel.addEventListener("input", actualiserBarreMana);
manaMaximum.addEventListener("input", actualiserBarreMana);

// Initialisation
actualiserBarreMana();



















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

}


// Envoi du message dans le chat
envoyerChat.addEventListener("click", envoyerMessageChat);

saisieChat.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        envoyerMessageChat();
    }

});







































