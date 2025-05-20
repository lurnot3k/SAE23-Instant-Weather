function createCard(data) {
  // Récupérer les options sélectionnées
  const options = getFormData();
  
  // Créer un tableau des options supplémentaires sélectionnées
  const option_sup = [];
  if (options.latitude) option_sup.push('latitude');
  if (options.longitude) option_sup.push('longitude');
  if (options.cumulPluie) option_sup.push('rain');
  if (options.ventMoyen) option_sup.push('wind');
  if (options.dirVent) option_sup.push('winddirection');

  // Créer la structure HTML de la carte
  const cardHTML = `
    <div class="weather-card">
      <div class="weather-header">
        <div class="weather-city">${data.city.name.toUpperCase()}</div>
        <div class="weather-date">${formatDate(new Date())}</div>
      </div>
      
      <div class="weather-condition">
        <img id="img_card" src="${choixImage(data.forecast.weather)}" />
      </div>
      
      <div class="weather-temps">
        <div class="temp">
          <div class="temp-label">T min</div>
          <div class="temp-value">${data.forecast.tmin}°C</div>
        </div>
        <div class="temp">
          <div class="temp-label">T max</div>
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
      
  `;

  // Ajouter la carte à la section météo
  const weatherSection = document.getElementById("weatherInformation");
  weatherSection.innerHTML = cardHTML;
  
  // Cacher le formulaire et afficher la section météo
  document.getElementById("cityForm").style.display = "none";
  weatherSection.style.display = "flex";

  // Ajouter le bouton de nouvelle recherche
  const reloadButton = document.createElement("button");
  reloadButton.textContent = "Nouvelle recherche";
  reloadButton.classList.add("reloadButton");
  reloadButton.addEventListener("click", () => location.reload());
  weatherSection.appendChild(reloadButton);
}

// Fonctions utilitaires (garder les mêmes que précédemment)
function displayHours(sunHours) {
  return sunHours + (sunHours > 1 ? " heures" : " heure");
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}



function choixImage(weatherCode) {
  if (weatherCode <= 1) {
    image = 'images/sunny.svg';
  }

  else if (weatherCode >= 2 && weatherCode <= 7)  {
    image = 'images/cloudy.svg';
  }

  else if (weatherCode >= 10)  {
    image = 'images/rainy.svg';
  }

  return image
}