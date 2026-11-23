/* ========================================= */
/* DONNÉES DES ESPÈCES                      */
/* ========================================= */

const donneesEspeces = {

    humain: {
        nom: "Humain",

        caracteristiques: {
            deVie: {},
            vitesse: {},
            bonus: {},
            resistances: [],
            immunites: []
        },

        traits: [
            {
                nom: "Adaptabilité",
                description: "Vous savez vous adapter à une grande variété de situations."
            },
            {
                nom: "Polyvalence",
                description: "Vous développez facilement des compétences variées."
            },
                        {
                nom: "Adaptabilité",
                description: "Vous savez vous adapter à une grande variété de situations."
            },
            {
                nom: "Polyvalence",
                description: "Vous développez facilement des compétences variées."
            },
                        {
                nom: "Adaptabilité",
                description: "Vous savez vous adapter à une grande variété de situations."
            },
            {
                nom: "Polyvalence",
                description: "Vous développez facilement des compétences variées."
            },
                        {
                nom: "Adaptabilité",
                description: "Vous savez vous adapter à une grande variété de situations."
            },
            {
                nom: "Polyvalence",
                description: "Vous développez facilement des compétences variées."
            },
                        {
                nom: "Adaptabilité",
                description: "Vous savez vous adapter à une grande variété de situations."
            },
            {
                nom: "Polyvalence",
                description: "Vous développez facilement des compétences variées."
            },
                        {
                nom: "Adaptabilité",
                description: "Vous savez vous adapter à une grande variété de situations."
            },
            {
                nom: "Polyvalence",
                description: "Vous développez facilement des compétences variées."
            }
        ],

        sousRaces: {

            commun: {
                nom: "Commun",
                caracteristiques: {
                    bonus: {},
                    resistances: [],
                    immunites: []
                },
                traits: [
                    {
                        nom: "Langue commune",
                        description: "Vous maîtrisez parfaitement la langue commune."
                    }
                ]
            },

            nordique: {
                nom: "Nordique",
                caracteristiques: {
                    bonus: {},
                    resistances: [],
                    immunites: []
                },
                traits: []
            },

            meridional: {
                nom: "Méridional",
                caracteristiques: {
                    bonus: {},
                    resistances: [],
                    immunites: []
                },
                traits: []
            }
        }
    },

    elfe: {
        nom: "Elfe",
        caracteristiques: {
            deVie: {},
            vitesse: {},
            bonus: {},
            resistances: [],
            immunites: []
        },

        traits: [],

        sousRaces: {
            sylvestre: { nom: "Sylvestre", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] },
            haut_elfe: { nom: "Haut-elfe", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] },
            sombre_elfe: { nom: "Sombre-elfe", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] }
        }
    },

    nain: {
        nom: "Nain",
        caracteristiques: {
            deVie: {},
            vitesse: {},
            bonus: {},
            resistances: [],
            immunites: []
        },

        traits: [],

        sousRaces: {
            montagnard: { nom: "Montagnard", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] },
            collines: { nom: "Des Collines", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] },
            profondeurs: { nom: "Des Profondeurs", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] }
        }
    },

    orc: {
        nom: "Orc",
        caracteristiques: {
            deVie: {},
            vitesse: {},
            bonus: {},
            resistances: [],
            immunites: []
        },

        traits: [],

        sousRaces: {
            plaines: { nom: "Orc des plaines", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] },
            montagnes: { nom: "Orc des montagnes", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] },
            tribal: { nom: "Orc tribal", caracteristiques: { bonus: {}, resistances: [], immunites: [] }, traits: [] }
        }
    }
};





/* ========================================= */
/* MENU DÉROULANT DES ESPÈCES               */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const boutonEspece = document.getElementById("bouton-espece");
    const texteEspece = document.getElementById("texte-espece");
    const menuEspeces = document.getElementById("menu-especes");

    const champEspece = document.getElementById("espece");
    const champSousRace = document.getElementById("sous-race");

    // Ouvrir ou fermer le menu
    boutonEspece.addEventListener("click", () => {
        menuEspeces.hidden = !menuEspeces.hidden;
    });

    // Générer les espèces et leurs sous-races
    Object.entries(donneesEspeces).forEach(([cleEspece, espece]) => {

        const blocEspece = document.createElement("div");
        blocEspece.classList.add("option-espece");

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.classList.add("bouton-option-espece");
        bouton.textContent = espece.nom + "  ▸";

        const sousMenu = document.createElement("div");
        sousMenu.classList.add("sous-menu-espece");
        sousMenu.hidden = true;

        // Déplier ou replier les sous-races
        bouton.addEventListener("click", () => {

            const estOuvert = !sousMenu.hidden;

            // Replier les autres sous-menus
            menuEspeces.querySelectorAll(".sous-menu-espece").forEach(menu => {
                menu.hidden = true;
            });

            menuEspeces.querySelectorAll(".bouton-option-espece").forEach(btn => {
                btn.textContent = btn.textContent.replace("  ▼", "  ▸");
            });

            sousMenu.hidden = estOuvert;

            if (!estOuvert) {
                bouton.textContent = espece.nom + "  ▼";
            }
        });

        // Générer les sous-races
        Object.entries(espece.sousRaces).forEach(([cleSousRace, sousRace]) => {

            const boutonSousRace = document.createElement("button");
            boutonSousRace.type = "button";
            boutonSousRace.classList.add("bouton-option-sous-race");
            boutonSousRace.textContent = sousRace.nom;

            boutonSousRace.addEventListener("click", () => {

                champEspece.value = cleEspece;
                champSousRace.value = cleSousRace;

                texteEspece.textContent = `${espece.nom} — ${sousRace.nom}`;

                menuEspeces.hidden = true;

                // Informer les autres scripts du changement
                champEspece.dispatchEvent(new Event("change", { bubbles: true }));
                champSousRace.dispatchEvent(new Event("change", { bubbles: true }));
            });

            sousMenu.appendChild(boutonSousRace);
        });

        blocEspece.appendChild(bouton);
        blocEspece.appendChild(sousMenu);

        menuEspeces.appendChild(blocEspece);
    });

});