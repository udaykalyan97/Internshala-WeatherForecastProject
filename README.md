
# Weather Forecast Application

This Weather Forecast Application provides users with real-time weather information based on the OpenWeatherMap API. Users can search for weather details by city name or use their current location. The app also features an extended weather forecast for the upcoming days.

## Features

- **Current Weather Information:** View the current weather conditions, including temperature, wind speed, and humidity, for any city or your current location.
- **Search History:** Easily access and select from your recent searches via a dropdown menu.
- **Extended Forecast:** View an extended weather forecast with detailed information for future dates.
- **Responsive Design:** Optimized for various screen sizes with smooth animations.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/udaykalyan97/weather-forecast.git
   cd weather-forecast
   ```

2. Open the `index.html` file in your browser.

## Usage

### Searching for a City

1. Enter a city name in the input field and click the "Search" button. 
2. The current weather data for the city will be displayed.
3. The city name will be saved in your search history, allowing for quick access in future sessions.

### Using Your Current Location

1. Click the "Use Current Location" button to automatically fetch weather data for your current location.
2. If the location is successfully retrieved, the weather data will be displayed, and the option to view an extended forecast will become available.

### Viewing the Extended Forecast

1. After obtaining the current weather data for a city, click the "Show Extended Forecast" button.
2. The extended forecast section will display weather information for the upcoming days, including temperature, wind speed, and humidity.

## Code Overview

### HTML Structure

The application is structured into several sections:

- **Header Section:** Displays the title and a brief description of the application.
- **Search Section:** Contains the input field for city names, search button, search history dropdown, and the "Use Current Location" button.
- **Weather Display Section:** Shows the current weather data.
- **Extended Forecast Section:** Provides detailed weather forecasts for the upcoming days.
- **Extended Forecast Button:** Allows the user to display the extended forecast.

### JavaScript Functionality

- **Event Listeners:** Handles user interactions, such as searching for a city, using the current location, and viewing the extended forecast.
- **Data Fetching:** Utilizes the OpenWeatherMap API to fetch weather data based on the city name or current coordinates.
- **Weather Display:** Updates the DOM with the fetched weather data, including the current weather and extended forecast.
- **Search History:** Manages the user's search history using `sessionStorage`, enabling quick access to previous searches.

### Tailwind CSS

The project uses Tailwind CSS for styling, ensuring a modern and responsive design. Custom animations for fading in elements and sliding them into view are also implemented.

### API Usage

This application leverages the OpenWeatherMap API for both current weather data and extended forecasts. Ensure that you replace the placeholder API key in the `app.js` file with your own key from OpenWeatherMap.

```javascript
const apiKey = 'your-api-key-here';
```

## Dependencies

- **Tailwind CSS:** For styling and layout.
- **FontAwesome:** For icons used in buttons and other UI elements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
