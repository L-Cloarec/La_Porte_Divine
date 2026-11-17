
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

const especes = {
    humain: { deVie: 8, vitesse: 10.5 },
    elfe:   { deVie: 6, vitesse: 12 },
    nain:   { deVie: 10, vitesse: 7.5 },
    orc:    { deVie: 12, vitesse: 9 }
};

    // Probabilités de base des altérations
    const probabilitesBase = {
        "Tranchant": {
            seuil: 30,
            effet: "Saignement : 1d4 - 1d6 - 1d8 Fin du tour"
        },
        "Contondant": {
            seuil: 20,
            effet: "Contusion : Mise à terre - Etourdi"
        },
        "Perforant": {
            seuil: 25,
            effet: "Réduction d'armure :-2 CA pour 1 Tour"
        },
        "Radiant": {
            seuil: 15,
            effet: "Aveuglement : 1 Tour - Permanent"
        },
        "Nécrotique": {
            seuil: 20,
            effet: "Pas de soins possibles : 1 Tour - Peur"
        },
        "Froid": {
            seuil: 35,
            effet: "Ralentisssement - Immobilisation"
        },
        "Feu": {
            seuil: 20,
            effet: "Brûlure : 1d6 - 1d8 - 1d10 Début du tour"
        },
        "Foudre": {
            seuil: 10,
            effet: "Électrocution : Pas de réaction - Pas d'action"
        },
        "Tonnerre": {
            seuil: 20,
            effet: "Sourd : 1 Tour - Permanent"
        },
        "Poison": {
            seuil: 10,
            effet: "Empoisonnement"
        },
        "Acide": {
            seuil: 10,
            effet: "Réduction d'armure : -1 CA cumulatif"
        },
        "Force": {
            seuil: 15,
            effet: "Déplacement forcé : 3 mètres"
        },
        "Psychique": {
            seuil: 5,
            effet: "Perturbation psychique : Confusion - Incapacité"
        }
    };

/* TECHNIQUE */

document.addEventListener("DOMContentLoaded", function () {

        // Éléments du formulaire de création des techniques
    const boutonAjouter = document.getElementById("ajouter-technique");
    const listeTechniques = document.getElementById("liste-techniques");
    const modeleTechnique = document.getElementById("modele-technique");
    const boutonCreer = document.getElementById("creer-technique");
    const modalTechnique = document.getElementById("modal-creation-technique");
    const boutonFermerModal = document.getElementById("fermer-modal-technique");
    const bonusUtilise = document.getElementById("bonus-utilise");
    const bonusCalcule = document.getElementById("bonus-calcule");
    const boutonValiderTechnique = document.getElementById("valider-technique");
    const boutonAnnulerTechnique = document.getElementById("annuler-technique");
    const nomTechnique = document.getElementById("nom-technique");
    const coutTechnique = document.getElementById("cout-technique");
    const porteeTechnique = document.getElementById("portee-technique");
    const dureeTechnique = document.getElementById("duree-technique");
    const nombreDesEffets = document.getElementById("nombre-des-effets");
    const facesDesEffets = document.getElementById("faces-des-effets");
    const typeTechnique = document.getElementById("type-technique");
    const statutTechnique = document.getElementById("statut-technique");


    // Éléments du formulaire de création des sorts
    const boutonCreerSort = document.getElementById("creer-sort");
    const modalSort = document.getElementById("modal-creation-sort");
    const boutonFermerModalSort = document.getElementById("fermer-modal-sort");
    const boutonValiderSort = document.getElementById("valider-sort");
    const boutonAnnulerSort = document.getElementById("annuler-sort");

    const nomSort = document.getElementById("nom-sort");
    const bonusUtiliseSort = document.getElementById("bonus-utilise-sort");
    const bonusCalculeSort = document.getElementById("bonus-calcule-sort");
    const manaSort = document.getElementById("mana-sort");
    const coutSort = document.getElementById("cout-sort");
    const porteeSort = document.getElementById("portee-sort");
    const dureeSort = document.getElementById("duree-sort");
    const nombreDesEffetsSort = document.getElementById("nombre-des-effets-sort");
    const facesDesEffetsSort = document.getElementById("faces-des-effets-sort");
    const typeSort = document.getElementById("type-sort");
    const statutSort = document.getElementById("statut-sort");


    // Ouvrir le formulaire de création d'un sort
    boutonCreerSort.addEventListener("click", function () {
        modalSort.style.display = "flex";
    });

    // Fermer le formulaire
    boutonFermerModalSort.addEventListener("click", function () {
        modalSort.style.display = "none";
    });

    boutonAnnulerSort.addEventListener("click", function () {
        modalSort.style.display = "none";
    });

    // Fermer en cliquant à l'extérieur du formulaire
    modalSort.addEventListener("click", function (event) {
        if (event.target === modalSort) {
            modalSort.style.display = "none";
        }
    });

    // Correspondance entre les cases BC/BI et les modificateurs
    const associationsBonus = {
        BC: {
            cases: ["combat-for", "combat-dex"],
            caracteristiques: ["force-modificateur", "dexterite-modificateur"],
            bonus: "bonus-combat"
        },
        BI: {
            cases: ["incantation-int", "incantation-sag", "incantation-cha"],
            caracteristiques: [
                "intelligence-modificateur",
                "sagesse-modificateur",
                "charisme-modificateur"
            ],
            bonus: "bonus-incantation"
        }
    };


    // Calculer le bonus du sort
    function calculerBonusSort() {
        const typeBonus = bonusUtiliseSort.value;

        if (!typeBonus) {
            bonusCalculeSort.value = "-";
            return;
        }

        const association = associationsBonus[typeBonus];

        const index = association.cases.findIndex(function (id) {
            return document.getElementById(id).checked;
        });

        if (index === -1) {
            bonusCalculeSort.value = "-";
            return;
        }

        const modificateur = Number(
            document.getElementById(association.caracteristiques[index]).value
        );

        const bonus = Number(
            document.getElementById(association.bonus).value
        );

        bonusCalculeSort.value = modificateur + bonus;
    }

    // Actualiser le bonus lors du choix BC ou BI
    bonusUtiliseSort.addEventListener("change", calculerBonusSort);

    // Actualiser le bonus lorsque les caractéristiques ou les bonus changent
    document.addEventListener("valeurs-caracteristiques-modifiees", calculerBonusSort);

    // Calculer le statut du sort
    function calculerStatutSort() {
        const type = typeSort.value;
        const typeBonus = bonusUtiliseSort.value;

        if (!type || !typeBonus || probabilitesBase[type] === undefined) {
            statutSort.value = "";
            return;
        }

        const bonus = Number(
            document.getElementById(associationsBonus[typeBonus].bonus).value
        );

        const seuil = probabilitesBase[type].seuil + (5 * bonus);

        statutSort.value = `≤ ${seuil}`;
    }

    // Actualiser le statut lors du changement de type ou de bonus
    typeSort.addEventListener("change", calculerStatutSort);
    bonusUtiliseSort.addEventListener("change", calculerStatutSort);

    // Actualiser le statut lorsque les caractéristiques ou bonus changent
    document.addEventListener("valeurs-caracteristiques-modifiees", calculerStatutSort);
    

    // Créer un sort personnalisé
    function creerSortPersonnalise() {
        const nom = nomSort.value.trim();
        const mana = Number(manaSort.value);
        const cout = coutSort.value;
        const portee = porteeSort.value.trim();
        const duree = dureeSort.value.trim();
        const bonus = bonusCalculeSort.value;
        const nombreDes = nombreDesEffetsSort.value;
        const facesDes = facesDesEffetsSort.value;
        const type = typeSort.value;
        const statut = statutSort.value;

        if (!nom) {
            alert("Veuillez renseigner le nom du sort.");
            nomSort.focus();
            return;
        }

        if (manaSort.value === "" || mana < 0) {
            alert("Veuillez renseigner un coût en mana valide.");
            manaSort.focus();
            return;
        }

        // Récupérer une ligne vide ou en créer une
        let ligneVide = Array.from(
            window.listeSorts.querySelectorAll("tr")
        ).find(function (ligne) {
            const nom = ligne.cells[0].querySelector("input");
            return nom && nom.value.trim() === "";
        });

        if (!ligneVide) {
            window.ajouterSort();
            ligneVide = window.listeSorts.lastElementChild;
        }

        // Enregistrer les données nécessaires aux futurs jets
        ligneVide.dataset.bonusUtilise = bonusUtiliseSort.value;
        ligneVide.dataset.mana = mana;
        ligneVide.dataset.nombreDes = nombreDes;
        ligneVide.dataset.facesDes = facesDes;

        // Enregistrer la caractéristique associée au bonus
        const typeBonus = bonusUtiliseSort.value;

        if (typeBonus) {
            const association = associationsBonus[typeBonus];
            const index = association.cases.findIndex(function (id) {
                return document.getElementById(id).checked;
            });

            ligneVide.dataset.caracteristique = index !== -1
                ? association.caracteristiques[index]
                : "";
        } else {
            ligneVide.dataset.caracteristique = "";
        }

        // Remplir les cellules du tableau
        const cellules = ligneVide.querySelectorAll("td");

        cellules[0].querySelector("input").value = nom;
        cellules[1].querySelector("select").value = cout;
        cellules[2].querySelector("input").value = mana;
        cellules[3].querySelector("input").value = portee;
        cellules[4].querySelector("input").value = duree;
        cellules[5].querySelector("input").value = bonus;
        cellules[6].querySelector("input").value =
            `${nombreDes}d${facesDes} + ${ligneVide.dataset.caracteristique
                ? Number(document.getElementById(ligneVide.dataset.caracteristique).value)
                : 0}`;
        cellules[7].querySelector("select").value = type;
        cellules[8].querySelector("input").value = statut;

        // Fermer le formulaire
        // Réinitialiser le formulaire
        nomSort.value = "";
        bonusUtiliseSort.value = "";
        bonusCalculeSort.value = "-";
        manaSort.value = "1";
        coutSort.value = "";
        porteeSort.value = "";
        dureeSort.value = "";
        nombreDesEffetsSort.value = "";
        facesDesEffetsSort.value = "";
        typeSort.value = "";
        statutSort.value = "";

        // Fermer le formulaire
        modalSort.style.display = "none";
    }

    // Actualiser les sorts personnalisés
    function actualiserSortsPersonnalises() {

        const lignes = window.listeSorts.querySelectorAll("tr");

        lignes.forEach(function (ligne) {

            if (!ligne.dataset.bonusUtilise) return;

            const cellules = ligne.querySelectorAll("td");

            const typeBonus = ligne.dataset.bonusUtilise;
            const caracteristique = ligne.dataset.caracteristique;

            // Modificateur de caractéristique
            const modificateur = caracteristique
                ? Number(document.getElementById(caracteristique).value)
                : 0;

            // Bonus BC ou BI
            const bonus = typeBonus
                ? Number(document.getElementById(
                    associationsBonus[typeBonus].bonus
                ).value)
                : 0;

            // Actualiser le bonus total
            cellules[5].querySelector("input").value =
                modificateur + bonus;

            // Actualiser les effets
            const nombreDes = ligne.dataset.nombreDes;
            const facesDes = ligne.dataset.facesDes;

            cellules[6].querySelector("input").value =
                `${nombreDes}d${facesDes} + ${modificateur}`;

            // Actualiser le seuil de statut
            const type = cellules[7].querySelector("select").value;

            if (type && probabilitesBase[type] !== undefined) {

                const seuil = probabilitesBase[type].seuil + (5 * bonus);

                cellules[8].querySelector("input").value = `≤ ${seuil}`;

            } else {
                cellules[8].querySelector("input").value = "";
            }
        });
    }

    // Actualiser les sorts lorsque les caractéristiques ou bonus changent
    document.addEventListener(
        "valeurs-caracteristiques-modifiees",
        actualiserSortsPersonnalises
    );

    // Valider la création du sort
    boutonValiderSort.addEventListener("click", creerSortPersonnalise);

    // Calculer automatiquement le bonus de la technique
    function calculerBonusTechnique() {

        const typeBonus = bonusUtilise.value;
        console.log("Bonus sélectionné :", typeBonus);
        console.log("Champ bonus calculé :", bonusCalcule);

        // Aucun bonus sélectionné
        if (!typeBonus) {
            bonusCalcule.value = "-";
            return;
        }

        const association = associationsBonus[typeBonus];

        // Trouver la caractéristique cochée
        const index = association.cases.findIndex(function (id) {
            return document.getElementById(id).checked;
        });

        // Aucune caractéristique associée
        if (index === -1) {
            bonusCalcule.value = "-";
            return;
        }

        // Récupérer le modificateur et le bonus BC/BI
        const modificateur = Number(
            document.getElementById(association.caracteristiques[index]).value
        );

        const bonus = Number(
            document.getElementById(association.bonus).value
        );

        // Calcul final
        bonusCalcule.value = modificateur + bonus;
    }

    // Calculer automatiquement le seuil D100
    function calculerStatutTechnique() {

        const type = typeTechnique.value;

        // Vérifier si le type possède une probabilité de base
        if (!type || probabilitesBase[type].seuil === undefined) {
            statutTechnique.value = "";
            return;
        }

        // Récupérer le bonus BC ou BI
        const typeBonus = bonusUtilise.value;

        if (!typeBonus) {
            statutTechnique.value = "";
            return;
        }

        const association = associationsBonus[typeBonus];

        // Récupérer la valeur du bonus BC ou BI
        const bonus = Number(
            document.getElementById(association.bonus).value
        );

        // Calculer le seuil final
        const seuil = probabilitesBase[type].seuil + (5 * bonus);

        statutTechnique.value = `≤ ${seuil}`;
    }


    // Actualiser les techniques personnalisées lorsque les valeurs changent
    [
        "bonus-combat",
        "bonus-incantation",
        "force-modificateur",
        "dexterite-modificateur",
        "intelligence-modificateur",
        "sagesse-modificateur",
        "charisme-modificateur"
    ].forEach(function (id) {

        document.getElementById(id).addEventListener("input", actualiserTechniquesPersonnalisees);
        document.getElementById(id).addEventListener("change", actualiserTechniquesPersonnalisees);

    });

    // Actualiser lorsque le type de technique change
    typeTechnique.addEventListener("change", calculerStatutTechnique);

    // Actualiser lorsque BC ou BI est sélectionné
    bonusUtilise.addEventListener("change", calculerStatutTechnique);

    // Actualiser lorsque les bonus BC/BI changent
    [
        "bonus-combat",
        "bonus-incantation"
    ].forEach(function (id) {
        document.getElementById(id).addEventListener("input", calculerStatutTechnique);
        document.getElementById(id).addEventListener("change", calculerStatutTechnique);
    });

    // Actualiser lorsque BC ou BI est sélectionné
    bonusUtilise.addEventListener("change", calculerBonusTechnique);

    // Actualiser lorsque les associations BC/BI changent
    [
        "combat-for",
        "combat-dex",
        "incantation-int",
        "incantation-sag",
        "incantation-cha"
    ].forEach(function (id) {
        document.getElementById(id).addEventListener("change", calculerBonusTechnique);
    });

    // Actualiser lorsque les bonus BC/BI ou les modificateurs changent
    [
        "bonus-combat",
        "bonus-incantation",
        "force-modificateur",
        "dexterite-modificateur",
        "intelligence-modificateur",
        "sagesse-modificateur",
        "charisme-modificateur"
    ].forEach(function (id) {

        document.getElementById(id).addEventListener("input", calculerBonusTechnique);

        document.getElementById(id).addEventListener("change", calculerBonusTechnique);

    });


    // Ouvrir la fenêtre
    boutonCreer.addEventListener("click", function () {
        modalTechnique.style.display = "flex";
    });

    // Fermer la fenêtre
    boutonFermerModal.addEventListener("click", function () {
        modalTechnique.style.display = "none";
    });

    // Fermer en cliquant à l'extérieur
    modalTechnique.addEventListener("click", function (event) {
        if (event.target === modalTechnique) {
            modalTechnique.style.display = "none";
        }
    });

    // Ajouter une nouvelle ligne vide
    function ajouterTechnique() {
        const nouvelleLigne = modeleTechnique.content.cloneNode(true);

        // Empêcher la modification des listes déroulantes
        nouvelleLigne.querySelectorAll("select").forEach(function (select) {
            select.addEventListener("mousedown", function (event) {
                event.preventDefault();
            });

            select.addEventListener("keydown", function (event) {
                event.preventDefault();
            });
        });

        listeTechniques.appendChild(nouvelleLigne);
    }

    // Créer une technique personnalisée
    function creerTechniquePersonnalisee() {

        // Récupérer les valeurs du formulaire
        const nom = nomTechnique.value.trim();
        const cout = coutTechnique.value;
        const portee = porteeTechnique.value.trim();
        const duree = dureeTechnique.value.trim();
        const bonus = bonusCalcule.value;
        const typeBonus = bonusUtilise.value;
        let bonusEffets = 0;

        if (typeBonus) {
            const association = associationsBonus[typeBonus];

            const index = association.cases.findIndex(function (id) {
                return document.getElementById(id).checked;
            });

            if (index !== -1) {
                bonusEffets = Number(
                    document.getElementById(association.caracteristiques[index]).value
                );
            }
        }

        const effets = `${nombreDesEffets.value}d${facesDesEffets.value} + ${bonusEffets}`;
        const type = typeTechnique.value;
        const statut = statutTechnique.value;

        // Vérifier que le nom est renseigné
        if (!nom) {
            alert("Veuillez renseigner le nom de la technique.");
            nomTechnique.focus();
            return;
        }

        // Rechercher la première ligne vide
        let ligneVide = Array.from(listeTechniques.querySelectorAll("tr")).find(function (ligne) {
            const nom = ligne.cells[0].querySelector("input");
            return nom && nom.value.trim() === "";
        });

        // Si aucune ligne vide n'existe, en créer une
        if (!ligneVide) {
            ajouterTechnique();
            ligneVide = listeTechniques.lastElementChild;
        }

        // Mémoriser les paramètres utilisés par cette technique
        ligneVide.dataset.bonusUtilise = bonusUtilise.value;
        ligneVide.dataset.nombreDes = nombreDesEffets.value;
        ligneVide.dataset.facesDes = facesDesEffets.value;

        // Mémoriser la caractéristique associée au BC ou BI
        const typeBonusTechnique = bonusUtilise.value;

        if (typeBonusTechnique) {
            const association = associationsBonus[typeBonusTechnique];

            const index = association.cases.findIndex(function (id) {
                return document.getElementById(id).checked;
            });

            ligneVide.dataset.caracteristique = index !== -1
                ? association.caracteristiques[index]
                : "";
        } else {
            ligneVide.dataset.caracteristique = "";
        }

        const cellules = ligneVide.querySelectorAll("td");

        // Remplir les champs de la ligne
        cellules[0].querySelector("input").value = nom;
        cellules[1].querySelector("select").value = cout;
        cellules[2].querySelector("input").value = portee;
        cellules[3].querySelector("input").value = duree;
        cellules[4].querySelector("input").value = bonus;
        cellules[5].querySelector("input").value = effets;
        cellules[6].querySelector("select").value = type;
        cellules[7].querySelector("input").value = statut;

        // Réinitialiser le formulaire
        nomTechnique.value = "";
        bonusUtilise.value = "";
        bonusCalcule.value = "-";
        coutTechnique.value = "";
        porteeTechnique.value = "";
        dureeTechnique.value = "";
        nombreDesEffets.value = "";
        facesDesEffets.value = "";
        typeTechnique.value = "";
        statutTechnique.value = "";

        // Fermer la fenêtre
        modalTechnique.style.display = "none";
    }

    function actualiserTechniquesPersonnalisees() {

        console.log("Actualisation des techniques déclenchée");
        const lignes = listeTechniques.querySelectorAll("tr");

        lignes.forEach(function (ligne) {

            // Vérifier que la ligne correspond à une technique personnalisée
            if (!ligne.dataset.bonusUtilise) return;

            const cellules = ligne.querySelectorAll("td");

            const typeBonus = ligne.dataset.bonusUtilise;
            const caracteristique = ligne.dataset.caracteristique;

            // Récupérer les valeurs actuelles
            const modificateur = caracteristique
                ? Number(document.getElementById(caracteristique).value)
                : 0;

            const bonus = typeBonus
                ? Number(document.getElementById(associationsBonus[typeBonus].bonus).value)
                : 0;

            // Actualiser le bonus de la technique
            cellules[4].querySelector("input").value = modificateur + bonus;

            // Actualiser les effets
            const nombreDes = ligne.dataset.nombreDes;
            const facesDes = ligne.dataset.facesDes;

            cellules[5].querySelector("input").value =
                `${nombreDes}d${facesDes} + ${modificateur}`;

            // Actualiser le statut
            const type = cellules[6].querySelector("select").value;

            if (type && probabilitesBase[type] !== undefined) {
                const seuil = probabilitesBase[type].seuil + (5 * bonus);

                cellules[7].querySelector("input").value = `≤ ${seuil}`;
            } else {
                cellules[7].querySelector("input").value = "";
            }
        });
    }
    
    document.addEventListener("valeurs-caracteristiques-modifiees", actualiserTechniquesPersonnalisees);

    // Valider la création d'une technique
    boutonValiderTechnique.addEventListener("click", creerTechniquePersonnalisee);

    // Annuler la création
    boutonAnnulerTechnique.addEventListener("click", function () {
        modalTechnique.style.display = "none";
    });

    // Adapter le nombre de lignes au niveau du personnage
    function actualiserTechniques() {

        const niveau = Number(document.getElementById("niveau").value);
        const nombreSouhaite = niveau * 2;

        const nombreActuel = listeTechniques.children.length;

        // Ajouter les lignes manquantes
        for (let i = nombreActuel; i < nombreSouhaite; i++) {
            ajouterTechnique();
        }

        // Supprimer les lignes excédentaires
        while (listeTechniques.children.length > nombreSouhaite) {
            listeTechniques.lastElementChild.remove();
        }
    }

    // Créer les lignes selon le niveau du personnage
    actualiserTechniques();

    document.addEventListener("montee-niveau-validee", actualiserTechniques);

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
    const manaMax = document.getElementById("mana-max");
    const manaActuel = document.getElementById("mana-actuel");

    // Ajouter une nouvelle ligne vide
    function ajouterSort() {
        const nouveauSort = modeleSort.content.cloneNode(true);

        // Empêcher la modification des listes déroulantes
        nouveauSort.querySelectorAll("select").forEach(function (select) {
            select.addEventListener("mousedown", function (event) {
                event.preventDefault();
            });

            select.addEventListener("keydown", function (event) {
                event.preventDefault();
            });
        });

        listeSorts.appendChild(nouveauSort);
    }

    // Consommer le mana nécessaire au lancement d'un sort
    function consommerManaSort(ligne) {
        const coutMana = Number(ligne.dataset.mana);
        const manaDisponible = Number(manaActuel.value);

        if (manaDisponible < coutMana) {
            alert("Mana insuffisant pour lancer ce sort !");
            return false;
        }

        manaActuel.value = manaDisponible - coutMana;

        return true;
    }

    // Rendre la fonction accessible depuis le bloc de création des sorts
    window.ajouterSort = ajouterSort;
    window.listeSorts = listeSorts;

    // Calculer le nombre de lignes nécessaires
    function actualiserNombreSorts() {

        const nombreSorts = Math.floor(Number(manaMax.value) / 3);

        const nombreActuel = window.listeSorts.querySelectorAll("tr").length;

        // Ajouter uniquement les lignes manquantes
        for (let i = nombreActuel; i < nombreSorts; i++) {
            ajouterSort();
        }
    }

    // Initialisation au chargement
    actualiserNombreSorts();

    // Ajouter une ligne manuellement
    boutonAjouterSort.addEventListener("click", ajouterSort);

    // Actualiser lorsque la mana maximale change
    manaMax.addEventListener("input", actualiserNombreSorts);

    // Supprimer uniquement le sort sélectionné
    window.listeSorts.addEventListener("click", function (event) {
        const bouton = event.target.closest(".supprimer-sort");

        if (bouton) {
            bouton.closest("tr").remove();
        }
    });

    // Ctrl + clic sur la cellule Mana
    listeSorts.addEventListener("click", function (event) {
        if (!event.ctrlKey) return;

        const cellule = event.target.closest("td");
        if (!cellule || cellule.cellIndex !== 2) return;

        const ligne = cellule.closest("tr");
        if (!ligne || !ligne.dataset.mana) return;

        event.preventDefault();

        consommerManaSort(ligne);
    });   

    // Ctrl + clic sur la cellule Bonus
    listeSorts.addEventListener("click", function (event) {
        if (!event.ctrlKey) return;

        const cellule = event.target.closest("td");
        if (!cellule || cellule.cellIndex !== 5) return;

        const ligne = cellule.closest("tr");
        if (!ligne || !ligne.dataset.bonusUtilise) return;

        event.preventDefault();

        const bonus = Number(cellule.querySelector("input").value);
        const nom = ligne.cells[0].querySelector("input").value;

        window.ouvrirFenetreJet(
            "Bonus du sort : " + nom,
            bonus
        );
    });

    // Ctrl + clic sur la cellule Effets
    listeSorts.addEventListener("click", function (event) {
        if (!event.ctrlKey) return;

        const cellule = event.target.closest("td");
        if (!cellule || cellule.cellIndex !== 6) return;

        const ligne = cellule.closest("tr");
        if (!ligne || !ligne.dataset.nombreDes) return;

        event.preventDefault();

        const nombreDes = Number(ligne.dataset.nombreDes);
        const facesDes = Number(ligne.dataset.facesDes);
        const caracteristique = ligne.dataset.caracteristique;

        const bonusEffets = caracteristique
            ? Number(document.getElementById(caracteristique).value)
            : 0;

        const nom = ligne.cells[0].querySelector("input").value;

        window.ouvrirFenetreJet(
            "Effets du sort : " + nom,
            bonusEffets,
            null,
            "effets",
            nombreDes,
            facesDes
        );
    });

    // Ctrl + clic sur la cellule Statut
    listeSorts.addEventListener("click", function (event) {
        if (!event.ctrlKey) return;

        const cellule = event.target.closest("td");
        if (!cellule || cellule.cellIndex !== 8) return;

        const ligne = cellule.closest("tr");
        if (!ligne) return;

        event.preventDefault();

        const type = ligne.cells[7].querySelector("select").value;
        const valeurStatut = cellule.querySelector("input").value;

        if (!type || probabilitesBase[type] === undefined || !valeurStatut) {
            return;
        }

        const correspondance = valeurStatut.match(/\d+/);
        if (!correspondance) return;

        const seuil = Number(correspondance[0]);
        const effet = probabilitesBase[type].effet;
        const nom = ligne.cells[0].querySelector("input").value;

        window.ouvrirFenetreJet(
            "Statut du sort : " + nom,
            0,
            null,
            "d100",
            1,
            100,
            seuil,
            effet
        );
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





/* ==================== SAUVEGARDE ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const boutonSauvegarder = document.getElementById("sauvegarder-personnage");
    const boutonCharger = document.getElementById("charger-personnage");
    const inputFichier = document.getElementById("fichier-personnage");

    // Correspondance entre les tableaux et leurs modèles HTML
    const tableaux = [
        { nom: "techniques", liste: "liste-techniques", modele: "modele-technique" },
        { nom: "sorts", liste: "liste-sorts", modele: "modele-sort" },
        { nom: "equipement", liste: "liste-equipement", modele: "modele-equipement" },
        { nom: "inventaire", liste: "liste-inventaire", modele: "modele-inventaire" },
        { nom: "traitsEspeces", liste: "liste-traits-especes", modele: "modele-trait-espece" },
        { nom: "essences", liste: "liste-essences", modele: "modele-essence" }
    ];

    // Lire la valeur d'un champ
    function lireChamp(champ) {
        return {
            valeur: champ.value,
            coche: champ.type === "checkbox" || champ.type === "radio"
                ? champ.checked
                : undefined
        };
    }

    // Restaurer la valeur d'un champ
    function restaurerChamp(champ, donnees) {
        if (champ.type === "checkbox" || champ.type === "radio") {
            champ.checked = donnees.coche;
        } else {
            champ.value = donnees.valeur;
        }
    }

    // Champs situés hors des tableaux dynamiques
    function obtenirChampsFixes() {
        return Array.from(
            document.querySelectorAll("input:not([type='file']), textarea, select")
        ).filter(champ =>
            !champ.closest("tbody") &&
            !["historique-des-vie", "ajustement-pv"].includes(champ.id)
        );
    }

    // Sauvegarder les données du personnage dans un fichier JSON
    boutonSauvegarder.addEventListener("click", async function () {

        const donnees = {
            version: 3,
            champsFixes: obtenirChampsFixes().map(lireChamp),
            tableaux: {},
            portrait: null,

            progressionPV: {
                historiqueDes: JSON.parse(
                    document.getElementById("historique-des-vie").value
                ),
                ajustement: Number(
                    document.getElementById("ajustement-pv").value
                )
            }
        };

        // Sauvegarder le portrait dans le fichier JSON
        const imagePortraitSauvee = document.getElementById("image-portrait");

        if (
            imagePortraitSauvee &&
            imagePortraitSauvee.src &&
            imagePortraitSauvee.style.display !== "none"
        ) {
            const reponse = await fetch(imagePortraitSauvee.src);
            const imageBlob = await reponse.blob();

            donnees.portrait = await new Promise((resolve, reject) => {
                const lecteur = new FileReader();

                lecteur.onload = () => resolve(lecteur.result);
                lecteur.onerror = () => reject(
                    new Error("Impossible de sauvegarder le portrait.")
                );

                lecteur.readAsDataURL(imageBlob);
            });
        }

        // Enregistrer les lignes de chaque tableau
        tableaux.forEach(function (tableau) {

            const liste = document.getElementById(tableau.liste);

            donnees.tableaux[tableau.nom] = Array.from(
                liste.querySelectorAll(":scope > tr")
            ).map(function (ligne) {

                return Array.from(
                    ligne.querySelectorAll("input:not([type='file']), textarea, select")
                ).map(lireChamp);

            });
        });

        const contenu = JSON.stringify(donnees, null, 2);
        const fichier = new Blob([contenu], {
            type: "application/json"
        });

        const url = URL.createObjectURL(fichier);
        const lien = document.createElement("a");

        lien.href = url;
        lien.download = "personnage.json";
        lien.click();

        URL.revokeObjectURL(url);
    });

    // Ouvrir le sélecteur de fichier
    boutonCharger.addEventListener("click", function () {
        inputFichier.click();
    });

    // Charger une sauvegarde JSON
    inputFichier.addEventListener("change", async function () {

        const fichier = inputFichier.files[0];
        if (!fichier) return;

        try {
            const donnees = JSON.parse(await fichier.text());

            if (
                ![1, 2, 3].includes(donnees.version) ||
                !donnees.tableaux ||
                !Array.isArray(donnees.champsFixes)
            ) {
                throw new Error("Format de sauvegarde non reconnu.");
            }

            // Vérifier les éléments HTML nécessaires avant toute modification
            tableaux.forEach(function (tableau) {
                if (
                    !document.getElementById(tableau.liste) ||
                    !document.getElementById(tableau.modele) ||
                    !Array.isArray(donnees.tableaux[tableau.nom])
                ) {
                    throw new Error("Données ou modèle manquant : " + tableau.nom);
                }
            });

            // Restaurer les champs fixes
            const champsFixes = obtenirChampsFixes();

            donnees.champsFixes.forEach(function (champSauve, index) {
                if (champsFixes[index]) {
                    restaurerChamp(champsFixes[index], champSauve);
                }
            });

            // Restaurer la progression des points de vie
            const historiqueDesVie = document.getElementById("historique-des-vie");
            const ajustementPV = document.getElementById("ajustement-pv");

            historiqueDesVie.value = JSON.stringify(
                donnees.progressionPV?.historiqueDes || []
            );

            ajustementPV.value = donnees.progressionPV?.ajustement ?? 0;

            // Signaler que le personnage vient d'être chargé
            document.dispatchEvent(new Event("personnage-charge"));

            // Reconstruire les tableaux sans doublons
            tableaux.forEach(function (tableau) {

                const liste = document.getElementById(tableau.liste);
                const modele = document.getElementById(tableau.modele);

                // Supprimer les anciennes lignes
                liste.replaceChildren();

                // Recréer uniquement les lignes sauvegardées
                donnees.tableaux[tableau.nom].forEach(function (ligneSauvee) {

                    const copie = modele.content.cloneNode(true);
                    liste.appendChild(copie);

                    const ligne = liste.lastElementChild;
                    const champs = ligne.querySelectorAll(
                        "input:not([type='file']), textarea, select"
                    );

                    ligneSauvee.forEach(function (champSauve, index) {
                        if (champs[index]) {
                            restaurerChamp(champs[index], champSauve);
                        }
                    });

                });
            });
                    // Restaurer le portrait
                    const imagePortraitChargee = document.getElementById("image-portrait");
                    const indicationPortrait = document.getElementById("indication-portrait");

                    if (donnees.portrait && imagePortraitChargee) {
                        imagePortraitChargee.src = donnees.portrait;
                        imagePortraitChargee.style.display = "block";

                        if (indicationPortrait) {
                            indicationPortrait.style.display = "none";
                        }
                    } else if (imagePortraitChargee) {
                        imagePortraitChargee.removeAttribute("src");
                        imagePortraitChargee.style.display = "none";

                        if (indicationPortrait) {
                            indicationPortrait.style.display = "block";
                        }
                    }

            alert("Personnage chargé avec succès !");

        } catch (erreur) {
            alert("Impossible de charger ce fichier : " + erreur.message);
        }

        // Permet de sélectionner à nouveau le même fichier
        inputFichier.value = "";
    });

});

/* ==================== LANCER DE DES ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const fenetreJet = document.getElementById("fenetre-jet");
    const nomJet = document.getElementById("nom-jet");
    const formuleJet = document.getElementById("formule-jet");
    const boutonLancer = document.getElementById("lancer-des");
    const boutonFermer = document.getElementById("fermer-fenetre-jet");
    const resultatJet = document.getElementById("resultat-jet");

    let bonusActuel = 0;
    let typeJetActuel = "d20";
    let nombreDesActuel = 1;
    let facesDesActuel = 20;
    let seuilStatutActuel = null;
    let effetStatutActuel = "";

    // Ouvrir la fenêtre avec les informations du jet
    function ouvrirFenetreJet(
        nom,
        bonus,
        optionsBonus = null,
        typeJet = "d20",
        nombreDes = 1,
        facesDes = 20,
        seuilStatut = null,
        effetStatut = ""
    ) {
        
        typeJetActuel = typeJet;
        nombreDesActuel = nombreDes;
        facesDesActuel = facesDes;
        seuilStatutActuel = seuilStatut;
        effetStatutActuel = effetStatut;

        const selectionBonus = document.getElementById("selection-bonus-jet");
        const selectBonus = document.getElementById("type-bonus-jet");

        nomJet.textContent = nom;

        // Cas d'un jet simple : caractéristique
        if (optionsBonus === null) {

            bonusActuel = bonus;
            selectionBonus.hidden = true;

        } else {

            // Cas d'une sauvegarde ou d'une compétence
            selectionBonus.hidden = false;

            // Valeurs nécessaires au calcul
            const bonusCombat = optionsBonus.bonusCombat;
            const bonusIncantation = optionsBonus.bonusIncantation;
            const multiplicateur = optionsBonus.multiplicateur;

            function actualiserBonus() {

                const bonusChoisi = selectBonus.value === "combat"
                    ? bonusCombat
                    : bonusIncantation;

                bonusActuel = bonus + bonusChoisi * multiplicateur;

                afficherFormule();
            }

            // Éviter de multiplier les événements à chaque ouverture
            selectBonus.onchange = actualiserBonus;

            // Choix par défaut
            selectBonus.value = "combat";

            actualiserBonus();
        }

        function afficherFormule() {

            if (typeJetActuel === "d100") {
                formuleJet.textContent = "D100 ≤ " + seuilStatutActuel;
                return;
            }

            const signe = bonusActuel >= 0 ? "+" : "-";

            formuleJet.textContent =
                nombreDesActuel + "d" + facesDesActuel +
                " " + signe + " " + Math.abs(bonusActuel);
        }

        afficherFormule();

        document.querySelector(
            'input[name="type-jet"][value="normal"]'
        ).checked = true;

        resultatJet.innerHTML = "";

        fenetreJet.showModal();
    }

    window.ouvrirFenetreJet = ouvrirFenetreJet;

        // Lancer un dé avec un nombre de faces donné
        function lancerDe(faces) {
            return Math.floor(Math.random() * faces) + 1;
        }

    // Effectuer le jet
    boutonLancer.addEventListener("click", function () {

        const typeJet = document.querySelector(
            'input[name="type-jet"]:checked'
        ).value;

        console.log("Type de jet :", typeJetActuel);

        // Nombre de séries à lancer
        const nombreSeries = typeJet === "normal" ? 1 : 2;

        let series = [];

        // Lancer chaque série de dés
        for (let i = 0; i < nombreSeries; i++) {

            let des = [];

            for (let j = 0; j < nombreDesActuel; j++) {
                des.push(lancerDe(facesDesActuel));
            }

            const totalDes = des.reduce(function (total, de) {
                return total + de;
            }, 0);

            series.push({
                des: des,
                total: totalDes + bonusActuel
            });
        }

        // Déterminer le résultat conservé
        let serieConservee;

        if (typeJet === "avantage") {
            serieConservee = series.reduce((a, b) =>
                a.total > b.total ? a : b
            );
        } else if (typeJet === "desavantage") {
            serieConservee = series.reduce((a, b) =>
                a.total < b.total ? a : b
            );
        } else {
            serieConservee = series[0];
        }

        // Afficher les résultats
        let detailDes = series.map(function (serie, index) {
            return `Série ${index + 1} : ${serie.des.join(" + ")} = ${serie.des.reduce((a, b) => a + b, 0)}`;
        }).join("<br>");

        if (series.length === 2) {
            detailDes += `<br><strong>Résultat conservé : ${serieConservee.total}</strong>`;
        }

        // Résultat d'un statut

        console.log("Résultat du dé :", serieConservee.total);


        if (typeJetActuel === "d100") {

            const reussi = serieConservee.total <= seuilStatutActuel;

            resultatJet.innerHTML = `
                <p>Résultat obtenu : ${serieConservee.total}</p>
                <p>Seuil : ${seuilStatutActuel}</p>
                <span class="resultat-total">${reussi ? "Réussite !" : "Échec"}</span>
                ${reussi ? `<p>${effetStatutActuel}</p>` : ""}
            `;

            return;
        }

        // Résultat des autres jets
        const signe = bonusActuel >= 0 ? "+" : "-";

        resultatJet.innerHTML = `
            <p>${detailDes}</p>
            <p>Bonus : ${signe} ${Math.abs(bonusActuel)}</p>
            <span class="resultat-total">${serieConservee.total}</span>
        `;

    });

    // Fermer la fenêtre
    boutonFermer.addEventListener("click", function () {
        fenetreJet.close();
    });

    // Ctrl + clic gauche sur INITIATIVE
    document.getElementById("titre-initiative").addEventListener("click", function (event) {

        if (!event.ctrlKey) return;

        event.preventDefault();

        const bonus = Number(document.getElementById("initiative").value);

        ouvrirFenetreJet("Initiative", bonus);

    });

    // Ctrl + clic gauche sur les cellules des techniques
    document.getElementById("liste-techniques").addEventListener("click", function (event) {

        if (!event.ctrlKey) return;

        const cellule = event.target.closest("td");
        if (!cellule) return;

        const ligne = cellule.closest("tr");
        if (!ligne) return;

        const index = cellule.cellIndex;

        console.log("Colonne cliquée :", index);
        console.log("Valeur du statut :", ligne.cells[7].querySelector("input").value);
        console.log("Type :", ligne.cells[6].querySelector("select").value);

        // Bonus
        if (index === 4) {
            event.preventDefault();

            const bonus = Number(cellule.querySelector("input").value);

            ouvrirFenetreJet("Bonus de technique", bonus);
        }

        // Effets
        if (index === 5) {
            event.preventDefault();

            const nombreDes = Number(ligne.dataset.nombreDes);
            const facesDes = Number(ligne.dataset.facesDes);

            const caracteristique = ligne.dataset.caracteristique;

            const bonusEffets = caracteristique
                ? Number(document.getElementById(caracteristique).value)
                : 0;

            const nom = ligne.cells[0].querySelector("input").value;

            ouvrirFenetreJet(
                "Effets : " + nom,
                bonusEffets,
                null,
                "effets",
                nombreDes,
                facesDes
            );
        }

        // Statut
        if (index === 7) {
            event.preventDefault();

            const type = ligne.cells[6].querySelector("select").value;
            const valeurStatut = ligne.cells[7].querySelector("input").value;

            // Vérifier qu'un statut est défini
            if (!type || !valeurStatut) return;

            const correspondance = valeurStatut.match(/\d+/);
            if (!correspondance) return;

            const seuil = Number(correspondance[0]);
            const effet = probabilitesBase[type].effet;

            const nom = ligne.cells[0].querySelector("input").value;

            ouvrirFenetreJet(
                "Statut : " + nom,
                0,
                null,
                "d100",
                1,
                100,
                seuil,
                effet
            );
        }

    });

});

/* ==================== LANCER DE DES CARACTERISTIQUES ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const caracteristiques = document.querySelectorAll(".caracteristique");

    caracteristiques.forEach(function (bloc) {

        const titre = bloc.querySelector("h3");
        const champModificateur = bloc.querySelector(
            'input[id$="-modificateur"]'
        );

        if (!titre || !champModificateur) return;

        titre.addEventListener("click", function (event) {

            // Vérifier que CTRL est maintenu
            if (!event.ctrlKey) return;

            event.preventDefault();

            const nom = titre.textContent.trim();
            const bonus = Number(champModificateur.value) || 0;

            window.ouvrirFenetreJet(nom, bonus);

        });

        titre.style.cursor = "pointer";

    });

});

/* ==================== LANCER DE DES SAUVEGARDE ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const blocsCaracteristiques = document.querySelectorAll(
        ".caracteristique"
    );

    blocsCaracteristiques.forEach(function (bloc) {

        const titre = bloc.querySelector("h3");

        const champModificateur = bloc.querySelector(
            'input[id$="-modificateur"]'
        );

        const sauvegarde = bloc.querySelector(".sauvegarde");

        if (!titre || !champModificateur || !sauvegarde) return;

        const caseMaitrise = sauvegarde.querySelector('input[type="checkbox"]');

        const nom = titre.textContent.trim();

        const titreSauvegarde = sauvegarde.querySelector("strong");

        titreSauvegarde.style.cursor = "pointer";

        titreSauvegarde.addEventListener("click", function (event) {

            if (!event.ctrlKey) return;

            event.preventDefault();

            const modificateur =
                Number(champModificateur.value) || 0;

            const bonusCombat =
                Number(document.getElementById("bonus-combat").value) || 0;

            const bonusIncantation =
                Number(document.getElementById("bonus-incantation").value) || 0;

            const multiplicateur = caseMaitrise.checked ? 1 : 0;

            window.ouvrirFenetreJet(
                "Sauvegarde : " + nom,
                modificateur,
                {
                    bonusCombat: bonusCombat,
                    bonusIncantation: bonusIncantation,
                    multiplicateur: multiplicateur
                }
            );

        });

    });

});


/* ==================== LANCER DE DES COMPETENCES ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const competences = document.querySelectorAll(".competence");

    competences.forEach(function (competence) {

        // Nom de la compétence
        const nomCompetence = competence.querySelector("span");

        // Cases de maîtrise et d'expertise
        const cases = competence.querySelectorAll(
            'input[type="checkbox"]'
        );

        const caseMaitrise = cases[0];
        const caseExpertise = cases[1];

        // Récupérer le bloc de caractéristique associé
        const blocCaracteristique = competence.closest(".caracteristique");

        if (!nomCompetence || !blocCaracteristique || cases.length < 2) {
            return;
        }

        // Récupérer le modificateur de la caractéristique
        const champModificateur = blocCaracteristique.querySelector(
            'input[id$="-modificateur"]'
        );

        if (!champModificateur) return;

        nomCompetence.style.cursor = "pointer";

        // Déclencher le jet avec CTRL + clic gauche
        nomCompetence.addEventListener("click", function (event) {

            if (!event.ctrlKey) return;

            event.preventDefault();

            const nom = nomCompetence.textContent.trim();

            const modificateur =
                Number(champModificateur.value) || 0;

            const bonusCombat =
                Number(document.getElementById("bonus-combat").value) || 0;

            const bonusIncantation =
                Number(document.getElementById("bonus-incantation").value) || 0;

            // Déterminer le multiplicateur de maîtrise
            let multiplicateur = 0;

            if (caseExpertise.checked) {
                multiplicateur = 2;
            } else if (caseMaitrise.checked) {
                multiplicateur = 1;
            }

            // Ouvrir la fenêtre de lancer de dés
            window.ouvrirFenetreJet(
                "Compétence : " + nom,
                modificateur,
                {
                    bonusCombat: bonusCombat,
                    bonusIncantation: bonusIncantation,
                    multiplicateur: multiplicateur
                }
            );

        });

    });

});

/* ==================== CALCUL DES MODIFICATEURS ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const caracteristiques = document.querySelectorAll(".caracteristique");

    caracteristiques.forEach(function (bloc) {

        const champValeur = bloc.querySelector('input[id$="-valeur"]');
        const champModificateur = bloc.querySelector('input[id$="-modificateur"]');

        if (!champValeur || !champModificateur) return;

        function calculerModificateur() {

            const valeur = Number(champValeur.value);

            if (champValeur.value === "" || !Number.isFinite(valeur)) {
                champModificateur.value = "";
                return;
            }

            const modificateur = Math.floor((valeur - 10) / 2);

            champModificateur.value = modificateur;
        }

        champValeur.addEventListener("input", calculerModificateur);

        // Calcul initial au chargement de la page
        calculerModificateur();

    });

});

/* ==================== UNIQUEMENT M OU E DE COCHER ==================== */


document.addEventListener("DOMContentLoaded", function () {

    const competences = document.querySelectorAll(".competence");

    competences.forEach(function (competence) {

        const cases = competence.querySelectorAll('input[type="checkbox"]');

        if (cases.length < 2) return;

        const caseMaitrise = cases[0];
        const caseExpertise = cases[1];

        caseMaitrise.addEventListener("change", function () {
            if (caseMaitrise.checked) {
                caseExpertise.checked = false;
            }
        });

        caseExpertise.addEventListener("change", function () {
            if (caseExpertise.checked) {
                caseMaitrise.checked = false;
            }
        });

    });

});

/* ==================== MAITRISE AUTOMATIQUE D'UNE SAUVEGARDE A 20 DE VALEURS ================ */

document.addEventListener("DOMContentLoaded", function () {

    const caracteristiques = document.querySelectorAll(".caracteristique");

    caracteristiques.forEach(function (bloc) {

        const champValeur = bloc.querySelector('input[id$="-valeur"]');
        const sauvegarde = bloc.querySelector(".sauvegarde");

        if (!champValeur || !sauvegarde) return;

        const caseMaitrise = sauvegarde.querySelector('input[type="checkbox"]');

        if (!caseMaitrise) return;

        function actualiserSauvegarde() {

            const valeur = Number(champValeur.value);

            if (valeur >= 20) {
                caseMaitrise.checked = true;
            } else {
                caseMaitrise.checked = false;
            }

        }

        champValeur.addEventListener("input", actualiserSauvegarde);

        // Vérification initiale au chargement
        actualiserSauvegarde();

    });

});

/* ==================== CALCUL AUTOMATIQUE BC, BI ET RM ================ */


document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // BONUS DE COMBAT
    // ==========================================

    const caseCombatFor = document.getElementById("combat-for");
    const caseCombatDex = document.getElementById("combat-dex");
    const bonusCombat = document.getElementById("bonus-combat");

    const initiative = document.getElementById("initiative");
    const perceptionPassive = document.getElementById("perception-passive");
    const vitesse = document.getElementById("vitesse");

    const valeurForce = document.getElementById("force-valeur");
    const valeurDexterite = document.getElementById("dexterite-valeur");

    function calculerBonusCombat() {

        let valeur = null;

        if (caseCombatFor.checked) {
            valeur = Number(valeurForce.value);
        } else if (caseCombatDex.checked) {
            valeur = Number(valeurDexterite.value);
        }

        bonusCombat.value = valeur === null || !Number.isFinite(valeur)
            ? 0
            : Math.floor((valeur - 10) / 3);
        
        calculerInitiative();
        calculerPerceptionPassive();
        calculerVitesse();
        document.dispatchEvent(new Event("valeurs-caracteristiques-modifiees"));
    }


    // ==========================================
    // BONUS D'INCANTATION
    // ==========================================

    const caseIncantationInt = document.getElementById("incantation-int");
    const caseIncantationSag = document.getElementById("incantation-sag");
    const caseIncantationCha = document.getElementById("incantation-cha");

    const bonusIncantation = document.getElementById("bonus-incantation");

    const valeurIntelligence = document.getElementById("intelligence-valeur");
    const valeurSagesse = document.getElementById("sagesse-valeur");
    const valeurCharisme = document.getElementById("charisme-valeur");


    function calculerBonusIncantation() {

        let valeur = null;

        if (caseIncantationInt.checked) {
            valeur = Number(valeurIntelligence.value);
        } else if (caseIncantationSag.checked) {
            valeur = Number(valeurSagesse.value);
        } else if (caseIncantationCha.checked) {
            valeur = Number(valeurCharisme.value);
        }

        bonusIncantation.value = valeur === null || !Number.isFinite(valeur)
            ? 0
            : Math.floor((valeur - 10) / 3);

        calculerManaMax();
        calculerInitiative();
        calculerPerceptionPassive();
        calculerVitesse();
        document.dispatchEvent(new Event("valeurs-caracteristiques-modifiees"));

    }

    function calculerInitiative() {
        const bonusDexterite = Number(
            document.getElementById("dexterite-modificateur").value
        );

        initiative.value =
            Math.max(
                Number(bonusCombat.value),
                Number(bonusIncantation.value)
            ) + bonusDexterite;
    }

    function calculerPerceptionPassive() {
        const bonusSagesse = Number(
            document.getElementById("sagesse-modificateur").value
        );

        perceptionPassive.value = 10 +
            Math.max(
                Number(bonusCombat.value),
                Number(bonusIncantation.value)
            ) + bonusSagesse;
    }

    function calculerVitesse() {
        const especeChoisie = document.getElementById("espece").value;

        if (!especeChoisie || !especes[especeChoisie]) {
            vitesse.value = 0;
            return;
        }
        console.log("Espèce sélectionnée :", especeChoisie);
        const vitesseRaciale = especes[especeChoisie].vitesse;

        const bonusDexterite = caseCombatDex.checked
            ? Number(bonusCombat.value) * 1.5
            : 0;
        console.log("Vitesse raciale :", vitesseRaciale);
        vitesse.value = vitesseRaciale + bonusDexterite;
    }

    // Actualisation lors du changement d'espèce
    document.getElementById("espece").addEventListener("change", calculerVitesse);

    // Calcul initial
    calculerVitesse();

    // ==========================================
    // RESERVE DE MANA MAXIMALE
    // ==========================================

    const niveau = document.getElementById("niveau");
    const manaMax = document.getElementById("mana-max");

    function calculerManaMax() {

        const niv = Number(niveau.value);
        const bonus = Number(bonusIncantation.value);

        if (niveau.value === "" || bonusIncantation.value === "") {
            manaMax.value = 0;
        } else {
            manaMax.value = Math.max(0, 5 + (2 * niv) + (2 * bonus));
        }

        // Vérifier que le mana actuel ne dépasse pas le maximum
        limiterManaActuel();

        // Actualiser le nombre de lignes de sorts
        manaMax.dispatchEvent(new Event("input"));
    }

    function limiterManaActuel() {

        const manaActuel = document.getElementById("mana-actuel");

        const actuel = Number(manaActuel.value);
        const maximum = Number(manaMax.value);

        if (manaActuel.value === "") return;

        if (actuel > maximum) {
            manaActuel.value = maximum;
        }

        if (actuel < 0) {
            manaActuel.value = 0;
        }
    }


    // ==========================================
    // EVENEMENTS
    // ==========================================

    // Cases de combat
    [caseCombatFor, caseCombatDex].forEach(function (caseCarac) {
        caseCarac.addEventListener("change", function () {

            if (caseCarac.checked) {
                if (caseCarac === caseCombatFor) {
                    caseCombatDex.checked = false;
                } else {
                    caseCombatFor.checked = false;
                }
            }

            calculerBonusCombat();
        });
    });

    // Cases d'incantation
    const casesIncantation = [
        caseIncantationInt,
        caseIncantationSag,
        caseIncantationCha
    ];

    casesIncantation.forEach(function (caseCarac) {
        caseCarac.addEventListener("change", function () {

            if (caseCarac.checked) {
                casesIncantation.forEach(function (autreCase) {
                    if (autreCase !== caseCarac) {
                        autreCase.checked = false;
                    }
                });
            }

            calculerBonusIncantation();
        });
    });

    // Modification des caractéristiques
    [valeurForce, valeurDexterite].forEach(function (champ) {
        champ.addEventListener("input", calculerBonusCombat);
    });

    [valeurIntelligence, valeurSagesse, valeurCharisme].forEach(function (champ) {
        champ.addEventListener("input", calculerBonusIncantation);
    });

    // Modification du niveau
    niveau.addEventListener("input", calculerManaMax);

    // La mana actuelle ne peut pas dépasser la mana max.
    document.getElementById("mana-actuel").addEventListener("input", limiterManaActuel);


    // ==========================================
    // CALCULS INITIAUX
    // ==========================================

    calculerBonusCombat();
    calculerBonusIncantation();

});

/* ==================== DES DE VIE ET PV MAX ================ */


document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS HTML
    // ==========================================

    const espece = document.getElementById("espece");

    const constitution = document.getElementById("constitution-modificateur");

    const niveau = document.getElementById("niveau");

    const pvMax = document.getElementById("pv-max");
    const historiqueDesVie = document.getElementById("historique-des-vie");
    const ajustementPV = document.getElementById("ajustement-pv");
    const pvActuels = document.getElementById("pv-actuels");

    const desMax = document.getElementById("des-max");
    const desActuels = document.getElementById("des-actuels");


    // ==========================================
    // CALCUL DES POINTS DE VIE MAXIMUM
    // ==========================================

    function calculerPVMax() {

        const especeChoisie = especes[espece.value];

        if (!especeChoisie || constitution.value === "") {
            pvMax.value = 0;
            limiterPVActuels();
            return;
        }

        const deVie = especeChoisie.deVie;
        const modificateurConstitution = Number(constitution.value);
        const niveauActuel = Number(niveau.value);

        // Récupérer l'historique des dés
        const historique = JSON.parse(historiqueDesVie.value || "[]");

        // PV du niveau 1 : dé racial maximal
        let totalPV = deVie;

        // Ajouter les résultats des dés des niveaux suivants
        historique.forEach(function (resultat) {
            totalPV += Number(resultat);
        });

        // Appliquer le modificateur de Constitution à tous les niveaux
        totalPV += modificateurConstitution * niveauActuel;

        // Ajouter les éventuels ajustements manuels
        totalPV += Number(ajustementPV.value || 0);

        pvMax.value = Math.max(1, totalPV);

        limiterPVActuels();
    }


    // ==========================================
    // LIMITATION DES POINTS DE VIE ACTUELS
    // ==========================================

    function limiterPVActuels() {

        if (pvActuels.value === "") return;

        pvActuels.value = Math.max(
            0,
            Math.min(Number(pvActuels.value), Number(pvMax.value))
        );
    }


    // ==========================================
    // CALCUL DES DES DE VIE MAXIMUM
    // ==========================================

    function calculerDesMax() {

        const valeurNiveau = Number(niveau.value);

        desMax.value = Math.max(0, valeurNiveau);

        limiterDesActuels();
    }


    // ==========================================
    // LIMITATION DES DES DE VIE ACTUELS
    // ==========================================

    function limiterDesActuels() {

        if (desActuels.value === "") return;

        desActuels.value = Math.max(
            0,
            Math.min(Number(desActuels.value), Number(desMax.value))
        );
    }


    // ==========================================
    // EVENEMENTS
    // ==========================================

    espece.addEventListener("change", calculerPVMax);

    document.getElementById("constitution-valeur").addEventListener("input", calculerPVMax);

    niveau.addEventListener("input", calculerDesMax);

    pvActuels.addEventListener("input", limiterPVActuels);

    desActuels.addEventListener("input", limiterDesActuels);

    document.addEventListener("montee-niveau-validee", calculerPVMax);


    // ==========================================
    // CALCULS INITIAUX
    // ==========================================

    document.dispatchEvent(new Event("montee-niveau-validee"));
    calculerDesMax();

});


/* ==================== REPARTITION DES POINTS DE CARACTERISTIQUES LORS D'UNE MONTEE DE NIVEAU ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const pointsRestants = document.getElementById("points-restants");

    const champsPoints = [
        document.getElementById("points-force"),
        document.getElementById("points-constitution"),
        document.getElementById("points-dexterite"),
        document.getElementById("points-intelligence"),
        document.getElementById("points-sagesse"),
        document.getElementById("points-charisme")
    ];

    function calculerPointsRestants() {

        const totalDepense = champsPoints.reduce(function (total, champ) {
            return total + Number(champ.value);
        }, 0);

        pointsRestants.textContent = 3 - totalDepense;

        champsPoints.forEach(function (champ) {
            champ.disabled = totalDepense >= 3 && Number(champ.value) === 0;
        });
    }

        // Réinitialiser les points lors d'une nouvelle montée de niveau
    document.addEventListener("reinitialiser-points-montee-niveau", function () {

        champsPoints.forEach(function (champ) {
            champ.value = 0;
            champ.disabled = false;
        });

        calculerPointsRestants();

    });

    champsPoints.forEach(function (champ) {

        champ.addEventListener("input", function () {

            let totalDepense = champsPoints.reduce(function (total, champ) {
                return total + Number(champ.value);
            }, 0);

            if (totalDepense > 3) {
                champ.value = Math.max(0, Number(champ.value) - (totalDepense - 3));
            }

            calculerPointsRestants();

        });

    });

    calculerPointsRestants();

});

/* ==================== OUVERTURE FENETRE MONTEE DE NIVEAU ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const boutonMonterNiveau = document.getElementById("monter-niveau");
    const fenetreMonteeNiveau = document.getElementById("fenetre-montee-niveau");
    const boutonFermer = document.getElementById("fermer-montee-niveau");

    // Ouvrir la fenêtre
    boutonMonterNiveau.addEventListener("click", function () {

        // Réinitialiser les six champs de répartition
        const champsPoints = [
            "points-force",
            "points-constitution",
            "points-dexterite",
            "points-intelligence",
            "points-sagesse",
            "points-charisme"
        ];

        champsPoints.forEach(function (id) {
            const champ = document.getElementById(id);
            champ.value = 0;
            champ.disabled = false;
        });

        // Réinitialiser le compteur
        document.getElementById("points-restants").textContent = "3";

        // Réinitialiser les étapes
        document.getElementById("etape-caracteristiques").hidden = false;
        document.getElementById("etape-de-vie").hidden = true;
        document.getElementById("etape-validation").hidden = true;
        document.dispatchEvent(new Event("reinitialiser-de-vie"));

        fenetreMonteeNiveau.showModal();

    });

    // Fermer la fenêtre
    boutonFermer.addEventListener("click", function () {
        fenetreMonteeNiveau.close();
    });

});

/* ==================== VALIDATION DES CARACTERISTIQUES ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const boutonConfirmer = document.getElementById("confirmer-caracteristiques");
    const etapeCaracteristiques = document.getElementById("etape-caracteristiques");
    const etapeDeVie = document.getElementById("etape-de-vie");

    const champsPoints = [
        "points-force",
        "points-constitution",
        "points-dexterite",
        "points-intelligence",
        "points-sagesse",
        "points-charisme"
    ];

    boutonConfirmer.addEventListener("click", function () {

        const totalDepense = champsPoints.reduce(function (total, id) {
            return total + Number(document.getElementById(id).value);
        }, 0);

        if (totalDepense !== 3) {
            alert("Vous devez répartir les 3 points de caractéristique avant de continuer.");
            return;
        }

        // Passer à l'étape du dé de vie
        etapeCaracteristiques.hidden = true;
        etapeDeVie.hidden = false;

    });

});

/* ==================== LANCER DU DE ET RESUME ==================== */

document.addEventListener("DOMContentLoaded", function () {

    const espece = document.getElementById("espece");
    const niveau = document.getElementById("niveau");
    const constitution = document.getElementById("constitution-modificateur");

    const historiqueDesVie = document.getElementById("historique-des-vie");
    const ajustementPV = document.getElementById("ajustement-pv");

    const boutonValider = document.getElementById("valider-montee-niveau");
    const pvMax = document.getElementById("pv-max");
    const pvActuels = document.getElementById("pv-actuels");
    const desMax = document.getElementById("des-max");
    const desActuels = document.getElementById("des-actuels");

    const boutonLancer = document.getElementById("lancer-de-vie");
    const boutonRetour = document.getElementById("retour-etape-de-vie");

    const etapeDeVie = document.getElementById("etape-de-vie");
    const etapeValidation = document.getElementById("etape-validation");

    const resultatDeVieHTML = document.getElementById("resultat-de-vie");
    const resume = document.getElementById("resume-montee-niveau");

    let resultatDeVie = null;

    document.addEventListener("reinitialiser-de-vie", function () {
    resultatDeVie = null;
    resultatDeVieHTML.textContent = "";
    });

    // Lancer le dé ou revenir au résumé
    boutonLancer.addEventListener("click", function () {

        const valeurDe = especes[espece.value]?.deVie;

        if (!valeurDe) {
            alert("Veuillez sélectionner une espèce.");
            return;
        }

        // Ne lancer le dé qu'une seule fois
        if (resultatDeVie === null) {

            let resultat;

            do {
                resultat = Math.floor(Math.random() * valeurDe) + 1;
            } while (resultat === 1);

            resultatDeVie = resultat;

            resultatDeVieHTML.textContent =
                "Résultat du dé : " + resultatDeVie + " (d" + valeurDe + ")";

        }

        // Préparer le résumé
        const nouveauNiveau = Number(niveau.value) + 1;
        const bonusConstitution = Number(constitution.value);
        const gainPV = resultatDeVie + bonusConstitution;

        resume.textContent =
            "Niveau actuel : " + niveau.value +
            " → Nouveau niveau : " + nouveauNiveau +
            " | Dé de vie : " + resultatDeVie +
            " | Bonus de Constitution : " + bonusConstitution +
            " | Gain de PV : " + gainPV;

        etapeDeVie.hidden = true;
        etapeValidation.hidden = false;

    });

    // Retour à l'étape du dé sans perdre le résultat
    boutonRetour.addEventListener("click", function () {

        etapeValidation.hidden = true;
        etapeDeVie.hidden = false;

    });

    // ==========================================
    // VALIDATION DEFINITIVE DE LA MONTEE DE NIVEAU
    // ==========================================

    boutonValider.addEventListener("click", function () {

        // Correspondance entre les points attribués et les caractéristiques
        const correspondances = {
            "points-force": "force-valeur",
            "points-constitution": "constitution-valeur",
            "points-dexterite": "dexterite-valeur",
            "points-intelligence": "intelligence-valeur",
            "points-sagesse": "sagesse-valeur",
            "points-charisme": "charisme-valeur"
        };

        // Vérifier que les 3 points sont bien répartis
        const totalDepense = Object.keys(correspondances).reduce(function (total, id) {
            return total + Number(document.getElementById(id).value);
        }, 0);

        if (totalDepense !== 3) {
            alert("Vous devez répartir les 3 points de caractéristique avant de continuer.");
            return;
        }

        // Vérifier que le dé de vie a été lancé
        if (resultatDeVie === null) {
            alert("Vous devez lancer le dé de vie avant de valider.");
            return;
        }

        // Vérifier que le niveau maximum n'est pas atteint
        const niveauActuel = Number(niveau.value);
        const nouveauNiveau = niveauActuel + 1;

        if (nouveauNiveau > 20) {
            alert("Le niveau maximum est déjà atteint.");
            return;
        }

        // Appliquer les points aux caractéristiques
        Object.entries(correspondances).forEach(function ([idPoints, idCaracteristique]) {

            const points = Number(document.getElementById(idPoints).value);
            const caracteristique = document.getElementById(idCaracteristique);

            caracteristique.value = Number(caracteristique.value) + points;

            // Déclencher les recalculs associés
            caracteristique.dispatchEvent(new Event("input", { bubbles: true }));

        });

        // Enregistrer le résultat du dé
        const historique = JSON.parse(historiqueDesVie.value || "[]");
        historique.push(resultatDeVie);
        historiqueDesVie.value = JSON.stringify(historique);

        // Augmenter le niveau
        niveau.value = nouveauNiveau;

        // Recalculer le nombre maximum de dés de vie
        desMax.value = nouveauNiveau;

        // Recalculer les PV maximums
        document.dispatchEvent(new Event("montee-niveau-validee"));

        // Limiter les dés de vie actuels au nouveau maximum
        desActuels.value = Math.min(Number(desActuels.value), nouveauNiveau);

        // Les PV actuels restent inchangés

        // Fermer la fenêtre
        document.getElementById("fenetre-montee-niveau").close();

        // Réinitialiser les étapes pour la prochaine montée de niveau
        etapeCaracteristiques.hidden = false;
        etapeDeVie.hidden = false;
        etapeValidation.hidden = true;

        // Réinitialiser les points attribués
        const champsPoints = [
            "points-force",
            "points-constitution",
            "points-dexterite",
            "points-intelligence",
            "points-sagesse",
            "points-charisme"
        ];

        champsPoints.forEach(function (id) {
            const champ = document.getElementById(id);

            champ.value = 0;
            champ.disabled = false;
        });

        document.getElementById("points-restants").textContent = "3";
        document.dispatchEvent(new Event("reinitialiser-points-montee-niveau"));

        // Réinitialiser le lancer de dé
        resultatDeVie = null;
        resultatDeVieHTML.textContent = "";
        boutonLancer.disabled = false;

    });
});

    // ==========================================
    // LANCER DES DE VIE
    // ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const titreDesVie = document.getElementById("titre-des-vie");
    const fenetreDesVie = document.getElementById("fenetre-des-vie");
    const boutonFermer = document.getElementById("fermer-fenetre-des-vie");

    const formule = document.getElementById("formule-des-vie");
    const nombreDesDisponibles = document.getElementById("nombre-des-disponibles");
    const pvActuelsAffichage = document.getElementById("pv-actuels-jet");

    const boutonLancer = document.getElementById("lancer-de-vie-recuperation");
    const resultat = document.getElementById("resultat-recuperation");
    const boutonConfirmer = document.getElementById("confirmer-recuperation");


    // Ouvrir la fenêtre avec Ctrl + clic gauche
    titreDesVie.addEventListener("click", function (event) {

        if (!event.ctrlKey) return;

        event.preventDefault();

        const espece = document.getElementById("espece").value;
        const deVie = especes[espece]?.deVie;

        if (!deVie) {
            alert("Veuillez sélectionner une espèce.");
            return;
        }

        const constitution = Number(
            document.getElementById("constitution-modificateur").value
        );

        const desDisponibles = Number(
            document.getElementById("des-actuels").value
        );

        const pvActuels = Number(
            document.getElementById("pv-actuels").value
        );

        const pvMax = Number(
            document.getElementById("pv-max").value
        );

        formule.textContent = "1d" + deVie + " + " + constitution;
        nombreDesDisponibles.textContent = desDisponibles;
        pvActuelsAffichage.textContent = pvActuels + " / " + pvMax;

        resultat.textContent = "";
        boutonConfirmer.hidden = true;
        boutonLancer.disabled = false;

        fenetreDesVie.showModal();
    });

    // Fermer la fenêtre
    boutonFermer.addEventListener("click", function () {
        fenetreDesVie.close();
    });


    let resultatDeVie = null;
    let recuperationPV = 0;

    boutonLancer.addEventListener("click", function () {

        const espece = document.getElementById("espece").value;
        const deVie = especes[espece]?.deVie;

        const constitution = Number(
            document.getElementById("constitution-modificateur").value
        );

        const pvActuels = Number(
            document.getElementById("pv-actuels").value
        );

        const pvMax = Number(
            document.getElementById("pv-max").value
        );

        // Vérifier les dés de vie disponibles
        const desDisponibles = Number(
            document.getElementById("des-actuels").value
        );

        if (desDisponibles <= 0) {
            alert("Vous ne disposez plus de dés de vie.");
            return;
        }

        // Lancer le dé racial
        const lancer = Math.floor(Math.random() * deVie) + 1;

        // Calculer les PV récupérés
        recuperationPV = Math.max(0, lancer + constitution);
        recuperationPV = Math.min(recuperationPV, pvMax - pvActuels);

        resultatDeVie = lancer;

        // Afficher le résultat
        resultat.textContent =
            "Résultat du dé : " + lancer +
            " + Constitution (" + constitution + ")" +
            "\nPV récupérables : " + recuperationPV;

        boutonLancer.disabled = true;
        boutonConfirmer.hidden = false;

    });


    boutonConfirmer.addEventListener("click", function () {

        if (resultatDeVie === null) return;

        const pvActuels = document.getElementById("pv-actuels");
        const pvMax = document.getElementById("pv-max");
        const desActuels = document.getElementById("des-actuels");

        // Ajouter les PV récupérés sans dépasser le maximum
        pvActuels.value = Math.min(
            Number(pvMax.value),
            Number(pvActuels.value) + recuperationPV
        );

        // Consommer un dé de vie
        desActuels.value = Math.max(
            0,
            Number(desActuels.value) - 1
        );

        // Actualiser les limites des dés de vie
        desActuels.dispatchEvent(
            new Event("input", { bubbles: true })
        );

        // Fermer et réinitialiser la fenêtre
        fenetreDesVie.close();

        resultatDeVie = null;
        recuperationPV = 0;

        resultat.textContent = "";
        boutonConfirmer.hidden = true;
        boutonLancer.disabled = false;

    });


});

    // ==========================================
    // MODIFICATION des POINTS DE VIE
    // ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const titrePointsVie = document.getElementById("titre-points-vie");
    const fenetrePointsVie = document.getElementById("fenetre-points-vie");
    const boutonFermer = document.getElementById("fermer-fenetre-pv");

    const pvActuels = document.getElementById("pv-actuels");
    const pvTemporaires = document.getElementById("pv-temporaires");
    const pvMax = document.getElementById("pv-max");

    const affichagePVActuels = document.getElementById("affichage-pv-actuels");
    const affichagePVTemporaires = document.getElementById("affichage-pv-temporaires");
    const affichagePVMax = document.getElementById("affichage-pv-max");

    const quantiteModification = document.getElementById("quantite-modification-pv");
    const boutonConfirmer = document.getElementById("confirmer-modification-pv");
    const resultatModification = document.getElementById("resultat-modification-pv");

    // Ouvrir la fenêtre avec Ctrl + clic gauche
    titrePointsVie.addEventListener("click", function (event) {

        if (!event.ctrlKey) return;

        event.preventDefault();

        affichagePVActuels.textContent = pvActuels.value;
        affichagePVTemporaires.textContent = pvTemporaires.value;
        affichagePVMax.textContent = pvMax.value;

        quantiteModification.value = 0;
        resultatModification.textContent = "";

        fenetrePointsVie.showModal();
    });

    // Fermer la fenêtre
    boutonFermer.addEventListener("click", function () {
        fenetrePointsVie.close();
    });


    // Confirmer les dégâts ou les soins
    boutonConfirmer.addEventListener("click", function () {

        const quantite = Number(quantiteModification.value);

        if (!Number.isFinite(quantite) || quantite < 0) {
            alert("Veuillez saisir une quantité valide.");
            return;
        }

        const typeModification = document.querySelector(
            'input[name="type-modification-pv"]:checked'
        ).value;

        let degatsTemporaires = 0;
        let degatsActuels = 0;
        let soinsRecus = 0;

        if (typeModification === "degats") {

            // Les dégâts touchent d'abord les PV temporaires
            degatsTemporaires = Math.min(
                quantite,
                Number(pvTemporaires.value)
            );

            pvTemporaires.value =
                Number(pvTemporaires.value) - degatsTemporaires;

            // Le reste est retiré des PV actuels
            const degatsRestants = quantite - degatsTemporaires;

            degatsActuels = Math.min(
                degatsRestants,
                Number(pvActuels.value)
            );

            pvActuels.value =
                Number(pvActuels.value) - degatsActuels;

        } else {

            // Les soins restaurent les PV actuels sans dépasser le maximum
            soinsRecus = Math.min(
                quantite,
                Number(pvMax.value) - Number(pvActuels.value)
            );

            pvActuels.value =
                Number(pvActuels.value) + soinsRecus;
        }

        // Actualiser les valeurs affichées
        affichagePVActuels.textContent = pvActuels.value;
        affichagePVTemporaires.textContent = pvTemporaires.value;

        if (typeModification === "degats") {
            resultatModification.textContent =
                "Dégâts appliqués : " + quantite +
                "\nPV temporaires perdus : " + degatsTemporaires +
                "\nPV actuels perdus : " + degatsActuels;
        } else {
            resultatModification.textContent =
                "Soins appliqués : " + soinsRecus + " PV";
        }

        // Actualiser les événements associés aux champs
        pvActuels.dispatchEvent(new Event("input", { bubbles: true }));
        pvTemporaires.dispatchEvent(new Event("input", { bubbles: true }));

        // Fermer la fenêtre
        fenetrePointsVie.close();

    });

});

    // ==========================================
    // INITIATIVE
    // ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const bonusCombat = document.getElementById("bonus-combat");
    const initiative = document.getElementById("initiative");
    
    const bonusIncantation = document.getElementById("bonus-incantation");

    function calculerInitiative() {

        const bc = Number(bonusCombat.value);
        const bi = Number(bonusIncantation.value);

        initiative.value = Math.max(bc, bi);
    }

    bonusCombat.addEventListener("input", calculerInitiative);
    bonusIncantation.addEventListener("input", calculerInitiative);

    calculerInitiative();

});