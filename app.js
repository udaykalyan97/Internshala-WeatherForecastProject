// Get current Location button
const currentLocation = document.getElementById('currentLocation');
currentLocation.addEventListener('click', () => {
    clearExtendedForecast();
    getLocationWeather();
});

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
        // Limit to the last 6 entries
        const limitedHistory = searchHistory.slice(-6);
        limitedHistory.forEach(city => {
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
        clearExtendedForecast(); // Clear and hide extended forecast display
        fetchWeatherDataByCity(cityName);
        storeSearchHistory(cityName);
        cityInput.blur(); // Close the dropdown after selection
    } else {
        alert('Enter a valid city name');
    }
});

// Clear and hide extended forecast display
function clearExtendedForecast() {
    document.getElementById('extendedForecast').classList.add('hidden');
    document.getElementById('forecastDisplay').innerHTML = ''; // Clear previous data
}

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
            document.getElementById('extendedForecastButton').classList.remove('hidden'); // Show button after getting current weather 
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
            document.getElementById('extendedForecastButton').classList.remove('hidden'); // Show button after fetching weather
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
    const date = new Date(data.dt * 1000).toLocaleDateString();
    document.getElementById('dateTime').textContent = `Date: ${date}`;
    document.getElementById('cityName').textContent = `City: ${data.name}`;
    document.getElementById('condition').textContent = `Forecast: ${data.weather[0].description}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;

    const img = document.getElementById('icon');
    img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById('weatherDisplay').classList.remove('hidden');
}

// Extended Forecast Button
document.getElementById('extendedForecastButton').addEventListener('click', () => {
    const cityName = document.getElementById('cityName').textContent.split(": ")[1];
    if (cityName) {
        fetchExtendedForecast(cityName);
    } else {
        alert('Please enter a valid city name to view the extended forecast.');
    }
});

// Fetch extended forecast data
function fetchExtendedForecast(cityName) {
    getCoordinates(cityName)
        .then(coords => {
            const lat = coords.lat;
            const lon = coords.lon;
            const apiKey = '839272a6b4e47d466830cfdf3fa24dfd';
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            return fetch(url);
        })
        .then(response => response.json())
        .then(data => {
            updateForecastDisplay(data);
        })
        .catch(error => {
            console.error("Error fetching extended forecast data:", error);
            alert("Error fetching extended forecast data.");
        });
}

// Update forecast display with fetched data
function updateForecastDisplay(data) {
    const forecastDisplay = document.getElementById('forecastDisplay');
    forecastDisplay.innerHTML = ''; // Clear previous data
    const seenDates = new Set(); // To track displayed dates

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();

        // Only show future dates and skip duplicates
        if (!seenDates.has(date) && new Date(item.dt * 1000) > new Date()) {
            seenDates.add(date);

            // Create forecast item element
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('bg-white', 'bg-opacity-20', 'p-4', 'rounded-lg', 'shadow-lg', 'transition', 'transform', 'hover:scale-105', 'duration-300',
                'md:hover:scale-102', // Less scale on medium screens
                'lg:hover:scale-105', // More scale on large screens
                'xl:hover:scale-110'  // Even more scale on extra-large screens
            );
            forecastItem.innerHTML = `
                <p class="font-semibold text-lg">${date}</p>
                <p>Temperature: ${item.main.temp} °C</p>
                <p>Wind: ${item.wind.speed} m/s</p>
                <p>Humidity: ${item.main.humidity}%</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}" class="w-16 h-16 animate-pulse">
            `;

            forecastDisplay.appendChild(forecastItem);
        }
    });

    document.getElementById('extendedForecast').classList.remove('hidden');
    document.getElementById('extendedForecastButton').classList.add('hidden'); // Hide button after fetching
}


const forecastDisplay = document.getElementById('forecastDisplay');
const scrollLeft = document.getElementById('scrollLeft');
const scrollRight = document.getElementById('scrollRight');

// Scroll to the left
scrollLeft.addEventListener('click', () => {
    forecastDisplay.scrollBy({
        left: -200, // Adjust the scroll distance as needed
        behavior: 'smooth' // Smooth scrolling effect
    });
});

// Scroll to the right
scrollRight.addEventListener('click', () => {
    forecastDisplay.scrollBy({
        left: 200, // Adjust the scroll distance as needed
        behavior: 'smooth'
    });
});
