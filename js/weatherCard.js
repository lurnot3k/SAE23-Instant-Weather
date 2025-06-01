function createCards(data, numberOfDays) {
  const weatherSection = document.getElementById("weatherInformation");
  weatherSection.innerHTML = ""; 
  
  const cardsContainer = document.createElement("div");
  cardsContainer.className = "force-white cards-container ";
  
  // Boucle avec le nbr de jours
  for (let i = 0; i < numberOfDays; i++) {
    const forecast = data.forecast[i];
    const cityData = data.city;
    
    const dayData = {
      city: cityData,
      forecast: forecast
    };
    
    // Création de la div pour la carte
    const cardElement = document.createElement("div");
    cardElement.innerHTML = generateCardHTML(dayData);
    cardsContainer.appendChild(cardElement);
  }
  
  weatherSection.appendChild(cardsContainer);
  
  // Bouton de nouvelle recherche
  const reloadButton = document.createElement("button");
  reloadButton.textContent = "Nouvelle recherche";
  reloadButton.classList.add("reloadButton");
  reloadButton.addEventListener("click", () => location.reload());
  weatherSection.appendChild(reloadButton);
  
  // Cacher le formulaire et afficher la section météo
  document.getElementById("cityForm").style.display = "none";
  weatherSection.style.display = "flex";
}

function generateCardHTML(data) {
  const options = getFormData();
  
  const forecastDate = new Date(data.forecast.datetime);
  const formattedDate = formatDate(forecastDate);
  const [image, alt_text] = choixImage(data.forecast.weather);
  
  return `
    <div class="weather-card">
      <div class="weather-header">
        <div class="weather-city">${data.city.name.toUpperCase()}</div>
        <div class="weather-date">${formattedDate}</div>
      </div>
      
      <div class="weather-condition">
        <img id="img_card" src="${image}" alt="${alt_text}" />
      </div>
      <div class="weather-condition">${getWeatherCondition(data.forecast.weather)}</div>
      <div class="weather-temps">
        <div class="temp">
          <div class="temp-label">Température min</div>
          <div class="temp-value">${data.forecast.tmin}°C</div>
        </div>
        <div class="temp">
          <div class="temp-label">Température max</div>
          <div class="temp-value">${data.forecast.tmax}°C</div>
        </div>
      </div>
      
      <hr class="weather-divider">
      
      <div class="weather-details">
        <div class="detail-row">
          <span class="detail-label">Ensoleillement</span>
          <span class="detail-value">${displayHours(data.forecast.sun_hours)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Probabilité de pluie</span>
          <span class="detail-value">${data.forecast.probarain}%</span>
        </div>
        ${options.latitude ? `
        <div class="detail-row">
          <span class="detail-label">Latitude</span>
          <span class="detail-value">${data.city.latitude}</span>
        </div>` : ''}
        ${options.longitude ? `
        <div class="detail-row">
          <span class="detail-label">Longitude</span>
          <span class="detail-value">${data.city.longitude}</span>
        </div>` : ''}
        ${options.cumulPluie ? `
        <div class="detail-row">
          <span class="detail-label">Cumul pluie</span>
          <span class="detail-value">${data.forecast.rr1 || 'N/A'} mm</span>
        </div>` : ''}
        ${options.ventMoyen ? `
        <div class="detail-row">
          <span class="detail-label">Vent moyen (10m)</span>
          <span class="detail-value">${data.forecast.wind10m || 'N/A'} km/h</span>
        </div>` : ''}
        ${options.dirVent ? `
        <div class="detail-row">
          <span class="detail-label">Direction du vent</span>
          <span class="detail-value">${data.forecast.dirwind10m || 'N/A'}°</span>
        </div>` : ''}
      </div>
    </div>
  `;
}

function displayHours(sunHours) {
  return sunHours + (sunHours > 1 ? " heures" : " heure");
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

function getWeatherCondition(weatherCode) {
  const conditions = {
    0: 'SOLEIL',
    1: 'PEU NUAGEUX',
    2: 'CIEL VOILÉ',
    3: 'NUAGEUX',
    4: 'TRÈS NUAGEUX',
    5: 'COUVERT',
    6: 'BROUILLARD',
    7: 'BROUILLARD GIVRANT',
    10: 'PLUIE FAIBLE',
    11: 'PLUIE MODÉRÉE',
    12: 'PLUIE FORTE',
    13: 'PLUIE FAIBLE VERGLACANTE',
    14: 'PLUIE MODÉRÉE VERGLACANTE',
    15: 'PLUIE FORTE VERGLACANTE',
    16: 'BRUINE',
    20: 'NEIGE FAIBLE',
    21: 'NEIGE MODÉRÉE',
    22: 'NEIGE FORTE',
    30: 'PLUIE ET NEIGE MÊLÉES FAIBLES',
    31: 'PLUIE ET NEIGE MÊLÉES MODÉRÉES',
    32: 'PLUIE ET NEIGE MÊLÉES FORTES',
    40: 'AVERSES DE PLUIE LOCALES ET FAIBLES',
    41: 'AVERSES DE PLUIE LOCALES',
    42: 'AVERSES LOCALES ET FORTES',
    43: 'AVERSES DE PLUIE FAIBLES',
    44: 'AVERSES DE PLUIE',
    45: 'AVERSES DE PLUIE FORTES',
    46: 'AVERSES DE PLUIE FAIBLES ET FRÉQUENTES',
    47: 'AVERSES DE PLUIE FRÉQUENTES',
    48: 'AVERSES DE PLUIE FORTES ET FRÉQUENTES',
    60: 'AVERSES DE NEIGE LOCALISÉES ET FAIBLES',
    61: 'AVERSES DE NEIGE LOCALISÉES',
    62: 'AVERSES DE NEIGE LOCALISÉES ET FORTES',
    63: 'AVERSES DE NEIGE FAIBLES',
    64: 'AVERSES DE NEIGE',
    65: 'AVERSES DE NEIGE FORTES',
    66: 'AVERSES DE NEIGE FAIBLES ET FRÉQUENTES',
    67: 'AVERSES DE NEIGE FRÉQUENTES',
    68: 'AVERSES DE NEIGE FORTES ET FRÉQUENTES',
    70: 'AVERSES DE PLUIE ET NEIGE MÊLÉES LOCALISÉES ET FAIBLES',
    71: 'AVERSES DE PLUIE ET NEIGE MÊLÉES LOCALISÉES',
    72: 'AVERSES DE PLUIE ET NEIGE MÊLÉES LOCALISÉES ET FORTES',
    73: 'AVERSES DE PLUIE ET NEIGE MÊLÉES FAIBLES',
    74: 'AVERSES DE PLUIE ET NEIGE MÊLÉES',
    75: 'AVERSES DE PLUIE ET NEIGE MÊLÉES FORTES',
    76: 'AVERSES DE PLUIE ET NEIGE MÊLÉES FAIBLES ET NOMBREUSES',
    77: 'AVERSES DE PLUIE ET NEIGE MÊLÉES FRÉQUENTES',
    78: 'AVERSES DE PLUIE ET NEIGE MÊLÉES FORTES ET FRÉQUENTES',
    100: 'ORAGES FAIBLES ET LOCAUX',
    101: 'ORAGES LOCAUX',
    102: 'ORAGES FORT ET LOCAUX',
    103: 'ORAGES FAIBLES',
    104: 'ORAGES',
    105: 'ORAGES FORTS',
    106: 'ORAGES FAIBLES ET FRÉQUENTS',
    107: 'ORAGES FRÉQUENTS',
    108: 'ORAGES FORTS ET FRÉQUENTS',
    120: 'ORAGES FAIBLES ET LOCAUX DE NEIGE OU GRÊLE',
    121: 'ORAGES LOCAUX DE NEIGE OU GRÊLE',
    122: 'ORAGES LOCAUX DE NEIGE OU GRÊLE',
    123: 'ORAGES FAIBLES DE NEIGE OU GRÊLE',
    124: 'ORAGES DE NEIGE OU GRÊLE',
    125: 'ORAGES DE NEIGE OU GRÊLE',
    126: 'ORAGES FAIBLES ET FRÉQUENTS DE NEIGE OU GRÊLE',
    127: 'ORAGES FRÉQUENTS DE NEIGE OU GRÊLE',
    128: 'ORAGES FRÉQUENTS DE NEIGE OU GRÊLE',
    130: 'ORAGES FAIBLES ET LOCAUX DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    131: 'ORAGES LOCAUX DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    132: 'ORAGES FORT ET LOCAUX DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    133: 'ORAGES FAIBLES DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    134: 'ORAGES DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    135: 'ORAGES FORTS DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    136: 'ORAGES FAIBLES ET FRÉQUENTS DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    137: 'ORAGES FRÉQUENTS DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    138: 'ORAGES FORTS ET FRÉQUENTS DE PLUIE ET NEIGE MÊLÉES OU GRÊLE',
    140: 'PLUIES ORAGEUSES',
    141: 'PLUIE ET NEIGE MÊLÉES À CARACTÈRE ORAGEUX',
    142: 'NEIGE À CARACTÈRE ORAGEUX',
    210: 'PLUIE FAIBLE INTERMITTENTE',
    211: 'PLUIE MODÉRÉE INTERMITTENTE',
    212: 'PLUIE FORTE INTERMITTENTE',
    220: 'NEIGE FAIBLE INTERMITTENTE',
    221: 'NEIGE MODÉRÉE INTERMITTENTE',
    222: 'NEIGE FORTE INTERMITTENTE',
    230: 'PLUIE ET NEIGE MÊLÉES',
    231: 'PLUIE ET NEIGE MÊLÉES',
    232: 'PLUIE ET NEIGE MÊLÉES',
    235: 'AVERSES DE GRÊLE'
  };
  return conditions[weatherCode] || 'CONDITION INCONNUE';
}


function choixImage(weatherCode) {
  if (weatherCode <= 1) {
    image = 'images/sunny.svg';
    alt_text = 'Image de soleil';
  }

  else if (weatherCode >= 2 && weatherCode <= 7)  {
    image = 'images/cloudy.svg';
    alt_text = 'Image de météo nuageuse';
  }

  else if (weatherCode >= 10)  {
    image = 'images/rainy.svg';
    alt_text = 'Image de pluie';
  }

  return [image, alt_text]
}