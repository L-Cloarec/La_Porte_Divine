/* ========================================= */
/* FONCTION D'OUVERTURE DE LA FENÊTRE DE JET */
/* ========================================= */

const fenetreJetDes = document.querySelector("#fenetre-jet-des");

const titreFenetreJet = document.querySelector("#titre-fenetre-jet");

const bonusJet = document.querySelector("#bonus-jet");

const boutonFermerJet = document.querySelector("#fermer-fenetre-jet");

let afficherModeDiscordActuel = true;


function ouvrirFenetreJet(
    nomJet,
    bonus,
    nombreDes = 1,
    facesDes = 20,
    afficherModeDiscord = true
) {

    // Définir le titre
    titreFenetreJet.textContent = `Jet de ${nomJet}`;

    // Mémoriser les paramètres du jet
    nomJetActuel = nomJet;
    bonusJetActuel = bonus;
    nombreDesActuel = nombreDes;
    facesDesActuel = facesDes;

    afficherModeDiscordActuel = afficherModeDiscord;

    // Afficher la formule des dés
    document.querySelector("#des-jet").textContent =
        `${nombreDes}d${facesDes}`;

    // Afficher le bonus
    bonusJet.textContent = bonus >= 0
        ? `+${bonus}`
        : bonus;

    // Effacer le résultat précédent
    resultatJet.textContent = "";

    // Déterminer si le jet utilise avantage et désavantage
    const modesDisponibles = nombreDes === 1 && facesDes === 20;

    boutonsModesJet.forEach(bouton => {

        bouton.hidden =
            !modesDisponibles && bouton.dataset.mode !== "normal";

        bouton.classList.toggle(
            "mode-jet-actif",
            bouton.dataset.mode === "normal"
        );

    });

    // Réinitialiser le mode de jet
    modeJetActuel = "normal";

    // Ouvrir la fenêtre
    fenetreJetDes.showModal();
}

// Fermer la fenêtre avec la croix
boutonFermerJet.addEventListener("click", () => {

    fenetreJetDes.close();

});

/* ========================================= */
/* GESTION DES MODES DE JET                  */
/* ========================================= */

let modeJetActuel = "normal";

const boutonsModesJet = document.querySelectorAll(
    ".modes-jet button"
);


// Sélectionner un mode de jet
boutonsModesJet.forEach(bouton => {

    bouton.addEventListener("click", () => {

        modeJetActuel = bouton.dataset.mode;

        // Actualiser l'apparence des boutons
        boutonsModesJet.forEach(element => {
            element.classList.remove("mode-jet-actif");
        });

        bouton.classList.add("mode-jet-actif");

    });

});


/* ========================================= */
/* GESTION DU LANCER DE DÉ                   */
/* ========================================= */

const boutonLancerJet = document.querySelector("#bouton-lancer-jet");

const resultatJet = document.querySelector("#resultat-jet");

let bonusJetActuel = 0;
let nomJetActuel = "";
let nombreDesActuel = 1;
let facesDesActuel = 20;

// Lancer le jet de dés
// Lancer le jet de dés
boutonLancerJet.addEventListener("click", () => {

    let resultatDes = [];

    // Déterminer le nombre de dés à lancer
    const nombreDes = modeJetActuel === "normal"
        ? nombreDesActuel
        : 2;

    // Déterminer le nombre de faces
    const facesDes = modeJetActuel === "normal"
        ? facesDesActuel
        : 20;

    // Lancer les dés
    for (let i = 0; i < nombreDes; i++) {

        resultatDes.push(
            Math.floor(Math.random() * facesDes) + 1
        );

    }

    // Déterminer le résultat retenu
    let resultatRetenu;

    if (modeJetActuel === "avantage") {
        resultatRetenu = Math.max(...resultatDes);
    }
    else if (modeJetActuel === "desavantage") {
        resultatRetenu = Math.min(...resultatDes);
    }
    else {
        resultatRetenu = resultatDes.reduce(
            (total, resultat) => total + resultat,
            0
        );
    }

    // Identifier le dé retenu pour Discord
    const deRetenuDiscord = modeJetActuel === "normal"
        ? null
        : resultatRetenu;


    // Calculer le total
    const total = resultatRetenu + bonusJetActuel;










    // Déterminer le mode du jet
    const modeJetDiscord = {
        normal: "Normal",
        avantage: "Avantage",
        desavantage: "Désavantage"
    }[modeJetActuel];

    // Préparer le message Discord
    const nomPersonnage = document.getElementById("nom-personnage").value.trim()
        || "Personnage";

    
    // Identifier le dé retenu pour Discord
    const indexDeRetenuDiscord = modeJetActuel === "normal"
        ? -1
        : resultatDes.indexOf(deRetenuDiscord);

    const messageDiscord =
        `**${nomPersonnage}** (${nomJetActuel}${afficherModeDiscordActuel ? ` - ${modeJetDiscord}` : ""}) : ` +
        `[${modeJetActuel === "normal"
            ? resultatDes.join(" / ")
            : resultatDes.map((de, index) =>
                index === indexDeRetenuDiscord
                    ? `**${de}**`
                    : de
            ).join(" / ")}] ` +
        `${bonusJetActuel >= 0 ? "+" : "-"} ${Math.abs(bonusJetActuel)} = **${total}**`;

    // Envoyer le résultat sur Discord si la connexion est active
    envoyerMessageDiscord(messageDiscord);







    // Ouvrir automatiquement le chat s'il est fermé
    if (!chatOuvert) {
        boutonChat.click();
    }

    // Afficher le type de jet
    afficherMessageTypeJet(`Jet de ${nomJetActuel}`);

    // Afficher le résultat dans le chat
    afficherResultatChat(
        resultatDes,
        bonusJetActuel,
        total
    );

    // Fermer automatiquement la fenêtre de jet
    fenetreJetDes.close();

});


/* ========================================= */
/* JETS DES SIX CARACTÉRISTIQUES             */
/* ========================================= */

const caracteristiquesJets = [
    { nom: "Force", code: "FOR", classe: ".titre-force" },
    { nom: "Dextérité", code: "DEX", classe: ".titre-dexterite" },
    { nom: "Constitution", code: "CON", classe: ".titre-constitution" },
    { nom: "Intelligence", code: "INT", classe: ".titre-intelligence" },
    { nom: "Sagesse", code: "SAG", classe: ".titre-sagesse" },
    { nom: "Charisme", code: "CHA", classe: ".titre-charisme" }
];

caracteristiquesJets.forEach(caracteristique => {

    const titre = document.querySelector(caracteristique.classe);

    if (!titre) return;

    titre.addEventListener("click", () => {

        const bonus = recupererModificateurCaracteristique(
            caracteristique.code
        );

        ouvrirFenetreJet(
            caracteristique.nom,
            bonus
        );

    });

});


/* ========================================= */
/* RÉCUPÉRATION DU BONUS DE COMBAT / INCANTATION */
/* ========================================= */

function recupererBonusCombat() {

    const champ = document.querySelector(".champ-bonus-combat");

    if (!champ || champ.value.trim() === "") return 0;

    return Number(champ.value) || 0;

}


function recupererBonusIncantation() {

    const champ = document.querySelector(".champ-bonus-incantation");

    if (!champ || champ.value.trim() === "") return 0;

    return Number(champ.value) || 0;

}


/* ========================================= */
/* CALCUL DU BONUS DES SAUVEGARDES          */
/* ========================================= */

function calculerBonusSauvegarde(caracteristique) {

    // Récupération du modificateur de caractéristique
    const modificateur = recupererModificateurCaracteristique(caracteristique);

    // Récupération du cercle de maîtrise
    const classesCercles = {
        FOR: ".cercle-sauvegarde-force",
        DEX: ".cercle-sauvegarde-dexterite",
        CON: ".cercle-sauvegarde-constitution",
        INT: ".cercle-sauvegarde-intelligence",
        SAG: ".cercle-sauvegarde-sagesse",
        CHA: ".cercle-sauvegarde-charisme"
    };

    const cercle = document.querySelector(classesCercles[caracteristique]);


    // Sans maîtrise : modificateur uniquement
    if (!cercle || !cercle.classList.contains("maitrise")) {
        return modificateur;
    }

    // Cas particulier de la Constitution
    if (caracteristique === "CON") {
        return modificateur * 2;
    }

    // FOR et DEX : Bonus de combat
    if (caracteristique === "FOR" || caracteristique === "DEX") {
        return modificateur + recupererBonusCombat();
    }

    // INT, SAG et CHA : Bonus d'incantation
    const bonusFinal = modificateur + recupererBonusIncantation();

    return bonusFinal;


}

/* ========================================= */
/* CLIC SUR LES CONTENEURS DE SAUVEGARDE    */
/* ========================================= */

const sauvegardesJets = [
    { nom: "Force", code: "FOR", classe: ".conteneur-sauvegarde-force" },
    { nom: "Dextérité", code: "DEX", classe: ".conteneur-sauvegarde-dexterite" },
    { nom: "Constitution", code: "CON", classe: ".conteneur-sauvegarde-constitution" },
    { nom: "Intelligence", code: "INT", classe: ".conteneur-sauvegarde-intelligence" },
    { nom: "Sagesse", code: "SAG", classe: ".conteneur-sauvegarde-sagesse" },
    { nom: "Charisme", code: "CHA", classe: ".conteneur-sauvegarde-charisme" }
];

sauvegardesJets.forEach(sauvegarde => {

    const conteneur = document.querySelector(sauvegarde.classe);

    if (!conteneur) return;

    conteneur.addEventListener("click", (event) => {

        // Ignorer le clic sur le cercle de maîtrise
        if (event.target.closest('[class*="cercle-sauvegarde-"]')) {
            return;
        }

        const bonus = calculerBonusSauvegarde(sauvegarde.code);

        ouvrirFenetreJet(`Sauvegarde en ${sauvegarde.nom}`, bonus);
    });
});


/* ========================================= */
/* CALCUL DU BONUS DES COMPÉTENCES          */
/* ========================================= */

function calculerBonusCompetence(caracteristique, cercle) {

    // Récupération du modificateur de caractéristique
    const modificateur = recupererModificateurCaracteristique(caracteristique);

    // Récupération de l'état de maîtrise
    const maitrise = cercle.classList.contains("maitrise");
    const expertise = cercle.classList.contains("expertise");

    // Sans maîtrise : modificateur uniquement
    if (!maitrise && !expertise) {
        return modificateur;
    }

    // Récupération du bonus associé
    let bonusAssocie;

    if (caracteristique === "FOR" || caracteristique === "DEX") {
        bonusAssocie = recupererBonusCombat();
    } else {
        bonusAssocie = recupererBonusIncantation();
    }

    // Avec maîtrise : modificateur + bonus associé
    if (maitrise) {
        return modificateur + bonusAssocie;
    }

    // Avec expertise : modificateur + bonus associé doublé
    return (modificateur * 2) + bonusAssocie ;
}


/* ========================================= */
/* CLIC SUR LE CONTENEUR D'ATHLÉTISME       */
/* ========================================= */

document.querySelector(".conteneur-competence-force")
    .addEventListener("click", (event) => {

        // Ignorer le clic sur le cercle de maîtrise
        if (event.target.closest(".cercle-competence-force")) {
            return;
        }

        // Récupération du cercle
        const cercle = document.querySelector(".cercle-competence-force");

        // Calcul du bonus
        const bonus = calculerBonusCompetence("FOR", cercle);

        // Ouverture de la fenêtre de dés
        ouvrirFenetreJet("Athlétisme", bonus);
    });

/* ========================================= */
/* CLIC SUR LES COMPÉTENCES DE DEXTÉRITÉ    */
/* ========================================= */

const competencesDexterite = [
    { nom: "Acrobaties", caracteristique: "DEX" },
    { nom: "Discrétion", caracteristique: "DEX" },
    { nom: "Sabotage", caracteristique: "DEX" },
    { nom: "Escamotage", caracteristique: "DEX" }
];

competencesDexterite.forEach(competence => {

    // Récupération de toutes les lignes de compétences DEX
    const lignes = document.querySelectorAll(".ligne-competence-dexterite");

    lignes.forEach(ligne => {

        // Vérification du nom de la compétence
        const nom = ligne.querySelector("span");

        if (!nom || nom.textContent.trim() !== competence.nom) {
            return;
        }

        // Gestion du clic sur la ligne
        ligne.addEventListener("click", (event) => {

            // Ignorer le clic sur le cercle de maîtrise
            if (event.target.closest(".cercle-competence-dexterite")) {
                return;
            }

            // Récupération du cercle associé à cette compétence
            const cercle = ligne.querySelector(".cercle-competence-dexterite");

            // Calcul du bonus
            const bonus = calculerBonusCompetence(
                competence.caracteristique,
                cercle
            );

            // Ouverture de la fenêtre de dés
            ouvrirFenetreJet(competence.nom, bonus);
        });
    });
});

/* ========================================= */
/* COMPÉTENCES D'INTELLIGENCE               */
/* ========================================= */

const competencesIntelligence = [
    { nom: "Arcanes", caracteristique: "INT" },
    { nom: "Histoire", caracteristique: "INT" },
    { nom: "Investigation", caracteristique: "INT" },
    { nom: "Nature", caracteristique: "INT" },
    { nom: "Religion", caracteristique: "INT" }
];

competencesIntelligence.forEach(competence => {

    // Récupération de toutes les lignes de compétences INT
    const lignes = document.querySelectorAll(".ligne-competence-intelligence");

    lignes.forEach(ligne => {

        // Vérification du nom de la compétence
        const nom = ligne.querySelector("span");

        if (!nom || nom.textContent.trim() !== competence.nom) {
            return;
        }

        // Gestion du clic sur la ligne
        ligne.addEventListener("click", (event) => {

            // Ignorer le clic sur le cercle de maîtrise
            if (event.target.closest(".cercle-competence-intelligence")) {
                return;
            }

            // Récupération du cercle associé à cette compétence
            const cercle = ligne.querySelector(".cercle-competence-intelligence");

            // Calcul du bonus
            const bonus = calculerBonusCompetence(
                competence.caracteristique,
                cercle
            );

            // Ouverture de la fenêtre de dés
            ouvrirFenetreJet(competence.nom, bonus);
        });
    });
});

/* ========================================= */
/* COMPÉTENCES DE SAGESSE                   */
/* ========================================= */

const competencesSagesse = [
    { nom: "Dressage", caracteristique: "SAG" },
    { nom: "Intuition", caracteristique: "SAG" },
    { nom: "Médecine", caracteristique: "SAG" },
    { nom: "Perception", caracteristique: "SAG" },
    { nom: "Survie", caracteristique: "SAG" }
];

competencesSagesse.forEach(competence => {

    // Récupération de toutes les lignes de compétences SAG
    const lignes = document.querySelectorAll(".ligne-competence-sagesse");

    lignes.forEach(ligne => {

        // Vérification du nom de la compétence
        const nom = ligne.querySelector("span");

        if (!nom || nom.textContent.trim() !== competence.nom) {
            return;
        }

        // Gestion du clic sur la ligne
        ligne.addEventListener("click", (event) => {

            // Ignorer le clic sur le cercle de maîtrise
            if (event.target.closest(".cercle-competence-sagesse")) {
                return;
            }

            // Récupération du cercle associé à cette compétence
            const cercle = ligne.querySelector(".cercle-competence-sagesse");

            // Calcul du bonus
            const bonus = calculerBonusCompetence(
                competence.caracteristique,
                cercle
            );

            // Ouverture de la fenêtre de dés
            ouvrirFenetreJet(competence.nom, bonus);
        });
    });
});

/* ========================================= */
/* COMPÉTENCES DE CHARISME                  */
/* ========================================= */

const competencesCharisme = [
    { nom: "Intimidation", caracteristique: "CHA" },
    { nom: "Persuasion", caracteristique: "CHA" },
    { nom: "Représentation", caracteristique: "CHA" },
    { nom: "Tromperie", caracteristique: "CHA" }
];

competencesCharisme.forEach(competence => {

    // Récupération de toutes les lignes de compétences CHA
    const lignes = document.querySelectorAll(".ligne-competence-charisme");

    lignes.forEach(ligne => {

        // Vérification du nom de la compétence
        const nom = ligne.querySelector("span");

        if (!nom || nom.textContent.trim() !== competence.nom) {
            return;
        }

        // Gestion du clic sur la ligne
        ligne.addEventListener("click", (event) => {

            // Ignorer le clic sur le cercle de maîtrise
            if (event.target.closest(".cercle-competence-charisme")) {
                return;
            }

            // Récupération du cercle associé à cette compétence
            const cercle = ligne.querySelector(".cercle-competence-charisme");

            // Calcul du bonus
            const bonus = calculerBonusCompetence(
                competence.caracteristique,
                cercle
            );

            // Ouverture de la fenêtre de dés
            ouvrirFenetreJet(competence.nom, bonus);
        });
    });
});

/* ========================================= */
/* JET D'INITIATIVE                         */
/* ========================================= */

const cadreInitiative = document.querySelector(".cadre-initiative");

if (cadreInitiative) {

    cadreInitiative.addEventListener("click", (event) => {

        // Ignorer le clic sur le champ modifiable
        if (event.target.closest(".valeur-initiative")) {
            return;
        }

        // Récupération du bonus d'initiative
        const champInitiative = document.querySelector(".valeur-initiative");

        const bonus = Number(champInitiative.value) || 0;

        // Ouverture de la fenêtre de dés
        ouvrirFenetreJet("Initiative", bonus);
    });
}

/* ========================================= */
/* JETS HIT-DC DES TECHNIQUES ET SORTS      */
/* ========================================= */

document.addEventListener("click", (event) => {

    // Récupération du bouton Hit-DC
    const bouton = event.target.closest(
        ".bouton-hit-dc, .bouton-hit-dc-sorts"
    );

    if (!bouton) return;

    // Récupération de la ligne parente
    const ligne = bouton.closest(".ligne-technique, .ligne-sorts");

    if (!ligne) return;

    // Récupération du type de Hit-DC
    const texte = bouton.textContent.trim();

    // Les jets de sauvegarde ne déclenchent aucun jet
    if (/^(FOR|DEX|CON|INT|SAG|CHA)\s/.test(texte)) {
        return;
    }

    // Récupération du bonus
    const bonus = Number(texte);

    if (!Number.isFinite(bonus)) return;




    // Récupération du nom de la technique ou du sort
    const nomAction = ligne.querySelector(
        ".nom-technique, .nom-sort"
    )?.textContent.trim() || "Attaque";

    // Ouverture de la fenêtre de dés
    ouvrirFenetreJet(nomAction, bonus);

});

/* ========================================= */
/* JETS DE DEGATS ET SOINS DES TECHNIQUES   */
/* ========================================= */

document.addEventListener("click", (event) => {

    const bouton = event.target.closest(
        ".bouton-degats-soins, .bouton-degats-soins-sorts"
    );

    if (!bouton) return;


    // Récupérer la ligne parente
    const ligne = bouton.closest(".ligne-technique, .ligne-sorts");

    if (!ligne) return;

    // Récupérer le nom de la technique ou du sort
    const nomAction = ligne.querySelector(
        ".nom-technique, .nom-sorts"
    )?.textContent.trim() || "Action";






    const nombreDes = Number(bouton.dataset.nombreDes);
    const facesDes = Number(bouton.dataset.facesDes);
    const caracteristique = bouton.dataset.caracteristique;

    const typeDegats = bouton.dataset.typeDegats;

    // Récupérer le modificateur de caractéristique
    const bonus = caracteristique
        ? recupererModificateurCaracteristique(caracteristique)
        : 0;

    // Ouvrir la fenêtre de jet
    ouvrirFenetreJet(
        `${nomAction} - ${typeDegats}`,
        bonus,
        nombreDes,
        facesDes,
        false
    );

});

/* ========================================= */
/* JETS DE STATUT DES TECHNIQUES            */
/* ========================================= */

document.addEventListener("click", (event) => {

    const bouton = event.target.closest(".bouton-statut");

    if (!bouton) return;


    // Récupérer la ligne parente
    const ligne = bouton.closest(".ligne-technique");

    if (!ligne) return;

    // Récupérer le nom de la technique
    const nomAction = ligne.querySelector(
        ".nom-technique"
    )?.textContent.trim() || "Action";

    // Récupérer le type de dégâts
    const typeDegats = bouton.dataset.typeDegats;


    // Ouvrir la fenêtre avec un d100
    ouvrirFenetreJet(
        `${nomAction} - Seuil ${typeDegats}`,
        0,
        1,
        100,
        false
    );

});

/* ========================================= */
/* JETS DE STATUT DES SORTS                 */
/* ========================================= */

document.addEventListener("click", (event) => {

    const bouton = event.target.closest(".bouton-effet-statut-sorts");

    if (!bouton) return;


    // Récupérer la ligne parente
    const ligne = bouton.closest(".ligne-sorts");

    if (!ligne) return;

    // Récupérer le nom du sort
    const nomAction = ligne.querySelector(
        ".nom-sorts"
    )?.textContent.trim() || "Action";

    // Récupérer le type de dégâts
    const typeDegats = bouton.dataset.typeDegats;


    // Ouvrir la fenêtre avec un d100
    ouvrirFenetreJet(
        `${nomAction} - Statut ${typeDegats}`,
        0,
        1,
        100,
        false
    );

});

