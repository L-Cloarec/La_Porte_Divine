/* =====================================================
   VARIABLES DU SYSTÈME DES SORTS
===================================================== */

let sortEnCoursEdition = null;
let modeReorganisationSorts = false;
let depotSortDansZoneSuppression = false;



/* =====================================================
   MODÈLE DE STRUCTURE D'UN SORT
===================================================== */

/*

const modeleSort = {

    id: null,

    nom: "",
    type: "",
    mana: "",
    portee: 0,

    tempsIncantation: "",
    duree: "",

    tailleZoneEffet: null,
    formeZoneEffet: null,

    verbale: false,
    somatique: false,
    materielle: false,
    composant: "",

    hitDC: [

        {
            mode: "",
            caracteristique: "",
            bonus: 0,
            surplus: 0,
            total: 0,

            degatsSoins: [

                {
                    des: {
                        nombre: 0,
                        faces: 0
                    },

                    caracteristique: {
                        nom: "",
                        bonus: 0
                    },

                    type: "",

                    effet: {
                        seuil: 0,
                        formule: "",
                        des: {
                            nombre: 1,
                            faces: 4
                        }
                    }
                }

            ]
        }

    ],

    description: ""

};

*/

// Liste des sorts du personnage
const sorts = [

    {
        id: 1,
        nom: "Projectile magique",
        type: "Sort",
        mana: "3",
        portee: 36,

        tempsIncantation: "Action",
        duree: "Instantanée",

        tailleZoneEffet: null,
        formeZoneEffet: null,

        verbale: true,
        somatique: true,
        materielle: false,
        composant: "",

        hitDC: [
            {
                mode: "Attaque",
                caracteristique: "INT",
                bonus: 0,
                surplus: 0,
                total: 0,

                degatsSoins: [
                    {
                        des: {
                            nombre: 3,
                            faces: 4
                        },

                        caracteristique: {
                            nom: "INT",
                            bonus: 0
                        },

                        type: "Force",

                        effet: {
                            seuil: 0,
                            formule: "",
                            des: {
                                nombre: 1,
                                faces: 100
                            }
                        }
                    }
                ]
            }
        ],

        description: "Trois projectiles magiques frappent leurs cibles."
    }

];

/* =====================================================
   FONCTIONS UTILITAIRES
===================================================== */

// Générer un nouvel identifiant de sort
function genererIdSorts() {
    return sorts.length > 0
        ? Math.max(...sorts.map(sort => sort.id)) + 1
        : 1;
}



function initialiserSorts() {

    const tbody = document.querySelector(".tableau-corps-sorts tbody");
    const modele = document.querySelector("#modele-ligne-sorts");

    if (!tbody || !modele) {
        console.error("Tableau ou modèle des sorts introuvable.");
        return;
    }

    // Initialiser le bouton d'ajout Hit/DC
    const boutonAjouterHitDC = document.querySelector("#bouton-ajouter-hit-dc-sorts");

    if (boutonAjouterHitDC) {
        boutonAjouterHitDC.addEventListener("click", () => {
            ajouterBlocHitDCSort();
        });
    }

    // Initialiser le bouton de création d'un sort
    const boutonAjoutSort = document.querySelector(".bouton-ajout-sorts");

    if (boutonAjoutSort) {
        boutonAjoutSort.addEventListener("click", ouvrirCreationSort);
    }


    // Initialiser l'enregistrement d'un sort
    const formulaire = document.querySelector("#formulaire-sorts");

    if (formulaire) {
        formulaire.addEventListener("submit", (event) => {
            event.preventDefault();
            enregistrerSort();
        });
    }

    // Initialiser les boutons V, S et M
    const boutonsComposants = [
        "#bouton-verbale-sorts",
        "#bouton-somatique-sorts",
        "#bouton-materiel-sorts"
    ];

    boutonsComposants.forEach(selecteur => {

        const bouton = document.querySelector(selecteur);

        if (bouton) {
            bouton.addEventListener("click", () => {
                bouton.classList.toggle("actif");
            });
        }

    });

    // Initialiser le bouton Annuler
    const boutonAnnuler = document.querySelector("#bouton-annuler-sorts");

    if (boutonAnnuler) {
        boutonAnnuler.addEventListener("click", () => {
            document.querySelector("#fenetre-sorts").close();
        });
    }

    // Initialiser le bouton de réorganisation des sorts
    const boutonOrdreSorts = document.querySelector(".bouton-ordre-sorts");


    if (boutonOrdreSorts) {
        boutonOrdreSorts.addEventListener("click", () => {

            const activer = changerModeReorganisation("sorts", () => {

                modeReorganisationSorts = false;

                document.querySelector(".conteneur-lignes-sorts")
                    .classList.remove("mode-reorganisation");

                document.querySelector(".conteneur-sorts")
                    .classList.remove("mode-reorganisation");

                document.querySelector(".bloc-sorts")
                    .classList.remove("mode-reorganisation");

                document.querySelectorAll(".ligne-sorts")
                    .forEach(ligne => {
                        ligne.draggable = false;
                    });

                boutonOrdreSorts.classList.remove("actif");

            });

            modeReorganisationSorts = activer;

            document.querySelector(".conteneur-lignes-sorts")
                .classList.toggle("mode-reorganisation", activer);

            document.querySelector(".conteneur-sorts")
                .classList.toggle("mode-reorganisation", activer);

            document.querySelector(".bloc-sorts")
                .classList.toggle("mode-reorganisation", activer);

            document.querySelectorAll(".ligne-sorts")
                .forEach(ligne => {
                    ligne.draggable = activer;
                });

            boutonOrdreSorts.classList.toggle("actif", activer);

        });
    }


    afficherSorts();

    console.log("Initialisation du tableau des sorts réussie.");

    // Gérer les zones de suppression des sorts
    document.querySelectorAll(".bloc-sorts > .zone-suppression").forEach(zone => {

        zone.addEventListener("dragenter", event => {

            if (!modeReorganisationSorts) return;

            event.preventDefault();
            zone.classList.add("zone-suppression-active");

        });

        zone.addEventListener("dragover", event => {

            if (!modeReorganisationSorts) return;

            event.preventDefault();

        });

        zone.addEventListener("dragleave", event => {

            if (!modeReorganisationSorts) return;

            if (!zone.contains(event.relatedTarget)) {
                zone.classList.remove("zone-suppression-active");
            }

        });

        zone.addEventListener("drop", event => {

            if (!modeReorganisationSorts) return;

            event.preventDefault();

            depotSortDansZoneSuppression = true;

            zone.classList.remove("zone-suppression-active");

        });

    });

}











// Générer le texte des dégâts ou des soins d'un sort
function obtenirTexteDegatsSort(degats) {

    const nombreDes = Number(degats.des.nombre);

    // Aucun dé de dégâts
    if (nombreDes === 0) {
        return "-";
    }

    const facesDes = degats.des.faces;

    // Récupérer le modificateur actuel
    const nomCaracteristique = degats.caracteristique?.nom;

    const bonus = nomCaracteristique
        ? recupererModificateurCaracteristique(nomCaracteristique)
        : 0;

    return `${nombreDes}d${facesDes}${bonus > 0 ? " + " + bonus : bonus < 0 ? " - " + Math.abs(bonus) : ""}`;
}









function calculerTotalHitDCSort(hit) {

    const caracteristique = hit.caracteristique;

    // Modificateur de la caractéristique
    const modificateur = recupererModificateurCaracteristique(
        caracteristique
    );

    // Bonus associé à la caractéristique
    let bonusAssocie = 0;

    if (["FOR", "DEX"].includes(caracteristique)) {

        bonusAssocie = Number(
            document.querySelector(".champ-bonus-combat")?.value
        ) || 0;

    } else if (["INT", "SAG", "CHA"].includes(caracteristique)) {

        bonusAssocie = Number(
            document.querySelector(".champ-bonus-incantation")?.value
        ) || 0;

    }

    // Surplus éventuel
    const surplus = Number(hit.surplus) || 0;

    // Base du calcul
    const base = hit.mode === "Jet de sauvegarde" ? 8 : 0;

    return base + modificateur + bonusAssocie + surplus;
}





function afficherSorts() {

    const tbody = document.querySelector(".tableau-corps-sorts tbody");
    const modele = document.querySelector("#modele-ligne-sorts");

    if (!tbody || !modele) return;

    tbody.innerHTML = "";

    sorts.forEach(sort => {

        // Cloner le modèle HTML
        const ligne = modele.content.cloneNode(true);

        // Associer l'identifiant du sort à sa ligne
        const ligneAjoutee = ligne.querySelector(".ligne-sorts");

        if (ligneAjoutee) {
            ligneAjoutee.dataset.id = sort.id;
            ligneAjoutee.draggable = modeReorganisationSorts;
        }
    
        // Gérer le déplacement des lignes
        ligneAjoutee.addEventListener("dragover", (event) => {

            if (!modeReorganisationSorts) return;

            event.preventDefault();

            const ligneEnCours = tbody.querySelector(".ligne-en-deplacement");

            if (!ligneEnCours || ligneEnCours === ligneAjoutee) return;

            const rectangle = ligneAjoutee.getBoundingClientRect();
            const milieu = rectangle.top + rectangle.height / 2;

            if (event.clientY < milieu) {
                tbody.insertBefore(ligneEnCours, ligneAjoutee);
            } else {
                tbody.insertBefore(ligneEnCours, ligneAjoutee.nextSibling);
            }

        });

        // Préparer le glisser-déposer
        ligneAjoutee.addEventListener("dragstart", (event) => {

            if (!modeReorganisationSorts) {
                event.preventDefault();
                return;
            }

            depotSortDansZoneSuppression = false;

            ligneAjoutee.classList.add("ligne-en-deplacement");

            // Créer une image totalement transparente
            const imageInvisible = new Image();
            imageInvisible.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

            event.dataTransfer.setDragImage(imageInvisible, 0, 0);

            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", sort.id);

        });

        ligneAjoutee.addEventListener("dragend", () => {

            ligneAjoutee.classList.remove("ligne-en-deplacement");

            // Si le sort est déposé dans une zone de suppression
            if (depotSortDansZoneSuppression) {

                const confirmation = confirm(
                    `Voulez-vous vraiment supprimer le sort "${sort.nom}" ?`
                );

                if (confirmation) {
                    const index = sorts.findIndex(s => s.id === sort.id);

                    if (index !== -1) {
                        sorts.splice(index, 1);
                    }
                }

                afficherSorts();
                return;
            }

            // Récupérer l'ordre actuel des lignes HTML
            const ordreSorts = Array.from(tbody.querySelectorAll(".ligne-sorts"))
                .map(ligne => ligne.dataset.id);

            // Réorganiser le tableau JavaScript selon cet ordre
            sorts.sort((a, b) => {
                return ordreSorts.indexOf(String(a.id))
                    - ordreSorts.indexOf(String(b.id));
            });

        });

        // Préparer le bouton de modification
        const boutonEdition = ligne.querySelector(".bouton-edition-sorts");

        if (boutonEdition) {
            boutonEdition.addEventListener("click", () => {

                const sortSelectionne = sorts.find(s => s.id === sort.id);

                if (sortSelectionne) {
                    ouvrirModificationSort(sortSelectionne);
                }

            });
        }

        // Récupérer les cellules
        const celluleNom = ligne.querySelector(".nom-sorts");
        const celluleType = ligne.querySelector(".type-sorts");
        const celluleMana = ligne.querySelector(".cellule-mana");
        const cellulePortee = ligne.querySelector(".cellule-portee");
        const celluleHitDC = ligne.querySelector(".cellule-hit-dc");
        const celluleDegatsSoins = ligne.querySelector(".cellule-degats-soins");
        const celluleJetStatut = ligne.querySelector(".cellule-jet-statut");

        // Remplir les informations générales
        celluleNom.textContent = sort.nom;
        celluleType.textContent = sort.type;
        celluleMana.textContent = sort.mana;
        cellulePortee.textContent =
            sort.portee === -1 ? "P." :
            sort.portee === 0 ? "Contact" :
            sort.portee === -2 ? "À vue" :
            sort.portee === -3 ? "Illimité" :
            `${String(sort.portee).replace(".", ",")} m`;

        // Afficher les blocs Hit/DC
        sort.hitDC.forEach(hit => {

            const element = document.createElement("div");
            element.classList.add("element-hit-dc");

            const bloc = document.createElement("button");
            bloc.type = "button";
            bloc.classList.add("bouton-hit-dc-sorts");

            const resultat = document.createElement("span");

            const total = calculerTotalHitDCSort(hit);

            if (hit.mode === "Attaque") {

                resultat.textContent = `${total >= 0 ? "+" : ""}${total}`;

            } else {

                resultat.textContent = `${hit.caracteristique} ${total}`;

            }

            bloc.appendChild(resultat);
            element.appendChild(bloc);
            celluleHitDC.appendChild(element);

        });
            
        // Afficher les dégâts et soins
        sort.hitDC.forEach(hit => {

            hit.degatsSoins.forEach(degats => {

                const bloc = document.createElement("button");
                bloc.type = "button";
                bloc.classList.add("bouton-degats-soins-sorts");

                // Ajouter les paramètres du lancer
                bloc.dataset.nombreDes = degats.des.nombre;
                bloc.dataset.facesDes = degats.des.faces;
                bloc.dataset.caracteristique =
                    degats.caracteristique?.nom || "";

                const formule = document.createElement("span");

                formule.textContent = obtenirTexteDegatsSort(degats);

                bloc.appendChild(formule);
                celluleDegatsSoins.appendChild(bloc);

            });

        });

        // Afficher les effets de statut
        sort.hitDC.forEach(hit => {

            hit.degatsSoins.forEach(degats => {

                // Aucun dégât : aucun statut
                if (obtenirTexteDegatsSort(degats) === "-") {

                    const aucunStatut = document.createElement("div");
                    aucunStatut.classList.add("element-statut-sorts");
                    aucunStatut.textContent = "-";

                    celluleJetStatut.appendChild(aucunStatut);
                    return;
                }

                if (!degats.effet) return;

                const bloc = document.createElement("button");
                bloc.type = "button";
                bloc.classList.add("bouton-effet-statut-sorts");

                const icone = document.createElement("img");
                icone.src = obtenirIconeStatut(degats.type);
                icone.classList.add("icone-statut");
                icone.alt = degats.type;

                const seuil = document.createElement("span");
                const seuilActuel = calculerSeuilDegats(
                    degats.type,
                    hit.caracteristique
                );

                seuil.textContent = `≤ ${seuilActuel}`;

                bloc.appendChild(icone);
                bloc.appendChild(seuil);

                celluleJetStatut.appendChild(bloc);

            });

        });

        // Ajouter la ligne au tableau
        tbody.appendChild(ligne);

    });

}



function ajouterBlocHitDCSort(hit = null) {

    const conteneur = document.querySelector("#conteneur-hit-dc-sorts");
    const modele = document.querySelector("#modele-hit-dc-sorts");

    if (!conteneur || !modele) {
        console.error("Conteneur ou modèle Hit/DC des sorts introuvable.");
        return;
    }

    const bloc = modele.content.firstElementChild.cloneNode(true);

    conteneur.appendChild(bloc);

    const champMode = bloc.querySelector(".mode-hit-dc");
    const selectCaracteristique = bloc.querySelector(".caracteristique-hit-dc");

    const champBonus = bloc.querySelector(".bonus-hit-dc");
    const champSurplus = bloc.querySelector(".surplus-hit-dc");

    const selectTypeSort = document.querySelector("#type-sorts");

    // Déterminer automatiquement le mode
    function actualiserMode() {

        const typeSort = selectTypeSort.value;

        champMode.value = typeSort === "Jet de sauvegarde"
            ? "Jet de sauvegarde"
            : "Attaque";
    }

    // Préremplir les informations existantes
    actualiserMode();

    // Actualiser les options avec les modificateurs
    function actualiserOptionsCaracteristiques() {

        const caracteristiques = [
            "FOR", "DEX", "CON", "INT", "SAG", "CHA"
        ];

        const valeurActuelle = selectCaracteristique.value;

        selectCaracteristique.innerHTML = caracteristiques.map(caracteristique => {

            const modificateur = recupererModificateurCaracteristique(caracteristique);
            const signe = modificateur >= 0 ? "+" : "";

            return `
                <option value="${caracteristique}">
                    ${caracteristique} (${signe}${modificateur})
                </option>
            `;

        }).join("");

        selectCaracteristique.value = valeurActuelle || "INT";
    }

    // Préremplir la caractéristique
    selectCaracteristique.value = hit?.caracteristique || "INT";

    // Générer les options
    actualiserOptionsCaracteristiques();

    const champTotal = bloc.querySelector(".total-hit-dc");

    function actualiserTotal() {

        const modificateur = recupererModificateurCaracteristique(
            selectCaracteristique.value
        );

        let bonusAssocie = 0;

        if (["FOR", "DEX"].includes(selectCaracteristique.value)) {

            bonusAssocie = Number(
                document.querySelector(".champ-bonus-combat")?.value
            ) || 0;

        } else if (["INT", "SAG", "CHA"].includes(selectCaracteristique.value)) {

            bonusAssocie = Number(
                document.querySelector(".champ-bonus-incantation")?.value
            ) || 0;

        }

        champBonus.value = bonusAssocie;

        const surplus = Number(champSurplus.value) || 0;

        const base = champMode.value === "Jet de sauvegarde" ? 8 : 0;

        const total = base + modificateur + bonusAssocie + surplus;

        champTotal.textContent =
            `${total >= 0 ? "+" : ""}${total}`;
    }

    // Préremplir les bonus
    champSurplus.value = hit?.surplus ?? 0;

    // Actualisation initiale
    actualiserTotal();

    // Actualisation lors d'un changement de valeur
    selectCaracteristique.addEventListener("change", actualiserTotal);
    champBonus.addEventListener("input", actualiserTotal);
    champSurplus.addEventListener("input", actualiserTotal);

    document.querySelector(".champ-bonus-combat")
        ?.addEventListener("input", actualiserTotal);

    document.querySelector(".champ-bonus-incantation")
        ?.addEventListener("input", actualiserTotal);

    // Actualiser le mode si le type de sort change
    selectTypeSort.addEventListener("change", () => {
        actualiserMode();
        actualiserTotal();
    });

    // Reconstituer les lignes de dégâts / soins
    if (hit && hit.degatsSoins) {
        hit.degatsSoins.forEach(degats => {
            ajouterBlocDegatsSoinsSort(bloc, degats);
        });
    } else {
        ajouterBlocDegatsSoinsSort(bloc);
    }

    // Supprimer le bloc
    bloc.querySelector(".bouton-supprimer-hit-dc")
        .addEventListener("click", () => {
            bloc.remove();
        });

    // Ajouter une ligne de dégâts / soins
    bloc.querySelector(".bouton-ajouter-degat")
        .addEventListener("click", () => {
            ajouterBlocDegatsSoinsSort(bloc);
        });

    return bloc;
}



function ajouterBlocDegatsSoinsSort(blocHitDC, degats = null) {

    const conteneur = blocHitDC.querySelector(".conteneur-degats-soins");
    const modele = document.querySelector("#modele-degats-soins-sorts");

    if (!conteneur || !modele) {
        console.error("Conteneur dégâts/soins ou modèle des sorts introuvable.");
        return;
    }

    // Cloner le modèle HTML
    const bloc = modele.content.firstElementChild.cloneNode(true);

    conteneur.appendChild(bloc);

    // Actualiser les options avec les modificateurs
    const selectCaracteristique = bloc.querySelector(".caracteristique-degats");

    function actualiserOptionsCaracteristiques() {

        const caracteristiques = ["FOR", "DEX", "CON", "INT", "SAG", "CHA"];
        const valeurActuelle = selectCaracteristique.value;

        selectCaracteristique.innerHTML = caracteristiques.map(caracteristique => {

            const modificateur = recupererModificateurCaracteristique(caracteristique);
            const signe = modificateur >= 0 ? "+" : "";

            return `
                <option value="${caracteristique}">
                    ${caracteristique} (${signe}${modificateur})
                </option>
            `;

        }).join("");

        selectCaracteristique.value = valeurActuelle || "INT";
    }

    actualiserOptionsCaracteristiques();

    // Préremplir les informations existantes
    if (degats) {

        bloc.querySelector(".nombre-des-degats").value =
            degats.des?.nombre ?? 1;

        bloc.querySelector(".faces-des-degats").value =
            degats.des?.faces ?? 8;

        selectCaracteristique.value =
            degats.caracteristique?.nom || "INT";

        bloc.querySelector(".type-degats").value =
            degats.type || "Tranchant";
    }

    // Actualiser l'icône du type de dégâts
    const selectTypeDegats = bloc.querySelector(".type-degats");
    const iconeTypeDegat = bloc.querySelector(".icone-type-degat");

    function actualiserIconeTypeDegat() {

        const type = selectTypeDegats.value;

        iconeTypeDegat.src = obtenirIconeStatut(type);
        iconeTypeDegat.alt = type;
    }

    actualiserIconeTypeDegat();

    selectTypeDegats.addEventListener("change", actualiserIconeTypeDegat);

    // Actualiser le seuil
    const affichageSeuil = bloc.querySelector(".valeur-seuil");

    const selectCaracteristiqueHitDC =
        blocHitDC.querySelector(".caracteristique-hit-dc");

    function actualiserSeuil() {

        const typeDegats = selectTypeDegats.value;
        const caracteristique = selectCaracteristiqueHitDC.value;

        const seuil = calculerSeuilDegatsSorts(
            typeDegats,
            caracteristique
        );

        affichageSeuil.textContent = `≤ ${seuil}`;
    }

    // Calcul initial
    actualiserSeuil();

    // Actualiser lorsque les valeurs changent
    selectTypeDegats.addEventListener("change", actualiserSeuil);
    selectCaracteristiqueHitDC.addEventListener("change", actualiserSeuil);

    document.querySelector(".champ-bonus-combat")
        ?.addEventListener("input", actualiserSeuil);

    document.querySelector(".champ-bonus-incantation")
        ?.addEventListener("input", actualiserSeuil);

    // Actualiser la numérotation
    function actualiserNumerotation() {

        conteneur.querySelectorAll(".bloc-degat-soin")
            .forEach((ligne, index) => {

                ligne.querySelector(".titre-degat").textContent =
                    `Dgts ${index + 1} :`;

            });
    }

    actualiserNumerotation();

    // Supprimer la ligne
    bloc.querySelector(".bouton-supprimer-degat")
        .addEventListener("click", () => {

            bloc.remove();

            actualiserNumerotation();
        });

    return bloc;
}



function calculerSeuilDegatsSorts(typeDegats, caracteristique) {

    const seuilsDeBase = {
        "Tranchant": 30,
        "Contondant": 20,
        "Perforant": 25,
        "Radiant": 15,
        "Nécrotique": 20,
        "Froid": 35,
        "Feu": 20,
        "Foudre": 10,
        "Tonnerre": 20,
        "Poison": 10,
        "Acide": 10,
        "Force": 15,
        "Psychique": 5,
        "Soin": 0
    };

    let bonus = 0;

    if (["FOR", "DEX"].includes(caracteristique)) {

        bonus = Number(
            document.querySelector(".champ-bonus-combat")?.value
        ) || 0;

    } else if (["INT", "SAG", "CHA"].includes(caracteristique)) {

        bonus = Number(
            document.querySelector(".champ-bonus-incantation")?.value
        ) || 0;

    }

    const seuilBase = seuilsDeBase[typeDegats] ?? 0;

    return seuilBase + (5 * bonus);
}


function recupererDonneesSort() {

    const sort = {

        nom: document.querySelector("#nom-sorts").value.trim(),

        type: document.querySelector("#type-sorts").value,

        mana: document.querySelector("#mana-sorts").value.trim(),

        portee: Number(document.querySelector("#portee-sorts").value) || 0,

        tempsIncantation:
            document.querySelector("#temps-incantation-sorts").value,

        duree:
            document.querySelector("#duree-sorts").value,

        tailleZoneEffet:
            Number(document.querySelector("#taille-zone-effet-sorts").value) || null,

        formeZoneEffet:
            document.querySelector("#forme-zone-effet-sorts").value || null,

        verbale:
            document.querySelector("#bouton-verbale-sorts").classList.contains("actif"),

        somatique:
            document.querySelector("#bouton-somatique-sorts").classList.contains("actif"),

        materielle:
            document.querySelector("#bouton-materiel-sorts").classList.contains("actif"),

        composant:
            document.querySelector("#composant-sorts").value.trim(),

        description:
            document.querySelector("#description-sorts").value,

        hitDC: []
    };

    // Récupérer les blocs Hit / DC
    document.querySelectorAll("#conteneur-hit-dc-sorts .bloc-hit-dc")
        .forEach(bloc => {

            const hit = {

                mode: bloc.querySelector(".mode-hit-dc").value,

                caracteristique:
                    bloc.querySelector(".caracteristique-hit-dc").value,

                bonus: Number(bloc.querySelector(".bonus-hit-dc").value) || 0,

                surplus: Number(bloc.querySelector(".surplus-hit-dc").value) || 0,

                degatsSoins: []
            };

            hit.total = calculerTotalHitDCSort(hit);

            // Récupérer les lignes de dégâts / soins
            bloc.querySelectorAll(".bloc-degat-soin")
                .forEach(ligne => {

                    const nomCaracteristique =
                        ligne.querySelector(".caracteristique-degats").value;

                    const texteSeuil =
                        ligne.querySelector(".valeur-seuil").textContent;

                    const degats = {

                        des: {
                            nombre: Number(
                                ligne.querySelector(".nombre-des-degats").value
                            ) || 0,

                            faces: Number(
                                ligne.querySelector(".faces-des-degats").value
                            ) || 8
                        },

                        caracteristique: {
                            nom: nomCaracteristique,

                            bonus: recupererModificateurCaracteristique(
                                nomCaracteristique
                            )
                        },

                        type: ligne.querySelector(".type-degats").value,

                        effet: {
                            seuil: Number(
                                texteSeuil.replace(/[^\d-]/g, "")
                            ) || 0,

                            formule: "",

                            des: {
                                nombre: 1,
                                faces: 4
                            }
                        }
                    };

                    hit.degatsSoins.push(degats);

                });

            sort.hitDC.push(hit);

        });

    return sort;
}


function enregistrerSort() {

    const donnees = recupererDonneesSort();

    if (sortEnCoursEdition) {

        Object.assign(sortEnCoursEdition, donnees);

    } else {

        donnees.id = genererIdSorts();

        sorts.push(donnees);
    }

    afficherSorts();

    document.querySelector("#fenetre-sorts").close();
}



function ouvrirCreationSort() {

    const fenetre = document.querySelector("#fenetre-sorts");
    const formulaire = document.querySelector("#formulaire-sorts");
    const titre = document.querySelector("#titre-fenetre-sorts");

    formulaire.reset();

    // Réinitialiser le mode d'édition
    sortEnCoursEdition = null;

    titre.textContent = "Nouveau sort";

    // Vider les blocs Hit / DC
    document.querySelector("#conteneur-hit-dc-sorts").innerHTML = "";

    // Réinitialiser les composants V, S et M
    document.querySelector("#bouton-verbale-sorts").classList.remove("actif");
    document.querySelector("#bouton-somatique-sorts").classList.remove("actif");
    document.querySelector("#bouton-materiel-sorts").classList.remove("actif");

    fenetre.showModal();
}


function ouvrirModificationSort(sort) {

    const fenetre = document.querySelector("#fenetre-sorts");
    const formulaire = document.querySelector("#formulaire-sorts");

    formulaire.reset();

    // Enregistrer le sort en cours de modification
    sortEnCoursEdition = sort;

    document.querySelector("#titre-fenetre-sorts").textContent =
        "Modifier un sort";

    // Informations générales
    document.querySelector("#nom-sorts").value = sort.nom || "";
    document.querySelector("#type-sorts").value = sort.type || "";
    document.querySelector("#portee-sorts").value = sort.portee ?? "";
    document.querySelector("#mana-sorts").value = sort.mana ?? "";

    document.querySelector("#temps-incantation-sorts").value =
        sort.tempsIncantation || "";

    document.querySelector("#duree-sorts").value = sort.duree || "";

    document.querySelector("#taille-zone-effet-sorts").value =
        sort.tailleZoneEffet ?? "";

    document.querySelector("#forme-zone-effet-sorts").value =
        sort.formeZoneEffet || "";

    document.querySelector("#description-sorts").value =
        sort.description || "";

    // Composants V, S et M
    document.querySelector("#bouton-verbale-sorts")
        .classList.toggle("actif", !!sort.verbale);

    document.querySelector("#bouton-somatique-sorts")
        .classList.toggle("actif", !!sort.somatique);

    document.querySelector("#bouton-materiel-sorts")
        .classList.toggle("actif", !!sort.materielle);

    document.querySelector("#composant-sorts").value =
        sort.composant || "";

    // Blocs Hit / DC
    const conteneur = document.querySelector("#conteneur-hit-dc-sorts");

    conteneur.innerHTML = "";

    if (sort.hitDC) {
        sort.hitDC.forEach(hit => {
            ajouterBlocHitDCSort(hit);
        });
    }

    fenetre.showModal();
}





if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initialiserSorts();
    });
} else {
    initialiserSorts();
}