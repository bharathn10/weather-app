const apiKey = "5d6b3d104d493bdd5c0ca6b82cef39d6"; // Get API key from OpenWeatherMap
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const forecast = document.getElementById("forecast");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city);
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        weatherResult.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].main}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;

        getForecast(city);
    } catch (error) {
        weatherResult.innerHTML = `<p>City not found!</p>`;
    }
}

async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        let forecastHTML = "<h3>5-Day Forecast</h3><div class='forecast-container'>";
        for (let i = 0; i < data.list.length; i += 8) {
            forecastHTML += `
                <div class="forecast-item">
                    <p>${data.list[i].dt_txt.split(" ")[0]}</p>
                    <p>${data.list[i].main.temp}°C</p>
                    <p>${data.list[i].weather[0].main}</p>
                </div>
            `;
        }
        forecastHTML += "</div>";
        forecast.innerHTML = forecastHTML;
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
