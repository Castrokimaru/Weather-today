const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const weatherIcon = document.getElementById('weatherIcon');
const forecastContainer = document.getElementById('forecast');

const GEOCODE_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

searchBtn.addEventListener('click', handleSearch);
currentLocationBtn.addEventListener('click', getCurrentLocation);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherByCity('Nairobi'); 
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        showError('Please enter a city name.');
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            showError('Unable to retrieve your location. Please search for a city instead.');
        }
    );
}

async function fetchWeatherByCity(city) {
    try {
    
        const geocodeResponse = await fetch(`${GEOCODE_API_URL}?name=${encodeURIComponent(city)}&count=1`);
        const geocodeData = await geocodeResponse.json();

        if (!geocodeData.results || geocodeData.results.length === 0) {
            showError('City not found. Please try again.');
            return;
        }

        const { latitude, longitude, name, country } = geocodeData.results[0];
        await fetchWeatherData(latitude, longitude, name, country);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Failed to fetch weather data. Please try again later.');
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        
        const geocodeResponse = await fetch(`${GEOCODE_API_URL}?latitude=${lat}&longitude=${lon}&count=1`);
        const geocodeData = await geocodeResponse.json();
        
        const name = geocodeData.results ? geocodeData.results[0].name : 'Your Location';
        const country = geocodeData.results ? geocodeData.results[0].country : '';
        
        await fetchWeatherData(lat, lon, name, country);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Failed to fetch weather data. Please try again later.');
    }
}


async function fetchWeatherData(lat, lon, locationName, countryCode) {
    try {
        
        const response = await fetch(
            `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.reason || 'Weather data unavailable');
        }

        
        hideError();
        
        
        updateCurrentWeather(data, locationName, countryCode);
        
        
        updateForecast(data.daily);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load weather data. Please try again.');
    }
}

function updateCurrentWeather(data, name, country) {
    const current = data.current;
    
    cityName.textContent = `${name}${country ? `, ${country}` : ''}`;
    temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
    weatherDescription.textContent = getWeatherDescription(current.weather_code);
    feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    humidity.textContent = `${current.relative_humidity_2m}%`;
    windSpeed.textContent = `${current.wind_speed_10m} km/h`;
    
    
    weatherIcon.src = getWeatherIconUrl(current.weather_code);
    weatherIcon.alt = weatherDescription.textContent;
}


function updateForecast(dailyData) {

    forecastContainer.innerHTML = '';
    
    
    const forecastHTML = dailyData.time.map((date, index) => {
        if (index >= 5) return '';
        
        const maxTemp = Math.round(dailyData.temperature_2m_max[index]);
        const minTemp = Math.round(dailyData.temperature_2m_min[index]);
        const weatherCode = dailyData.weather_code[index];
        
        const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' });
        
        return `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <img src="${getWeatherIconUrl(weatherCode)}" alt="${getWeatherDescription(weatherCode)}" width="40">
                <div class="forecast-temp">${maxTemp}°C</div>
                <div>${minTemp}°C</div>
            </div>
        `;
    }).join('');
    
    forecastContainer.innerHTML = forecastHTML;
}


function getWeatherDescription(weatherCode) {
    const weatherMap = {
        0: 'Clear sky',
        1: 'Mainly clear', 
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherMap[weatherCode] || 'Unknown';
}


function getWeatherIconUrl(weatherCode) {
    const iconMap = {
        0: 'https://cdn2.iconfinder.com/data/icons/weather-emoticon/64/07_sun_smile_happy_emoticon_weather_smiley-64.png',
        1: 'https://cdn3.iconfinder.com/data/icons/picons-weather/57/37_mainly_clear_night-64.png',
        2: 'https://cdn2.iconfinder.com/data/icons/swanky-outlines/256/0013_Partly-Cloudy.png', 
        3: 'https://cdn2.iconfinder.com/data/icons/weather-119/512/weather-2-64.png',
        45: 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_49-64.png',
        48: 'https://cdn3.iconfinder.com/data/icons/weather-610/64/weather_cloud_fog-64.png',
        95: 'https://cdn3.iconfinder.com/data/icons/tiny-weather-1/512/flash-cloud-64.png',
        80: 'https://cdn4.iconfinder.com/data/icons/weather-940/24/Day_Rain-64.png',
        81: 'https://cdn2.iconfinder.com/data/icons/weather-1070/64/weather_moderate_rainfall-64.png',
        82: 'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_24-64.png',
        51: 'https://cdn2.iconfinder.com/data/icons/rainy-weather/256/Day_Drizzle-64.png',
        53: 'https://cdn2.iconfinder.com/data/icons/rainy-weather/256/Day_Drizzle-64.png',
        55: 'https://cdn2.iconfinder.com/data/icons/rainy-weather/256/Day_Drizzle-64.png',
        61: 'https://cdn2.iconfinder.com/data/icons/rainy-weather/256/Day_Rain-64.png',
        63: 'https://cdn2.iconfinder.com/data/icons/rainy-weather/256/Day_Rain-64.png',
        65: 'https://cdn2.iconfinder.com/data/icons/rainy-weather/256/Day_Rain-64.png',
        96: 'https://cdn0.iconfinder.com/data/icons/large-weather-icons/64/Hail.png',
        99: 'https://cdn2.iconfinder.com/data/icons/10-plagues-of-egypt/489/ten-plagues-egypt-005-64.png'      
    
    };
    return iconMap[weatherCode] || 'https://open-meteo.com/images/weather-icon/not-available.svg';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}


const baseUrl = 'http://localhost:8000/favoriteCities';


async function fetchFavorites() {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const favorites = await response.json();
        displayFavorites(favorites); 
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
}

async function addToFavorites(cityData) {

    const existingFavorites = await fetch(baseUrl).then(res => res.json());
    const isDuplicate = existingFavorites.some(fav => fav.name === cityData.name);

    if (isDuplicate) {
        alert('This city is already in your favorites!');
        return;
    }

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cityData) 
        });
        if (!response.ok) throw new Error('Failed to add favorite');
        const newFavorite = await response.json();
        fetchFavorites();
    } catch (error) {
        console.error('Error adding favorite:', error);
    }
}

async function deleteFavorite(id) {
    try {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete favorite');
        fetchFavorites(); 
    } catch (error) {
        console.error('Error deleting favorite:', error);
    }
}

function displayFavorites(favorites) {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = ''; 

    favorites.forEach(city => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${city.name}</span>
            <button onclick="loadFavorite('${city.name}')">  load</button>
            <button onclick="deleteFavorite(${city.id})">    Delete</button>
        `;
        favoritesList.appendChild(listItem);
    });
}


function loadFavorite(cityName) {
    fetchWeatherByCity(cityName); 
}

document.getElementById('addToFavoritesBtn').addEventListener('click', () => {
    const cityData = {
        name: document.getElementById('cityName').textContent.split(',')[0], 
    
        timestamp: new Date().toISOString()
    };
    addToFavorites(cityData);
});

document.addEventListener('DOMContentLoaded', fetchFavorites);