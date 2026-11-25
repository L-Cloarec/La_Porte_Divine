/* ========================================= */
/* DONNÉES DES ESPÈCES                      */
/* ========================================= */



const donneesEspeces = {

    nain: {
        nom: "Nain",

        caracteristiques: {
            deVie: {
                nombre: 1,
                faces: 10
            },

            vitesse: 25,

            bonus: {},
            resistances: [],
            immunites: []
        },

        traits: [
            {
                nom: "Cœur-de-gemme",
                description: "Les nains sont nés des pierres précieuses dans les montagnes les plus profondes. Le choix de la pierre précieuse permet de débloquer un passif lié à celle-ci. Choisissez une gemme à la création du personnage. Deux fois par repos long, lorsque vous touchez avec une attaque, vous pouvez ajouter 2d6 dégâts du type correspondant."
            },
            {
                nom: "Inertie minérale",
                description: "Chaque fois qu'un nain subit des dégâts ou échoue à un jet de sauvegarde contre un statut, il gagne +1 charge de densité. Toutes les 3 charges, le nain choisit Forme Dense ou Façonnage."
            },
            {
                nom: "Forme Dense",
                description: "Toutes les 3 charges de densité, le nain peut choisir Forme Dense pendant 1 minute : +1 CA et -1,5 m de vitesse de déplacement. L'effet est cumulable 3 fois."
            },
            {
                nom: "Façonnage",
                description: "Toutes les 3 charges de densité, le nain peut choisir de créer ou modifier un élément de terrain : terrain difficile, couverture, petit mur ou surélévation."
            }
        ],

        sousRaces: {

            diamant: {
                nom: "Diamant",

                caracteristiques: {
                    element: [
                        "Tranchant",
                        "Contondant",
                        "Perforant"
                    ],
                    bonus: {},
                    resistances: [],
                    immunites: []
                },

                traits: [
                    {
                        nom: "Passif du Diamant",
                        description: "Ne peut pas être mis à terre."
                    },
                    {
                        nom: "Façonnage de Diamant",
                        description: "Cristal quasi indestructible. Donne une meilleure couverture."
                    }
                ]
            },

            rubis: {
                nom: "Rubis",

                caracteristiques: {
                    element: ["Feu"],
                    bonus: {},
                    resistances: ["Feu"],
                    immunites: []
                },

                traits: [
                    {
                        nom: "Passif du Rubis",
                        description: "Résistance aux dégâts de feu."
                    },
                    {
                        nom: "Façonnage de Rubis",
                        description: "La pierre devient volcanique. Les ennemis qui la traversent subissent des dégâts de feu."
                    }
                ]
            },

            emeraude: {
                nom: "Émeraude",

                caracteristiques: {
                    element: ["Nécrotique"],
                    bonus: {},
                    resistances: [],
                    immunites: []
                },

                traits: [
                    {
                        nom: "Passif de l'Émeraude",
                        description: "Lorsque vous tombez à 0 PV, restez à 1 PV une fois par repos long."
                    },
                    {
                        nom: "Façonnage d'Émeraude",
                        description: "Roche funéraire. Réduit les soins reçus par les ennemis proches."
                    }
                ]
            },

            saphir: {
                nom: "Saphir",

                caracteristiques: {
                    element: ["Foudre"],
                    bonus: {},
                    resistances: [],
                    immunites: [],
                    bonusVitesse: 10,
                    multiplicateurInitiative: 2
                },

                traits: [
                    {
                        nom: "Passif du Saphir",
                        description: "Bonus à l'initiative (2 × BC ou BI) et à la vitesse de déplacement (+3 m)."
                    },
                    {
                        nom: "Façonnage de Saphir",
                        description: "Cristaux conducteurs. Améliore la vitesse de déplacement des alliés et accorde un bonus contre les créatures en armure métallique."
                    }
                ]
            },

            topaze: {
                nom: "Topaze",

                caracteristiques: {
                    element: ["Froid"],
                    bonus: {},
                    resistances: ["Froid"],
                    immunites: []
                },

                traits: [
                    {
                        nom: "Passif de la Topaze",
                        description: "Résistance aux dégâts de froid."
                    },
                    {
                        nom: "Façonnage de Topaze",
                        description: "La roche gèle et transforme le terrain en terrain difficile."
                    }
                ]
            },

            citrine: {
                nom: "Citrine",

                caracteristiques: {
                    element: ["Radiant"],
                    bonus: {},
                    resistances: [],
                    immunites: ["Aveuglement"]
                },

                traits: [
                    {
                        nom: "Passif de la Citrine",
                        description: "Bonus aux soins reçus ou donnés (2 × BI). Ne peut pas être aveuglé."
                    },
                    {
                        nom: "Façonnage de Citrine",
                        description: "Cristaux lumineux. Éclairent et repoussent les ténèbres magiques faibles."
                    }
                ]
            },

            amethyste: {
                nom: "Améthyste",

                caracteristiques: {
                    element: ["Tonnerre"],
                    bonus: {},
                    resistances: [],
                    immunites: []
                },

                traits: [
                    {
                        nom: "Passif de l'Améthyste",
                        description: "Vous pouvez localiser les créatures en contact avec le sol dans un rayon de 6 m. Les créatures invisibles en contact avec le sol ne bénéficient pas des avantages de l'invisibilité contre vous."
                    },
                    {
                        nom: "Façonnage d'Améthyste",
                        description: "Cristaux résonnants. Amplifient le sens sismique à un rayon de 12 mètres."
                    }
                ]
            },

            grenat: {
                nom: "Grenat",

                caracteristiques: {
                    element: ["Force"],
                    bonus: {},
                    resistances: [],
                    immunites: []
                },

                traits: [
                    {
                        nom: "Passif du Grenat",
                        description: "Une fois par tour, lorsqu'une créature vous touche au corps-à-corps, vous pouvez la repousser de 1,5 m."
                    },
                    {
                        nom: "Façonnage de Grenat",
                        description: "Roche dense. Les murs créés ont davantage de points de vie."
                    }
                ]
            },

            jade: {
                nom: "Jade",

                caracteristiques: {
                    element: ["Acide"],
                    bonus: {},
                    resistances: [],
                    immunites: []
                },

                traits: [
                    {
                        nom: "Passif du Jade",
                        description: "Les créatures qui vous infligent des dégâts au corps-à-corps reçoivent un malus temporaire sur leur prochain jet d'attaque, correspondant à votre BC ou BI."
                    },
                    {
                        nom: "Façonnage de Jade",
                        description: "Pierre corrosive. Si une entité reste dans la zone à la fin de son tour, elle subit -1 CA."
                    }
                ]
            },

            malachite: {
                nom: "Malachite",

                caracteristiques: {
                    element: ["Poison"],
                    bonus: {},
                    resistances: [],
                    immunites: ["Empoisonnement", "Maladie"]
                },

                traits: [
                    {
                        nom: "Passif de la Malachite",
                        description: "Ne peut pas être empoisonné ni contracter une maladie. Une fois par tour, lorsqu'une créature vous inflige des dégâts au corps-à-corps, elle subit des dégâts de poison égaux à votre BI."
                    },
                    {
                        nom: "Façonnage de Malachite",
                        description: "Roche toxique. Dégage des vapeurs empoisonnées, infligeant 2d6 dégâts de poison si une entité reste dans la zone à la fin de son tour."
                    }
                ]
            }

        }
    },




    humain: {
        nom: "Humain",

        caracteristiques: {
            deVie: { nombre: 1, faces: 8 },
            vitesse: 35,
            bonus: {},
            resistances: [],
            immunites: []
        },

        traits: [
            {
                nom: "Héritage",
                description: "Chaque humain choisit un héritage familial ou social. Vous gagnez la maîtrise d'une compétence ou l'expertise dans une compétence déjà maîtrisée."
            },
            {
                nom: "Adrénaline",
                description: "Lorsque vous devez tomber inconscient, votre nature humaine vous permet de rester conscient avec 1 point de vie. Cet effet ne peut se déclencher qu'une fois par repos court."
            },
            {
                nom: "Adaptabilité critique",
                description: "Lorsque vous tombez à 50 % de vos PV maximum ou moins, vous entrez en état d'adaptation critique. Vous obtenez un mini-passif déterminé par la situation de danger. Cet effet dure jusqu'à la fin du combat et vous ne pouvez obtenir qu'une adaptation par combat."
            },
            {
                nom: "Mémoire adaptative",
                description: "À la fin du combat, vous pouvez conserver l'adaptation obtenue sous forme de mémoire pendant 72 heures. Vous pouvez conserver jusqu'à 3 mémoires. Le mini-passif reste actif, mais ne peut être ni amélioré ni cumulé. Si vous dépassez la limite, la mémoire la plus ancienne est remplacée."
            }
        ],

        sousRaces: {}
    },



    elfe: {
        nom: "Elfe",

        caracteristiques: {
            deVie: {
                nombre: 1, faces: 6 },
                vitesse: 40,
                bonus: {},
                resistances: [],
                immunites: []
        },

        traits: [
            {
                nom: "L'Éveil",
                description: "Les elfes sont nés lorsque certains animaux ont développé une conscience supérieure. Au niveau 1, les Elfes peuvent choisir un aspect animal afin de tirer des avantages de ces créatures."
            }
        ],

            sousRaces: {
            corbeau: {
                nom: "Corbeau"
            },

            panthere: {
                nom: "Panthère"
            },

            loup: {
                nom: "Loup"
            },

            ours: {
                nom: "Ours"
            },

            chouette: {
                nom: "Chouette"
            }
        }
    },

    orc: {
        nom: "Orc",

        caracteristiques: {
            deVie: {
                nombre: 1,
                faces: 12
            },

            vitesse: 30,

            bonus: {},
            resistances: [],
            immunites: []
        },

        traits: [
            {
                nom: "Mécanique de vigueur",
                description: "Cette mécanique permet à l'Orc d'augmenter ses capacités."
            },
            {
                nom: "Brasier",
                description: "Chaque jour, l'Orc peut brûler un colifichet personnel, c'est-à-dire un objet symbolique lui appartenant. Cela active un Brasier de guerre, un effet passif temporaire qui dure 24 heures. Un Orc ne peut avoir qu'un seul Brasier actif à la fois."
            },
            {
                nom: "Table des colifichets",
                description: "Bijou : +10 en résistance au statut. Morceau de tissu portant des armoiries : +1 BC et +1 BI."
            },
            {
                nom: "Résidu volcanique",
                description: "Chaque coup infligé ou statut appliqué confère à l'Orc 1 charge magmatique. Tous les 3 charges, l'Orc peut choisir entre ajouter 1d6 dégâts à sa prochaine attaque ou doubler ses chances d'appliquer un statut. Au-delà de 5 charges, chaque charge excédentaire inflige 1d12 dégâts de feu à l'Orc et aux créatures situées autour de lui (environ 3 mètres). Les charges retombent ensuite à 3. Elles persistent jusqu'à la fin du combat ou jusqu'à l'utilisation de l'effet."
            }
        ],

        sousRaces: {}
    },

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

    // DEBUT VITESSE DE LA RACE SUR LA FICHE
    // DEBUT VITESSE DE LA RACE SUR LA FICHE
    const champVitesse = document.querySelector(".valeur-vitesse");



    // Actualiser la vitesse selon l'espèce et la sous-race
    function actualiserVitesseRace() {

        const cleEspece = champEspece.value;
        const cleSousRace = champSousRace.value;

        const espece = donneesEspeces[cleEspece];

        if (!espece || !champVitesse) return;

        // Récupérer la vitesse de base
        const vitesseBase = espece.caracteristiques.vitesse;

        // Récupérer la sous-race sélectionnée
        const sousRace = espece.sousRaces?.[cleSousRace];

        // Récupérer son éventuel bonus de vitesse
        const bonusVitesse = sousRace?.caracteristiques?.bonusVitesse || 0;

        // Calculer la vitesse totale
        const vitesseTotale = vitesseBase + bonusVitesse;

        champVitesse.value = `${vitesseTotale} f.`;
    }

    // Écouter les changements d'espèce et de sous-race
    champEspece.addEventListener("change", actualiserVitesseRace);
    champSousRace.addEventListener("change", actualiserVitesseRace);

    // Initialiser la vitesse au chargement
    actualiserVitesseRace();
    // FIN VITESSE DE LA RACE SUR LA FICHE
    // FIN VITESSE DE LA RACE SUR LA FICHE

    // DEBUT INITIATIVE DE LA RACE SUR LA FICHE
    // DEBUT INITIATIVE DE LA RACE SUR LA FICHE
    // Récupérer le multiplicateur d'initiative de la sous-race
    function obtenirMultiplicateurInitiative() {

        const cleEspece = champEspece.value;
        const cleSousRace = champSousRace.value;

        const espece = donneesEspeces[cleEspece];

        if (!espece) return 1;

        const sousRace = espece.sousRaces?.[cleSousRace];

        return sousRace?.caracteristiques?.multiplicateurInitiative ?? 1;
    }

    window.obtenirMultiplicateurInitiative = obtenirMultiplicateurInitiative;

    // DEBUT DES DE VIE DE LA RACE SUR LA FICHE
    // DEBUT DES DE VIE DE LA RACE SUR LA FICHE
    const champTypeDeVie = document.querySelector(".type-de-de");

    // Actualiser le dé de vie selon l'espèce et la sous-race
    function actualiserDeVieRace() {
        const cleEspece = champEspece.value;
        const cleSousRace = champSousRace.value;
        const espece = donneesEspeces[cleEspece];

        if (!espece || !champTypeDeVie) return;

        const sousRace = espece.sousRaces?.[cleSousRace];

        // Priorité à une éventuelle modification du dé de vie par la sous-race
        const deVie = sousRace?.caracteristiques?.deVie
            ?? espece.caracteristiques.deVie;

        champTypeDeVie.value = deVie.faces;
    }

    // Écouter les changements d'espèce et de sous-race pour le dé de vie
    champEspece.addEventListener("change", actualiserDeVieRace);
    champSousRace.addEventListener("change", actualiserDeVieRace);

    // Initialiser le dé de vie au chargement
    actualiserDeVieRace();
    // FIN DES DE VIE DE LA RACE SUR LA FICHE
    // FIN DES DE VIE DE LA RACE SUR LA FICHE

    // Ouvrir ou fermer le menu
    boutonEspece.addEventListener("click", () => {
        menuEspeces.hidden = !menuEspeces.hidden;
    });

    // Sélectionner une espèce sans sous-race
    function selectionnerEspece(cleEspece, espece) {

        champEspece.value = cleEspece;
        champSousRace.value = "";

        texteEspece.textContent = espece.nom;

        menuEspeces.hidden = true;

        champEspece.dispatchEvent(new Event("change", { bubbles: true }));
        champSousRace.dispatchEvent(new Event("change", { bubbles: true }));

        if (typeof window.actualiserInitiative === "function") {
            window.actualiserInitiative();
        }
    }

    // Sélectionner une espèce avec sous-race
    function selectionnerSousRace(cleEspece, espece, cleSousRace, sousRace) {

        champEspece.value = cleEspece;
        champSousRace.value = cleSousRace;

        texteEspece.textContent = `${espece.nom} — ${sousRace.nom}`;

        menuEspeces.hidden = true;

        champEspece.dispatchEvent(new Event("change", { bubbles: true }));
        champSousRace.dispatchEvent(new Event("change", { bubbles: true }));

        if (typeof window.actualiserInitiative === "function") {
            window.actualiserInitiative();
        }
    }

    // Générer les espèces et leurs sous-races
    Object.entries(donneesEspeces).forEach(([cleEspece, espece]) => {

        const blocEspece = document.createElement("div");
        blocEspece.classList.add("option-espece");

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.classList.add("bouton-option-espece");

        const sousRaces = Object.entries(espece.sousRaces || {});

        // CAS 1 : ESPÈCE SANS SOUS-RACE
        if (sousRaces.length === 0) {

            bouton.textContent = espece.nom;

            bouton.addEventListener("click", () => {
                selectionnerEspece(cleEspece, espece);
            });

            blocEspece.appendChild(bouton);

        }

        // CAS 2 : ESPÈCE AVEC SOUS-RACES
        else {

            bouton.textContent = espece.nom + "  ▸";

            const sousMenu = document.createElement("div");
            sousMenu.classList.add("sous-menu-espece");
            sousMenu.hidden = true;

            // Déplier ou replier les sous-races
            bouton.addEventListener("click", () => {

                const estOuvert = !sousMenu.hidden;

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
            sousRaces.forEach(([cleSousRace, sousRace]) => {

                const boutonSousRace = document.createElement("button");
                boutonSousRace.type = "button";
                boutonSousRace.classList.add("bouton-option-sous-race");
                boutonSousRace.textContent = sousRace.nom;

                boutonSousRace.addEventListener("click", () => {
                    selectionnerSousRace(
                        cleEspece,
                        espece,
                        cleSousRace,
                        sousRace
                    );
                });

                sousMenu.appendChild(boutonSousRace);
            });

            // Ajouter le bouton AVANT le sous-menu
            blocEspece.appendChild(bouton);
            blocEspece.appendChild(sousMenu);
        }

        // Ajouter l'espèce au menu principal
        menuEspeces.appendChild(blocEspece);

    });

});
