// Sélection des éléments
const codePostalInput = document.getElementById("code-postal");
const communeSelect = document.getElementById("communeSelect");
const validationButton = document.getElementById("validationButton");
const id_option_sup = document.getElementById("id_option_sup");

const nombreJoursInput = document.getElementById("volume"); // Input range pour le nombre de jours
const latitudeCheckbox = document.getElementById("latitude");
const longitudeCheckbox = document.getElementById("longitude");
const cumulPluieCheckbox = document.getElementById("cumulPluie");
const ventMoyenCheckbox = document.getElementById("ventMoyen");
const dirVentCheckbox = document.getElementById("dirVent");


// Fonction pour effectuer la requête API des communes en utilisant le code postal
async function fetchCommunesByCodePostal(codePostal) {
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${codePostal}`
    );
    const data = await response.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
    throw error;
  }
}

// Fonction pour afficher les communes dans la liste déroulante
function displayCommunes(data) {
  communeSelect.innerHTML = "";
  // S'il y a au moins une commune retournée dans data
  if (data.length) {
    data.forEach((commune) => {
      const option = document.createElement("option");
      option.value = commune.code;
      option.textContent = commune.nom;
      communeSelect.appendChild(option);
    });
    communeSelect.style.display = "block";
    validationButton.style.display = "block";
    id_option_sup.style.display = "block";

  }
  else {
    // Supprimer un message précédent s’il existe déjà
    const existingMessage = document.getElementById("error-message");
    if (!existingMessage) {
      const message = document.createElement("p");
      message.id = "error-message";
      message.textContent = "Le code postal saisi n'est pas valide";
      message.classList.add('errorMessage');
      document.body.appendChild(message);
    }

    // Masquer les éléments inutiles
    communeSelect.style.display = "none";
    validationButton.style.display = "none";
    id_option_sup.style.display = "none";


    // Recharger la page après 3 secondes
    setTimeout(() => location.reload(), 3000);
  }
}
// Fonction pour effectuer la requête API de météo en utilisant le code de la commune sélectionnée
async function fetchMeteoByCommune(selectedCommune) {
  try {
    const response = await fetch(
      `https://api.meteo-concept.com/api/forecast/daily/0?token=8356b25d0dd0d8f0447d702e3ce9e6d54bc9ea3241d087f1fd5ad56ef48c4ab5&insee=${selectedCommune}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la requête API:", error);
    throw error;
  }
}

// Ajout de l'écouteur d'événement "input" sur le champ code postal
codePostalInput.addEventListener("input", async () => {
  const codePostal = codePostalInput.value;
  communeSelect.style.display = "none";
  validationButton.style.display = "none";
  id_option_sup.style.display = "none";

  if (/^\d{5}$/.test(codePostal)) {
    try {
      const data = await fetchCommunesByCodePostal(codePostal);
      displayCommunes(data);
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la recherche de la commune :",
        error
      );
      throw error;
    }
  }
});

// Fonction pour récupérer les valeurs du formulaire
function getFormData() {
  const nombreJours = nombreJoursInput.value; // Récupère la valeur du range
  const latitude = latitudeCheckbox.checked; // Récupère l'état de la checkbox "Latitude"
  const longitude = longitudeCheckbox.checked; // Récupère l'état de la checkbox "Longitude"
  const cumulPluie = cumulPluieCheckbox.checked; // Récupère l'état de la checkbox "Cumul de pluie"
  const ventMoyen = ventMoyenCheckbox.checked; // Récupère l'état de la checkbox "Vent moyen"
  const dirVent = dirVentCheckbox.checked; // Récupère l'état de la checkbox "Direction du vent"

  return {
    nombreJours,
    latitude,
    longitude,
    cumulPluie,
    ventMoyen,
    dirVent
  };
}

// Ajout de l'écouteur d'événement "click" sur le bouton de validation
validationButton.addEventListener("click", async () => {
  const selectedCommune = communeSelect.value;
  if (selectedCommune) { // si selectedCommune n'est pas vide
    try {
      const data = await fetchMeteoByCommune(selectedCommune);
      const option_sup = getFormData();
      createCard(data);
    } catch (error) {
      console.error("Erreur lors de la requête API meteoConcept:", error);
      throw error;
    }
  }
});

