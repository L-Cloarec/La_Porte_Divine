/* ========================================= */
/* SYSTÈME DE SAUVEGARDE DE LA FICHE        */
/* ========================================= */


/* ========================================= */
/* RÉCUPÉRATION DES ÉLÉMENTS HTML           */
/* ========================================= */

const boutonSauvegarder = document.getElementById("bouton-sauvegarder");
const boutonCharger = document.getElementById("bouton-charger");
const fichierSauvegarde = document.getElementById("fichier-sauvegarde");


/* ========================================= */
/* VARIABLES DU SYSTÈME                     */
/* ========================================= */

let chargementSauvegardeEnCours = false;

/* ========================================= */
/* RÉCUPÉRATION DES INFORMATIONS GÉNÉRALES  */
/* ========================================= */

function recupererInformationsPersonnage() {

    return {

        nom: document.getElementById("nom-personnage").value,
        archetype: document.getElementById("archetype-personnage").value,
        niveau: document.getElementById("valeur-niveau-personnage").value,

        espece: document.getElementById("espece").value,
        sousRace: document.getElementById("sous-race").value,

        classeArmure: document.getElementById("classe-armure").value,

        inspiration: inspirationActive

    };

}

/* ========================================= */
/* RÉCUPÉRATION DES CARACTÉRISTIQUES        */
/* ========================================= */

function recupererCaracteristiques() {

    return {

        force: document.querySelector(".champ-valeur-force").value,
        dexterite: document.querySelector(".champ-valeur-dexterite").value,
        constitution: document.querySelector(".champ-valeur-constitution").value,
        intelligence: document.querySelector(".champ-valeur-intelligence").value,
        sagesse: document.querySelector(".champ-valeur-sagesse").value,
        charisme: document.querySelector(".champ-valeur-charisme").value

    };

}

/* ========================================= */
/* RÉCUPÉRATION DES MAÎTRISES               */
/* ========================================= */

function recupererMaitrises() {

    return {

        sauvegardes: Array.from(
            document.querySelectorAll('[class*="cercle-sauvegarde-"]')
        ).map(cercle => ({
            identifiant: cercle.getAttribute("aria-label"),
            maitrise: cercle.classList.contains("maitrise")
        })),

        competences: Array.from(
            document.querySelectorAll('[class*="cercle-competence-"]')
        ).map(cercle => ({
            identifiant: cercle.getAttribute("aria-label"),
            maitrise: cercle.classList.contains("maitrise"),
            expertise: cercle.classList.contains("expertise")
        }))

    };

}


/* ========================================= */
/* RÉCUPÉRATION DES BONUS                   */
/* ========================================= */

function recupererSelectionsBonus() {

    return {

        combat: document.querySelector(
            ".bouton-force-combat.actif, .bouton-dexterite-combat.actif"
        )?.classList[0] ?? null,

        incantation: document.querySelector(
            ".bouton-intelligence-incantation.actif, .bouton-sagesse-incantation.actif, .bouton-charisme-incantation.actif"
        )?.classList[0] ?? null

    };

}

/* ========================================= */
/* RÉCUPÉRATION DE LA MONNAIE               */
/* ========================================= */

function recupererMonnaie() {

    return {

        cobalt: document.querySelector(".piece-cobalt .contenu-piece input").value,
        platine: document.querySelector(".piece-platine .contenu-piece input").value,
        or: document.querySelector(".piece-or .contenu-piece input").value,
        argent: document.querySelector(".piece-argent .contenu-piece input").value,
        cuivre: document.querySelector(".piece-cuivre .contenu-piece input").value

    };

}

/* ========================================= */
/* RÉCUPÉRATION DES PV ET DU MANA           */
/* ========================================= */

function recupererPointsVieEtMana() {

    return {

        pointsDeVie: {
            actuels: document.querySelector(".valeur-pv-actuelle").value,
            temporaires: document.querySelector(".valeur-pv-temp").value,
            desDeVieActuels: document.querySelector(".valeur-de-vie-actuelle").value
        },

        mana: {
            actuel: document.querySelector(".valeur-mana-actuelle").value,
            gestion: document.querySelector(".valeur-mana-gestion").value,
            desDeManaActuels: document.querySelector(".valeur-des-mana-actuelle").value
        }

    };

}

/* ========================================= */
/* RÉCUPÉRATION DE L'ÉQUIPEMENT ET INVENTAIRE */
/* ========================================= */

function recupererEquipementInventaire() {

    return {

        objets: objetsEquipementInventaire,
        prochainId: prochainIdObjet

    };

}

/* ========================================= */
/* RÉCUPÉRATION DES TECHNIQUES              */
/* ========================================= */

function recupererTechniques() {

    return techniques;

}

/* ========================================= */
/* RÉCUPÉRATION DES SORTS                   */
/* ========================================= */

function recupererSorts() {

    return sorts;

}

/* ========================================= */
/* RÉCUPÉRATION DES TRAITS                  */
/* ========================================= */

function recupererTraits() {

    return {

        personnalises: traitsPersonnalises,
        ordre: ordreTraits,
        supprimes: traitsSupprimes,
        prochainId: prochainIdTrait

    };

}

/* ========================================= */
/* RÉCUPÉRATION DES ESSENCES                */
/* ========================================= */

function recupererEssences() {

    return {

        personnalisees: essencesPersonnalises,
        ordre: ordreEssences,
        supprimees: essencesSupprimes,
        prochainId: prochainIdEssence

    };

}

/* ========================================= */
/* RÉCUPÉRATION DU PORTRAIT                 */
/* ========================================= */

function recupererPortrait() {

    return new Promise((resolve, reject) => {

        const fichier = document.getElementById("fichier-portrait").files[0];
        const imagePortrait = document.getElementById("image-portrait");

        // Aucun nouveau fichier sélectionné
        if (!fichier) {

            // Le portrait est déjà enregistré sous forme de Data URL
            if (imagePortrait.src.startsWith("data:")) {
                resolve(imagePortrait.src);
            } else {
                resolve(null);
            }

            return;
        }

        // Conversion du fichier en Data URL
        const lecteur = new FileReader();

        lecteur.onload = () => resolve(lecteur.result);
        lecteur.onerror = () => reject(lecteur.error);

        lecteur.readAsDataURL(fichier);

    });

}

/* ========================================= */
/* CRÉATION DE L'OBJET DE SAUVEGARDE        */
/* ========================================= */

async function creerDonneesSauvegarde() {

    return {

        version: 1,
        dateSauvegarde: new Date().toISOString(),

        personnage: recupererInformationsPersonnage(),

        caracteristiques: recupererCaracteristiques(),

        maitrises: recupererMaitrises(),

        selectionsBonus: recupererSelectionsBonus(),

        monnaie: recupererMonnaie(),

        pvEtMana: recupererPointsVieEtMana(),

        equipementInventaire: recupererEquipementInventaire(),

        techniques: recupererTechniques(),

        sorts: recupererSorts(),

        traits: recupererTraits(),

        essences: recupererEssences(),

        portrait: await recupererPortrait()

    };

}

/* ========================================= */
/* TÉLÉCHARGEMENT DE LA SAUVEGARDE          */
/* ========================================= */

async function sauvegarderFiche() {

    try {

        // Récupération de toutes les données
        const donnees = await creerDonneesSauvegarde();

        // Conversion en JSON
        const contenuJSON = JSON.stringify(donnees, null, 4);

        // Création du fichier
        const fichier = new Blob(
            [contenuJSON],
            { type: "application/json" }
        );

        // Création du lien de téléchargement
        const url = URL.createObjectURL(fichier);

        const lien = document.createElement("a");

        const nomPersonnage = donnees.personnage.nom
            .trim()
            .replace(/[^\w-]/g, "_") || "Personnage";

        lien.href = url;
        lien.download = `Sauvegarde_${nomPersonnage}.json`;

        // Déclenchement du téléchargement
        document.body.appendChild(lien);
        lien.click();

        // Nettoyage
        document.body.removeChild(lien);
        URL.revokeObjectURL(url);

    } catch (erreur) {

        console.error(
            "Erreur lors de la sauvegarde :",
            erreur
        );

        alert("Une erreur est survenue lors de la sauvegarde.");

    }

}

/* ========================================= */
/* ÉVÉNEMENTS DES BOUTONS                   */
/* ========================================= */

boutonSauvegarder.addEventListener("click", () => {

    sauvegarderFiche();

});

boutonCharger.addEventListener("click", () => {

    fichierSauvegarde.click();

});


/* ========================================= */
/* RESTAURATION DES INFORMATIONS GÉNÉRALES  */
/* ========================================= */

function restaurerInformationsPersonnage(donnees) {

    const personnage = donnees.personnage;

    document.getElementById("nom-personnage").value = personnage.nom;
    document.getElementById("archetype-personnage").value = personnage.archetype;
    document.getElementById("valeur-niveau-personnage").value = personnage.niveau;

    document.getElementById("classe-armure").value = personnage.classeArmure;

    // Restauration de l'espèce et de la sous-race
    document.getElementById("espece").value = personnage.espece;
    document.getElementById("sous-race").value = personnage.sousRace;

    // Déclenchement des événements pour actualiser les données dérivées
    document.getElementById("espece").dispatchEvent(
        new Event("change", { bubbles: true })
    );

    document.getElementById("sous-race").dispatchEvent(
        new Event("change", { bubbles: true })
    );

    // Actualisation du texte visible dans le sélecteur
    const texteEspece = document.getElementById("texte-espece");

    const espece = donneesEspeces[personnage.espece];

    if (espece) {

        const sousRace = espece.sousRaces?.[personnage.sousRace];

        texteEspece.textContent = sousRace
            ? `${espece.nom} — ${sousRace.nom}`
            : espece.nom;

    } else {

        texteEspece.textContent = "Choisir une espèce";

    }

    inspirationActive = Boolean(personnage.inspiration);

    actualiserBoutonInspiration();

}

/* ========================================= */
/* RESTAURATION DES CARACTÉRISTIQUES        */
/* ========================================= */

function restaurerCaracteristiques(donnees) {

    const caracteristiques = donnees.caracteristiques;

    document.querySelector(".champ-valeur-force").value = caracteristiques.force;
    document.querySelector(".champ-valeur-dexterite").value = caracteristiques.dexterite;
    document.querySelector(".champ-valeur-constitution").value = caracteristiques.constitution;
    document.querySelector(".champ-valeur-intelligence").value = caracteristiques.intelligence;
    document.querySelector(".champ-valeur-sagesse").value = caracteristiques.sagesse;
    document.querySelector(".champ-valeur-charisme").value = caracteristiques.charisme;

}


/* ========================================= */
/* RESTAURATION DES MAÎTRISES               */
/* ========================================= */

function restaurerMaitrises(donnees) {

    const maitrises = donnees.maitrises;

    // Restauration des maîtrises aux jets de sauvegarde
    maitrises.sauvegardes.forEach(sauvegarde => {

        const cercle = document.querySelector(
            `[aria-label="${sauvegarde.identifiant}"]`
        );

        if (!cercle) return;

        cercle.classList.toggle("maitrise", sauvegarde.maitrise);

    });

    // Restauration des maîtrises et expertises aux compétences
    maitrises.competences.forEach(competence => {

        const cercle = document.querySelector(
            `[aria-label="${competence.identifiant}"]`
        );

        if (!cercle) return;

        cercle.classList.toggle("maitrise", competence.maitrise);
        cercle.classList.toggle("expertise", competence.expertise);

    });

}

/* ========================================= */
/* RESTAURATION DE LA MONNAIE               */
/* ========================================= */

function restaurerMonnaie(donnees) {

    const monnaie = donnees.monnaie;

    document.querySelector(".piece-cobalt .contenu-piece input").value = monnaie.cobalt;
    document.querySelector(".piece-platine .contenu-piece input").value = monnaie.platine;
    document.querySelector(".piece-or .contenu-piece input").value = monnaie.or;
    document.querySelector(".piece-argent .contenu-piece input").value = monnaie.argent;
    document.querySelector(".piece-cuivre .contenu-piece input").value = monnaie.cuivre;

}

/* ========================================= */
/* RESTAURATION DE L'ÉQUIPEMENT ET INVENTAIRE */
/* ========================================= */

function restaurerEquipementInventaire(donnees) {

    const equipement = donnees.equipementInventaire;

    // Remplacement complet des objets existants
    objetsEquipementInventaire.splice(
        0,
        objetsEquipementInventaire.length,
        ...equipement.objets
    );

    // Restauration du prochain identifiant
    prochainIdObjet = equipement.prochainId;

    // Actualisation des tableaux
    afficherObjetsEquipementInventaire();

}

/* ========================================= */
/* RESTAURATION DES TECHNIQUES              */
/* ========================================= */

function restaurerTechniques(donnees) {

    // Remplacement complet des techniques
    techniques.splice(
        0,
        techniques.length,
        ...donnees.techniques
    );

    // Actualisation du tableau
    afficherTechniques();

}


/* ========================================= */
/* RESTAURATION DES SORTS                   */
/* ========================================= */

function restaurerSorts(donnees) {

    // Remplacement complet des sorts
    sorts.splice(
        0,
        sorts.length,
        ...donnees.sorts
    );

    // Actualisation du tableau
    afficherSorts();

}

/* ========================================= */
/* RESTAURATION DES TRAITS                  */
/* ========================================= */

function restaurerTraits(donnees) {

    const traits = donnees.traits;

    traitsPersonnalises = traits.personnalises;
    ordreTraits = traits.ordre;
    traitsSupprimes = traits.supprimes;
    prochainIdTrait = traits.prochainId;

    // Actualisation du tableau
    actualiserTableauTraits();

}

/* ========================================= */
/* RESTAURATION DES ESSENCES                */
/* ========================================= */

function restaurerEssences(donnees) {

    const essences = donnees.essences;

    essencesPersonnalises = essences.personnalisees;
    ordreEssences = essences.ordre;
    essencesSupprimes = essences.supprimees;
    prochainIdEssence = essences.prochainId;

    // Actualisation du tableau
    actualiserTableauEssences();

}

/* ========================================= */
/* RESTAURATION DES BONUS                   */
/* ========================================= */

function restaurerSelectionsBonus(donnees) {

    const selections = donnees.selectionsBonus;

    // Réinitialisation des boutons de combat
    document.querySelectorAll(
        ".bouton-force-combat, .bouton-dexterite-combat"
    ).forEach(bouton => {
        bouton.classList.remove("actif");
    });

    // Réinitialisation des boutons d'incantation
    document.querySelectorAll(
        ".bouton-intelligence-incantation, .bouton-sagesse-incantation, .bouton-charisme-incantation"
    ).forEach(bouton => {
        bouton.classList.remove("actif");
    });

    // Restauration du bonus de combat
    if (selections.combat) {

        document.querySelectorAll(
            ".bouton-force-combat, .bouton-dexterite-combat"
        ).forEach(bouton => {

            if (bouton.classList.contains(selections.combat)) {
                bouton.classList.add("actif");
            }

        });

    }

    // Restauration du bonus d'incantation
    if (selections.incantation) {

        document.querySelectorAll(
            ".bouton-intelligence-incantation, .bouton-sagesse-incantation, .bouton-charisme-incantation"
        ).forEach(bouton => {

            if (bouton.classList.contains(selections.incantation)) {
                bouton.classList.add("actif");
            }

        });

    }

}


/* ========================================= */
/* ACTUALISATION DES BONUS SÉLECTIONNÉS      */
/* ========================================= */

function actualiserBonusSelectionnes() {

    // Bonus de combat
    if (boutonForceCombat.classList.contains("actif")) {

        selectionnerBonusCombat(
            boutonForceCombat,
            valeurForce
        );

    } else if (boutonDexteriteCombat.classList.contains("actif")) {

        selectionnerBonusCombat(
            boutonDexteriteCombat,
            valeurDexterite
        );

    }

    // Bonus d'incantation
    if (boutonIntelligenceIncantation.classList.contains("actif")) {

        selectionnerBonusIncantation(
            boutonIntelligenceIncantation,
            valeurIntelligence
        );

    } else if (boutonSagesseIncantation.classList.contains("actif")) {

        selectionnerBonusIncantation(
            boutonSagesseIncantation,
            valeurSagesse
        );

    } else if (boutonCharismeIncantation.classList.contains("actif")) {

        selectionnerBonusIncantation(
            boutonCharismeIncantation,
            valeurCharisme
        );

    }

}

/* ========================================= */
/* RESTAURATION DU PORTRAIT                 */
/* ========================================= */

function restaurerPortrait(donnees) {

    const imagePortrait = document.getElementById("image-portrait");
    const indicationPortrait = document.getElementById("indication-portrait");

    if (!donnees.portrait) {

        imagePortrait.src = "";
        imagePortrait.style.display = "none";

        if (indicationPortrait) {
            indicationPortrait.style.display = "";
        }

        return;

    }

    // Restauration de l'image
    imagePortrait.src = donnees.portrait;
    imagePortrait.style.display = "block";

    if (indicationPortrait) {
        indicationPortrait.style.display = "none";
    }

}


/* ========================================= */
/* RESTAURATION DES PV ET DU MANA           */
/* ========================================= */

function restaurerPointsVieEtMana(donnees) {

    const pv = donnees.pvEtMana.pointsDeVie;
    const mana = donnees.pvEtMana.mana;

    // Restauration des points de vie
    document.querySelector(".valeur-pv-actuelle").value = pv.actuels;
    document.querySelector(".valeur-pv-temp").value = pv.temporaires;
    document.querySelector(".valeur-de-vie-actuelle").value = pv.desDeVieActuels;

    // Restauration du mana
    document.querySelector(".valeur-mana-actuelle").value = mana.actuel;
    document.querySelector(".valeur-mana-gestion").value = mana.gestion;
    document.querySelector(".valeur-des-mana-actuelle").value = mana.desDeManaActuels;

    actualiserBarrePV();
    actualiserBarreMana();

}


/* ========================================= */
/* LECTURE DU FICHIER DE SAUVEGARDE         */
/* ========================================= */

fichierSauvegarde.addEventListener("change", async () => {

    const fichier = fichierSauvegarde.files[0];

    if (!fichier) return;

    try {

        const contenu = await fichier.text();

        const donnees = JSON.parse(contenu);

        // Vérification de la structure de la sauvegarde
        if (
            donnees.version !== 1 ||
            !donnees.personnage ||
            !donnees.caracteristiques ||
            !donnees.maitrises ||
            !donnees.selectionsBonus ||
            !donnees.monnaie ||
            !donnees.pvEtMana ||
            !donnees.equipementInventaire ||
            !Array.isArray(donnees.techniques) ||
            !Array.isArray(donnees.sorts) ||
            !donnees.traits ||
            !donnees.essences
        ) {

            throw new Error("Structure de sauvegarde invalide.");

        }

        // Application des données à la fiche
        appliquerDonneesSauvegarde(donnees);

        alert("Les données de la sauvegarde ont été chargées.");


    } catch (erreur) {

        console.error("Erreur de lecture de la sauvegarde :", erreur);

        alert("Le fichier sélectionné est invalide ou illisible.");

    }

    // Permet de sélectionner à nouveau le même fichier
    fichierSauvegarde.value = "";

});


/* ========================================= */
/* ACTUALISATION DES CARACTÉRISTIQUES       */
/* ========================================= */

function actualiserToutesLesCaracteristiques() {

    actualiserModificateurCaracteristique("FOR");
    actualiserModificateurCaracteristique("DEX");
    actualiserModificateurCaracteristique("CON");
    actualiserModificateurCaracteristique("INT");
    actualiserModificateurCaracteristique("SAG");
    actualiserModificateurCaracteristique("CHA");

}


/* ========================================= */
/* RESTAURATION COMPLÈTE DE LA FICHE        */
/* ========================================= */

function appliquerDonneesSauvegarde(donnees) {

    chargementSauvegardeEnCours = true;

    try {

        restaurerInformationsPersonnage(donnees);

        restaurerCaracteristiques(donnees);

        restaurerSelectionsBonus(donnees);

        actualiserToutesLesCaracteristiques();

        actualiserBonusSelectionnes();

        actualiserPVNiveau1(false);

        actualiserTotalDeVie(false);

        calculerManaMaximum();

        restaurerMaitrises(donnees);

        restaurerMonnaie(donnees);

        restaurerEquipementInventaire(donnees);

        restaurerTechniques(donnees);

        restaurerSorts(donnees);

        restaurerTraits(donnees);

        restaurerEssences(donnees);

        restaurerPortrait(donnees);

        restaurerPointsVieEtMana(donnees);

    } finally {

        chargementSauvegardeEnCours = false;

    }

}