// Get current Location button
const currentLocation = document.getElementById('currentLocation');
currentLocation.addEventListener('click', getLocationWeather);

// Get current location coordinates
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherData, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Get current location data with coordinates
function fetchWeatherData(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '839272a6b4e47d466830cfdf3fa24dfd';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            // Get the time from OpenWeatherMap
            const dateTime = new Date((data.dt + data.timezone) * 1000);
            const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            document.getElementById('cityName').textContent = `City: ${data.name} (${formattedTime})`;
            document.getElementById('condition').textContent = `${data.weather[0].description}`;
            document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
            document.getElementById('wind').textContent = `Wind: ${data.wind_speed}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}`;
            
            var img = document.createElement('img');
            img.classList = `animate-pulse`
            img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.getElementById('weatherIcon').appendChild(img);

            document.getElementById('weatherDisplay').classList.remove('hidden');
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Error fetching weather data.");
        });
}

function showError(error) {
    alert(`Error: ${error}`);
}
