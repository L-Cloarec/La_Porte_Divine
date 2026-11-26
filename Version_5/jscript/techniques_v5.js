/* =====================================================
   VARIABLES DU SYSTÈME DES TECHNIQUES
===================================================== */

let modeReorganisationTechniques = false;
let techniqueEnCoursEdition = null;
let depotDansZoneSuppression = false;




/* =====================================================
   MODÈLE DE STRUCTURE D'UNE TECHNIQUE
===================================================== */

/*

const techniques = [

    {
        id: 1,
        nom: "Frappe perforante",
        type: "Attaque de mêlée",
        portee: 1.5,
        tempsIncantation: "1 action",
        duree: "Instantanée",
        tailleZoneEffet: null,
        formeZoneEffet: null,

        hitDC: [
            {
                mode: "Attaque",
                caracteristique: "FOR",

                degatsSoins: [
                    {
                        des: {
                            nombre: 1,
                            faces: 8
                        },

                        caracteristique: {
                            nom: "FOR",
                            bonus: 0
                        },

                        type: "Perforant",

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

        description: "Une attaque perforante portée avec force."
    }

];

*/

// Liste des techniques du personnage
const techniques = [];

/* =====================================================
   FONCTIONS UTILITAIRES
===================================================== */

// Générer un nouvel identifiant de technique
function genererIdTechnique() {
    return techniques.length > 0
        ? Math.max(...techniques.map(technique => technique.id)) + 1
        : 1;
}

// Associer une image SVG à chaque type de dégâts
function obtenirIconeStatut(type) {
    const icones = {
        "Tranchant": "tranchant.svg",
        "Contondant": "contondant.svg",
        "Perforant": "perforant.svg",
        "Radiant": "radiant.svg",
        "Nécrotique": "necrotique.svg",
        "Froid": "froid.svg",
        "Feu": "feu.svg",
        "Foudre": "foudre.svg",
        "Tonnerre": "tonnerre.svg",
        "Poison": "poison.svg",
        "Acide": "acide.svg",
        "Force": "force.svg",
        "Psychique": "psychique.svg",
        "Soin": "soin.svg"
    };

    return `image_type_coup/${icones[type] || "tranchant.svg"}`;
}

// Générer le texte des dégâts ou des soins
function obtenirTexteDegats(degats) {

    const nombreDes = degats.des.nombre;

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


// Générer le texte de l'effet de statut
function obtenirTexteEffet(effet) {
    return `≤ ${effet.seuil}`;
}


// Générer les lignes du tableau
function afficherTechniques() {
    const tbody = document.querySelector(".tableau-corps-techniques tbody");
    const modele = document.querySelector("#modele-ligne-technique");

    if (!tbody) return;
    if (!modele) return;

    tbody.innerHTML = "";

    // Créer un emplacement fantôme unique
    const emplacementFantome = document.createElement("tr");
    emplacementFantome.classList.add("ligne-emplacement-fantome");
    emplacementFantome.innerHTML = `
        <td colspan="6"></td>
    `;

    techniques.forEach(technique => {

        const celluleHitDC = technique.hitDC.map(hit => {

            const total = calculerTotalHitDC(hit);

            const texte = hit.mode === "Attaque"
                ? `${total >= 0 ? "+" : ""}${total}`
                : `${hit.caracteristique} ${total}`;

            return `
                <div class="groupe-hit-dc-techniques">
                    <div class="element-hit-dc">
                        <button type="button" class="bouton-hit-dc">
                            ${texte}
                        </button>
                    </div>
                </div>
            `;

        }).join("");

        const celluleDegats = technique.hitDC.map(hit => `
            <div class="groupe-degats-soins-techniques">
                ${hit.degatsSoins.map(degats => `
                    <div class="element-degat">
                        <button
                            type="button"
                            class="bouton-degats-soins"
                            data-nombre-des="${degats.des.nombre}"
                            data-faces-des="${degats.des.faces}"
                            data-caracteristique="${degats.caracteristique?.nom || ""}"
                            data-type-degats="${degats.type}"
                        >
                            ${obtenirTexteDegats(degats)}
                        </button>
                    </div>
                `).join("")}
            </div>
        `).join("");

        const celluleStatut = technique.hitDC.map(hit => `
            <div class="groupe-statut-techniques">
                ${hit.degatsSoins.map(degats => {

                    // Aucun dégât : aucun statut
                    if (obtenirTexteDegats(degats) === "-") {
                        return `
                            <div class="element-statut">
                                -
                            </div>
                        `;
                    }

                    return `
                        <div class="element-statut">
                            <img
                                class="icone-statut"
                                src="${obtenirIconeStatut(degats.type)}"
                                alt="${degats.type}"
                            >
                            <button
                                type="button"
                                class="bouton-statut"
                                data-type-degats="${degats.type}"
                            >
                                ≤ ${calculerSeuilDegats(degats.type, hit.caracteristique)}
                            </button>
                        </div>
                    `;

                }).join("")}
            </div>
        `).join("");

        // Cloner le modèle HTML
        const ligne = modele.content.cloneNode(true);

        // Récupérer les cellules
        const celluleNom = ligne.querySelector(".nom-technique");
        const celluleType = ligne.querySelector(".type-technique");
        const cellulePortee = ligne.querySelector(".cellule-portee");
        const elementHitDC = ligne.querySelector(".cellule-hit-dc");
        const elementDegats = ligne.querySelector(".cellule-degats-soins");
        const elementStatut = ligne.querySelector(".cellule-jet-statut");

        // Remplir les informations générales
        celluleNom.textContent = technique.nom;
        celluleType.textContent = technique.type;
        cellulePortee.textContent =
            technique.portee === -1 ? "P." :
            technique.portee === 0 ? "Contact" :
            technique.portee === -2 ? "À vue" :
            technique.portee === -3 ? "Illimité" :
            `${String(technique.portee).replace(".", ",")} m`;

        // Remplir les autres cellules
        elementHitDC.innerHTML = celluleHitDC;
        elementDegats.innerHTML = celluleDegats;
        elementStatut.innerHTML = celluleStatut;

        // Récupérer les groupes pour synchroniser leur hauteur
        const groupesHitDC = elementHitDC.querySelectorAll(".groupe-hit-dc-techniques");
        const groupesDegats = elementDegats.querySelectorAll(".groupe-degats-soins-techniques");
        const groupesStatuts = elementStatut.querySelectorAll(".groupe-statut-techniques");


        // Ajouter la ligne au tableau
        tbody.appendChild(ligne);

    
        // Synchroniser les hauteurs des groupes correspondants
        groupesDegats.forEach((groupeDegats, index) => {

            const hauteur = groupeDegats.getBoundingClientRect().height;

            groupesHitDC[index].style.height = `${hauteur}px`;
            groupesStatuts[index].style.height = `${hauteur}px`;

        });

        const ligneAjoutee = tbody.lastElementChild;
        ligneAjoutee.dataset.id = technique.id;

        // Gérer le déplacement des lignes
        ligneAjoutee.addEventListener("dragover", (event) => {

            if (!modeReorganisationTechniques) return;

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


        ligneAjoutee.draggable = modeReorganisationTechniques;


        // Créer l'emplacement fantôme
        ligneAjoutee.addEventListener("dragstart", (event) => {

            if (!modeReorganisationTechniques) {
                event.preventDefault();
                return;
            }

            depotDansZoneSuppression = false;

            ligneAjoutee.classList.add("ligne-en-deplacement");

            // Créer une image totalement transparente
            const imageInvisible = new Image();
            imageInvisible.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

            event.dataTransfer.setDragImage(imageInvisible, 0, 0);

            // Insérer le fantôme à la position initiale
            tbody.insertBefore(emplacementFantome, ligneAjoutee.nextSibling);

            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", technique.id);

        });

        ligneAjoutee.addEventListener("dragend", (event) => {

            ligneAjoutee.classList.remove("ligne-en-deplacement");
            emplacementFantome.remove();

            const horsTableau = depotDansZoneSuppression;

            // Si la technique est déplacée hors du tableau
            if (horsTableau) {

                const confirmation = confirm(
                    `Voulez-vous vraiment supprimer la technique "${technique.nom}" ?`
                );

                if (confirmation) {
                    const index = techniques.findIndex(t => t.id === technique.id);

                    if (index !== -1) {
                        techniques.splice(index, 1);
                    }
                }

                // Réafficher le tableau dans tous les cas
                afficherTechniques();
                return;
            }

            // Récupérer l'ordre actuel des lignes HTML
            const ordreTechniques = Array.from(tbody.querySelectorAll(".ligne-technique"))
                .map(ligne => ligne.dataset.id);

            // Réorganiser le tableau JavaScript selon cet ordre
            techniques.sort((a, b) => {
                return ordreTechniques.indexOf(String(a.id))
                    - ordreTechniques.indexOf(String(b.id));
            });

        });

    });
}


/* =====================================================
   CALCUL DU TOTAL HIT / DC
===================================================== */

function calculerTotalHitDC(hit) {

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




// Ouvrir une fenêtre de création
function ouvrirCreationTechnique() {

    const fenetre = document.querySelector("#fenetre-technique");
    const formulaire = document.querySelector("#formulaire-technique");

    techniqueEnCoursEdition = null;

    formulaire.reset();

    document.querySelector("#titre-fenetre-technique").textContent =
        "Nouvelle technique";

    document.querySelector("#conteneur-hit-dc").innerHTML = "";

    ajouterBlocHitDC();

    fenetre.showModal();

    actualiserTousLesBlocsHitDC();
}


// Ouvrir une fenêtre de modification
function ouvrirModificationTechnique(technique) {

    const fenetre = document.querySelector("#fenetre-technique");

    techniqueEnCoursEdition = technique;

    document.querySelector("#titre-fenetre-technique").textContent =
        "Modifier une technique";

    document.querySelector("#nom-technique").value = technique.nom;
    document.querySelector("#type-technique").value = technique.type;
    document.querySelector("#portee-technique").value = technique.portee ?? "";
    document.querySelector("#taille-zone-effet").value = technique.tailleZoneEffet ?? "";
    document.querySelector("#forme-zone-effet").value =technique.formeZoneEffet ?? "";
    document.querySelector("#temps-incantation").value = technique.tempsIncantation ?? "";
    document.querySelector("#duree-technique").value = technique.duree ?? "";
    document.querySelector("#description-technique").value = technique.description ?? "";

    // Reconstituer les blocs Hit / DC
    const conteneur = document.querySelector("#conteneur-hit-dc");

    conteneur.innerHTML = "";

    technique.hitDC.forEach(hit => {
        ajouterBlocHitDC(hit);
    });

    fenetre.showModal();

    actualiserTousLesBlocsHitDC();
}

/* ==================================== */
/* FONCTION COMMUNE D'ACTUALISATION
/* ==================================== */

function actualiserTousLesBlocsHitDC() {

    document.querySelectorAll("#conteneur-hit-dc > .bloc-hit-dc")
        .forEach(bloc => {

            const selectCaracteristique =
                bloc.querySelector(".caracteristique-hit-dc");

            if (!selectCaracteristique) return;

            const caracteristique = selectCaracteristique.value;

            let bonus = 0;

            if (["FOR", "DEX"].includes(caracteristique)) {

                bonus = Number(
                    document.querySelector(".champ-bonus-combat")?.value
                ) || 0;

            } else if (["INT", "SAG", "CHA"].includes(caracteristique)) {

                bonus = Number(
                    document.querySelector(".champ-bonus-incantation")?.value
                ) || 0;

            } else if (caracteristique === "CON") {

                bonus = recupererModificateurCaracteristique("CON");

            }

            const champBonus = bloc.querySelector(".bonus-hit-dc");

            if (champBonus) {
                champBonus.value = bonus;
                champBonus.dispatchEvent(new Event("input", { bubbles: true }));
            }
        });
}

/* ==================================== */
/* ACTUALISATION SEUILS DE DEGATS / SOINS
/* ==================================== */


function actualiserTousLesSeuilsDegats() {

    document.querySelectorAll("#conteneur-hit-dc > .bloc-hit-dc")
        .forEach(blocHitDC => {

            const caracteristique =
                blocHitDC.querySelector(".caracteristique-hit-dc")?.value;

            blocHitDC.querySelectorAll(".bloc-degat-soin")
                .forEach(blocDegats => {

                    const typeDegats =
                        blocDegats.querySelector(".type-degats")?.value;

                    const affichageSeuil =
                        blocDegats.querySelector(".valeur-seuil");

                    if (!typeDegats || !affichageSeuil) return;

                    const seuil = calculerSeuilDegats(
                        typeDegats,
                        caracteristique
                    );

                    affichageSeuil.textContent = `≤ ${seuil}`;
                });
        });
}

/* ==================================== */
/* AJOUT D'UN BLOC HIT / DC */
/* ==================================== */



function ajouterBlocHitDC(hit = null) {

    const conteneur = document.querySelector("#conteneur-hit-dc");
    const modele = document.querySelector("#modele-hit-dc");

    const bloc = modele.content.firstElementChild.cloneNode(true);

    conteneur.appendChild(bloc);

    const champMode = bloc.querySelector(".mode-hit-dc");
    const selectCaracteristique = bloc.querySelector(".caracteristique-hit-dc");

    const champBonus = bloc.querySelector(".bonus-hit-dc");
    const champSurplus = bloc.querySelector(".surplus-hit-dc");




    // Actualiser le bonus selon la caractéristique sélectionnée
    function actualiserBonus() {

        const caracteristique = selectCaracteristique.value;

        let bonus = 0;

        if (["FOR", "DEX"].includes(caracteristique)) {

            bonus = Number(
                document.querySelector(".champ-bonus-combat")?.value
            ) || 0;

        } else if (["INT", "SAG", "CHA"].includes(caracteristique)) {

            bonus = Number(
                document.querySelector(".champ-bonus-incantation")?.value
            ) || 0;

        } else if (caracteristique === "CON") {

            bonus = recupererModificateurCaracteristique("CON");

        }

        champBonus.value = bonus;

        actualiserTotal();
    }



    const selectTypeTechnique = document.querySelector("#type-technique");

    // Préremplir le mode
    champMode.value = hit?.mode || "Attaque";


    
    // Actualiser les options avec les modificateurs
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

        selectCaracteristique.value = valeurActuelle || "FOR";
    }

    // Préremplir la caractéristique
    selectCaracteristique.value = hit?.caracteristique || "FOR";

    // Générer les options
    actualiserOptionsCaracteristiques();




    const champTotal = bloc.querySelector(".total-hit-dc");

    function actualiserTotal() {

        const modificateur = recupererModificateurCaracteristique(
            selectCaracteristique.value
        );

        const bonus = Number(champBonus.value) || 0;
        const surplus = Number(champSurplus.value) || 0;

        const base = champMode.value === "Jet de sauvegarde" ? 8 : 0;

        const total = base + modificateur + bonus + surplus;

        champTotal.textContent =
            `${total >= 0 ? "+" : ""}${total}`;
    }

    // Actualisation initiale
    actualiserTotal();

    // Actualisation lors d'un changement de valeur
    selectCaracteristique.addEventListener("change", actualiserBonus);
    champBonus.addEventListener("input", actualiserTotal);
    champSurplus.addEventListener("input", actualiserTotal);
    champMode.addEventListener("change", actualiserTotal);




    champBonus.value = hit?.bonus ?? 0;
    champSurplus.value = hit?.surplus ?? 0;
    actualiserBonus();


    // Reconstituer les lignes de dégâts / soins
    if (hit && hit.degatsSoins) {
        hit.degatsSoins.forEach(degats => {
            ajouterBlocDegatsSoins(bloc, degats);
        });
    } else {
        ajouterBlocDegatsSoins(bloc);
    }

    // Supprimer le bloc
    bloc.querySelector(".bouton-supprimer-hit-dc")
        .addEventListener("click", () => {
            bloc.remove();
        });

    // Ajouter une ligne de dégâts / soins
    bloc.querySelector(".bouton-ajouter-degat")
        .addEventListener("click", () => {
            ajouterBlocDegatsSoins(bloc);
        });

    return bloc;
}


/* ==================================== */
/* AJOUT D'UNE LIGNE DE DEGATS / SOINS */
/* ==================================== */



function ajouterBlocDegatsSoins(blocHitDC, degats = null) {

    const conteneur = blocHitDC.querySelector(".conteneur-degats-soins");
    const modele = document.querySelector("#modele-degats-soins");

    if (!conteneur || !modele) {
        console.error("Conteneur dégâts/soins ou template introuvable.");
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

        selectCaracteristique.value = valeurActuelle || "FOR";
    }

    actualiserOptionsCaracteristiques();

    // Préremplir les informations existantes
    if (degats) {

        bloc.querySelector(".nombre-des-degats").value =
            degats.des?.nombre ?? 1;

        bloc.querySelector(".faces-des-degats").value =
            degats.des?.faces ?? 8;

        selectCaracteristique.value =
            degats.caracteristique?.nom || "FOR";

        bloc.querySelector(".type-degats").value =
            degats.type || "Tranchant";
    }


    // Actualiser le seuil
    const selectTypeDegats = bloc.querySelector(".type-degats");
    const affichageSeuil = bloc.querySelector(".valeur-seuil");


    // Actualiser l'icône du type de dégâts
    const iconeTypeDegat = bloc.querySelector(".icone-type-degat");

    function actualiserIconeTypeDegat() {

        const type = selectTypeDegats.value;

        iconeTypeDegat.src = obtenirIconeStatut(type);
        iconeTypeDegat.alt = type;
    }

    actualiserIconeTypeDegat();

    selectTypeDegats.addEventListener("change", actualiserIconeTypeDegat);


    const selectCaracteristiqueHitDC =
        blocHitDC.querySelector(".caracteristique-hit-dc");

    function actualiserSeuil() {

        const typeDegats = selectTypeDegats.value;
        const caracteristique = selectCaracteristiqueHitDC.value;

        const seuil = calculerSeuilDegats(
            typeDegats,
            caracteristique
        );

        affichageSeuil.textContent = `≤ ${seuil}`;
    }

    // Calcul initial
    actualiserSeuil();



    // Actualiser lorsque le type de dégâts change
    selectTypeDegats.addEventListener("change", actualiserSeuil);

    // Actualiser lorsque la caractéristique du bloc parent change
    selectCaracteristiqueHitDC.addEventListener("change", actualiserSeuil);

    // Actualiser lorsque le BC change
    document.querySelector(".champ-bonus-combat")
        ?.addEventListener("input", actualiserSeuil);

    // Actualiser lorsque le BI change
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

function calculerSeuilDegats(typeDegats, caracteristique) {

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

/* ==================================== */
/* RECUPERATION DES DONNEES DU FORMULAIRE */
/* ==================================== */


function recupererDonneesTechnique() {

    const technique = {

        nom: document.querySelector("#nom-technique").value.trim(),

        type: document.querySelector("#type-technique").value,

        portee: Number(document.querySelector("#portee-technique").value) || 0,

        tempsIncantation:
            document.querySelector("#temps-incantation").value,

        duree:
            document.querySelector("#duree-technique").value,

        tailleZoneEffet:
            Number(document.querySelector("#taille-zone-effet").value) || null,

        formeZoneEffet:
            document.querySelector("#forme-zone-effet").value || null,

        description:
            document.querySelector("#description-technique").value,

        hitDC: []
    };

    // Récupérer les blocs Hit / DC
    document.querySelectorAll("#conteneur-hit-dc .bloc-hit-dc")
        .forEach(bloc => {

            const hit = {

                mode: bloc.querySelector(".mode-hit-dc").value,

                caracteristique:
                    bloc.querySelector(".caracteristique-hit-dc").value,

                bonus: Number(bloc.querySelector(".bonus-hit-dc").value) || 0,

                surplus: Number(bloc.querySelector(".surplus-hit-dc").value) || 0,

                total: Number(
                    bloc.querySelector(".total-hit-dc").textContent
                ) || 0,

                degatsSoins: []
            };

            // Récupérer les lignes de dégâts / soins
            bloc.querySelectorAll(".bloc-degat-soin")
                .forEach(ligne => {

                    const nomCaracteristique =
                        ligne.querySelector(".caracteristique-degats").value;

                    const texteSeuil =
                        ligne.querySelector(".valeur-seuil").textContent;

                    const degats = {

                        des: {
                            nombre: ligne.querySelector(".nombre-des-degats").value === ""
                                ? 1
                                : Number(ligne.querySelector(".nombre-des-degats").value),

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
                            ) || 0
                        }
                    };

                    hit.degatsSoins.push(degats);

                });

            technique.hitDC.push(hit);

        });

    return technique;
}

/* ==================================== */
/* ENREGISTREMENT D'UNE TECHNIQUE */
/* ==================================== */

function enregistrerTechnique() {

    const donnees = recupererDonneesTechnique();

    if (techniqueEnCoursEdition) {

        // Conserver l'identifiant de la technique existante
        Object.assign(techniqueEnCoursEdition, donnees);

    } else {

        // Créer une nouvelle technique
        donnees.id = genererIdTechnique();

        techniques.push(donnees);
    }

    // Actualiser le tableau
    afficherTechniques();

    // Fermer la fenêtre
    document.querySelector("#fenetre-technique").close();
}

// Connecter les boutons
function initialiserBoutonsTechniques() {

    const boutonAjout = document.querySelector(".bouton-ajout-technique");
    const tbody = document.querySelector(".tableau-corps-techniques tbody");
    const boutonAjouterHitDC = document.querySelector("#bouton-ajouter-hit-dc");
    // Enregistrer une technique
    const formulaire = document.querySelector("#formulaire-technique");

    if (boutonAjout) {
        boutonAjout.addEventListener("click", ouvrirCreationTechnique);
    }

    if (boutonAjouterHitDC) {
        boutonAjouterHitDC.addEventListener("click", ajouterBlocHitDC);
    }

    if (formulaire) {
        formulaire.addEventListener("submit", evenement => {
            evenement.preventDefault();
            enregistrerTechnique();
        });
    }

    // Gestion des boutons Edit générés dynamiquement
    if (tbody) {
        tbody.addEventListener("click", evenement => {

            const boutonEdit = evenement.target.closest(".bouton-edition-technique");

            if (!boutonEdit) return;

            const ligne = boutonEdit.closest("tr");
            const lignes = [...tbody.querySelectorAll(".ligne-technique")];
            const index = lignes.indexOf(ligne);

            if (index === -1) return;

            ouvrirModificationTechnique(techniques[index]);
        });
    }
}

// Fermer la fenêtre sans enregistrer
document.querySelector("#bouton-annuler-technique")
    .addEventListener("click", () => {

        document.querySelector("#fenetre-technique").close();

    });



document.querySelector(".bouton-ordre-techniques")
    .addEventListener("click", () => {

        const activer = changerModeReorganisation("techniques", () => {

            modeReorganisationTechniques = false;

            document.querySelector(".conteneur-lignes-techniques")
                .classList.remove("mode-reorganisation");

            document.querySelector(".conteneur-techniques")
                .classList.remove("mode-reorganisation");

            document.querySelector(".bloc-techniques")
                .classList.remove("mode-reorganisation");

            document.querySelectorAll(".ligne-technique")
                .forEach(ligne => {
                    ligne.draggable = false;
                });

            document.querySelector(".bouton-ordre-techniques")
                .classList.remove("actif");

        });

        modeReorganisationTechniques = activer;

        document.querySelector(".conteneur-lignes-techniques")
            .classList.toggle("mode-reorganisation", activer);

        document.querySelector(".conteneur-techniques")
            .classList.toggle("mode-reorganisation", activer);

        document.querySelector(".bloc-techniques")
            .classList.toggle("mode-reorganisation", activer);

        document.querySelectorAll(".ligne-technique")
            .forEach(ligne => {
                ligne.draggable = activer;
            });

        document.querySelector(".bouton-ordre-techniques")
            .classList.toggle("actif", activer);

    });



document.querySelectorAll(".bloc-techniques .zone-suppression").forEach(zone => {

    zone.addEventListener("dragenter", event => {

        if (!modeReorganisationTechniques) return;

        event.preventDefault();
        zone.classList.add("zone-suppression-active");

    });

    zone.addEventListener("dragover", event => {

        if (!modeReorganisationTechniques) return;

        event.preventDefault();

    });

    zone.addEventListener("dragleave", event => {

        if (!modeReorganisationTechniques) return;

        if (!zone.contains(event.relatedTarget)) {
            zone.classList.remove("zone-suppression-active");
        }

    });

    zone.addEventListener("drop", event => {

        if (!modeReorganisationTechniques) return;

        event.preventDefault();

        depotDansZoneSuppression = true;

        zone.classList.remove("zone-suppression-active");

    });

});








// Afficher les techniques au chargement de la page
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        afficherTechniques();
        initialiserBoutonsTechniques();
    });
} else {
    afficherTechniques();
    initialiserBoutonsTechniques();
}