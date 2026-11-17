
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



document.addEventListener("DOMContentLoaded", function () {

    const boutonAjouter = document.getElementById("ajouter-technique");
    const listeTechniques = document.getElementById("liste-techniques");
    const modeleTechnique = document.getElementById("modele-technique");

    // Ajouter une nouvelle ligne vide
    function ajouterTechnique() {
        const nouvelleLigne = modeleTechnique.content.cloneNode(true);
        listeTechniques.appendChild(nouvelleLigne);
    }

    // Créer une première ligne au chargement
    for (let i = 0; i < 10; i++) {
    ajouterTechnique();
}

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

    // Ajouter une nouvelle ligne vide
    function ajouterSort() {
        const nouveauSort = modeleSort.content.cloneNode(true);
        listeSorts.appendChild(nouveauSort);
    }

    // Créer un premier sort au chargement
    for (let i = 0; i < 10; i++) {
        ajouterSort();
    }

    // Ajouter une ligne à chaque clic
    boutonAjouterSort.addEventListener("click", ajouterSort);

    // Supprimer uniquement le sort sélectionné
    listeSorts.addEventListener("click", function (event) {
        const bouton = event.target.closest(".supprimer-sort");

        if (bouton) {
            bouton.closest("tr").remove();
        }
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
        ).filter(champ => !champ.closest("tbody"));
    }

    // Sauvegarder les données du personnage dans un fichier JSON
    boutonSauvegarder.addEventListener("click", async function () {

        const donnees = {
            version: 2,
            champsFixes: obtenirChampsFixes().map(lireChamp),
            tableaux: {},
            portrait: null
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
                ![1, 2].includes(donnees.version) ||
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
