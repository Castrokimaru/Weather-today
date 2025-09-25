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
