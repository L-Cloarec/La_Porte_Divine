/* =====================================================
   OUVERTURE ET FERMETURE DE LA FENÊTRE DISCORD
===================================================== */

const boutonDiscord = document.getElementById("bouton-discord");
const fenetreDiscord = document.getElementById("fenetre-discord");
const boutonFermerDiscord = document.getElementById("fermer-fenetre-discord");

const champWebhookDiscord = document.getElementById("webhook-discord");
const boutonConnexionDiscord = document.getElementById("bouton-connexion-discord");

let connexionDiscordActive = false;

const statutDiscord = document.getElementById("statut-discord");

/* OUVERTURE DE LA FENÊTRE */

boutonDiscord.addEventListener("click", () => {

    fenetreDiscord.showModal();

});


/* FERMETURE DE LA FENÊTRE */

boutonFermerDiscord.addEventListener("click", () => {

    fenetreDiscord.close();

});


/* =====================================================
   ACTIVATION / DÉSACTIVATION DE DISCORD
===================================================== */

boutonConnexionDiscord.addEventListener("click", () => {

    // Si Discord est actuellement désactivé
    if (!connexionDiscordActive) {

        // Vérification du champ webhook
        if (!champWebhookDiscord.value.trim()) {

            alert("Veuillez renseigner une URL de webhook Discord.");

            return;
        }

        // Activation de Discord
        connexionDiscordActive = true;

        boutonConnexionDiscord.textContent = "Désactiver Discord";

        statutDiscord.textContent = "ON";
        statutDiscord.classList.add("actif");

    }

    // Si Discord est actuellement activé
    else {

        // Désactivation de Discord
        connexionDiscordActive = false;

        boutonConnexionDiscord.textContent = "Activer Discord";

        statutDiscord.textContent = "OFF";
        statutDiscord.classList.remove("actif");

    }

});

/* =====================================================
   ENVOI D'UN MESSAGE SUR DISCORD
===================================================== */

async function envoyerMessageDiscord(message) {

    // Vérification de l'activation
    if (!connexionDiscordActive) return;

    // Récupération du webhook
    const webhook = champWebhookDiscord.value.trim();

    // Vérification du webhook
    if (!webhook) return;

    try {

        const reponse = await fetch(webhook, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                content: message

            })

        });

        if (!reponse.ok) {

            throw new Error("Erreur lors de l'envoi sur Discord.");

        }

    }

    catch (erreur) {

        console.error("Erreur Discord :", erreur);

        alert("Impossible d'envoyer le message sur Discord.");

    }

}

/* =====================================================
   TEST DE CONNEXION DISCORD
===================================================== */

/* =====================================================
   TEST DE CONNEXION DISCORD
===================================================== */

const boutonTestDiscord = document.getElementById("bouton-test-discord");

boutonTestDiscord.addEventListener("click", () => {

    if (!connexionDiscordActive) {

        alert("Veuillez d'abord activer Discord.");

        return;

    }

    // Récupération du nom du personnage
    const nomPersonnage = document.getElementById("nom-personnage").value.trim() || "Personnage";

    // Envoi du message Discord
    envoyerMessageDiscord(`${nomPersonnage} est maintenant connecté à Discord`);

});