🌤️ Weather today.
A beautiful, responsive weather dashboard that displays current weather conditions and 5-day forecasts for cities worldwide. Features a favorite cities system with persistent storage using JSON Server.

 ## Features
Current Weather Display: Real-time temperature, humidity, wind speed, and weather conditions

5-Day Forecast: Detailed weather predictions for the upcoming week

City Search: Find weather information for any city worldwide

Geolocation Support: Automatic weather detection using your current location

Responsive Design: Works seamlessly on desktop, tablet, and mobile devices

 ## Favorite Cities System
Add to Favorites: Save frequently searched cities with one click

Persistent Storage: Favorites are saved using JSON Server

Quick Access: Load favorite cities instantly

Manage Favorites: Add or remove cities from your favorites list

## Visual Features
Dynamic Backgrounds: Weather-appropriate background images

Beautiful UI: Clean, modern design with smooth animations

Weather Icons: Visual representations of current conditions

Gradient Overlays: Enhanced readability with stylish overlays

 ## Technologies Used
Frontend
1.HTML: Semantic markup and structure

2.CSS: Modern styling with Flexbox and Grid

JavaScript: Async/await, DOM manipulation, event handling

## APIs & Services
1.Open-Meteo API: Free weather data.

2.Geocoding API: City name to coordinates conversion.

3.JSON Server: Mock backend for favorite cities persistence

 ## Development Tools
Git: Version control

JSON Server: Local development server

Modern Browser APIs: Geolocation, Fetch API

 ## Project Structure

index.html         
style.css           
script.js           
db.json             
README.md           
 
 
 ## Endpoints Used
javascript
// Current weather + forecast
https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto

// Geocoding (city search)
https://geocoding-api.open-meteo.com/v1/search?name=CityName
JSON Server Endpoints
Base URL: http://localhost:8000

Favorite Cities: GET/POST/DELETE /favoriteCities


 ## License
This project is open source and available under the MIT License.

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page for open issues.

Development Setup
Fork the repository

Create a feature branch: git checkout -b feature/amazing-feature

Commit changes: git commit -m 'Add amazing feature'

Push to branch: git push origin feature/amazing-feature

Open a pull request

 ##  Support
If you have any questions or need help with setup :

Check the troubleshooting section

Open an issue on GitHub

Contact: (castrokimaru@gmail.com)

Built using HTML, CSS, and JavaScript.

Weather data provided by Open-Meteo.com
Background images from Unsplash.

