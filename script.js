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
