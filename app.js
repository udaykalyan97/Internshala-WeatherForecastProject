// Get current Location button
const currentLocation = document.getElementById('currentLocation');
currentLocation.addEventListener('click', getLocationWeather);

// Search input and history dropdown
const cityInput = document.getElementById('cityInput');
const historyDropdown = document.getElementById('historyDropdown');

// Load search history from sessionStorage
const searchHistory = JSON.parse(sessionStorage.getItem('searchHistory')) || [];

// Function to store search history
function storeSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        sessionStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// Function to display search history
function displaySearchHistory() {
    historyDropdown.innerHTML = '';
    if (searchHistory.length > 0) {
        searchHistory.forEach(city => {
            const historyItem = document.createElement('div');
            historyItem.textContent = city;
            historyItem.classList.add('p-2', 'cursor-pointer', 'hover:bg-gray-200');
            historyItem.addEventListener('click', () => {
                cityInput.value = city;
                historyDropdown.classList.add('hidden'); // Hide the dropdown after selection
            });
            historyDropdown.appendChild(historyItem);
        });
        historyDropdown.classList.remove('hidden'); // Show the dropdown
    } else {
        historyDropdown.classList.add('hidden'); // Hide the dropdown if no history
    }
}

// Show search history when input is focused
cityInput.addEventListener('focus', displaySearchHistory);

// Hide history dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!historyDropdown.contains(event.target) && event.target !== cityInput) {
        historyDropdown.classList.add('hidden');
    }
});

// Fetch weather data when search button is clicked
document.getElementById('searchButton').addEventListener('click', () => {
    const cityName = cityInput.value;
    if (cityName) {
        fetchWeatherDataByCity(cityName);
        storeSearchHistory(cityName);
        cityInput.blur(); // Close the dropdown after selection
    }else{
        alert('Enter a valid city name');
    }
});

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
            updateWeatherDisplay(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Error fetching weather data.");
        });
}

// Show error if geolocation fails
function showError(error) {
    alert(`Error: ${error.message}`);
}

// Fetch weather data by city name
function fetchWeatherDataByCity(cityName) {
    getCoordinates(cityName)
        .then(coords => {
            const lat = coords.lat;
            const lon = coords.lon;
            const apiKey = '839272a6b4e47d466830cfdf3fa24dfd'; 
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            return fetch(url);
        })
        .then(response => response.json())
        .then(data => {
            updateWeatherDisplay(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Error fetching weather data.");
        });
}

// Get coordinates of a city
function getCoordinates(cityName) {
    const apiKey = '839272a6b4e47d466830cfdf3fa24dfd'; 
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                return { lat, lon };
            } else {
                throw new Error("City not found");
            }
        })
        .catch(error => {
            console.error("Error fetching coordinates:", error);
            alert("Error fetching coordinates.");
        });
}

// Update weather display with fetched data
function updateWeatherDisplay(data) {
    // Calculate the correct local time
    const utcTime = data.dt * 1000; // UTC time in milliseconds
    const timezoneOffset = data.timezone * 1000; // Timezone offset in milliseconds
    const localTime = new Date(utcTime + timezoneOffset);

    // Format the date and time
    const formattedDate = localTime.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    document.getElementById('cityName').textContent = `City: ${data.name}`;
    document.getElementById('condition').textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('date').textContent = `Date: ${formattedDate}`;
    document.getElementById('time').textContent = `Time: ${formattedTime}`;

    const img = document.getElementById('icon');
    img.classList.add('animate-pulse');
    img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById('weatherDisplay').classList.remove('hidden');
}
