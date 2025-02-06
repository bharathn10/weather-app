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

        const weather = data.weather[0].main;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherResult.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${iconUrl}" alt="Weather icon">
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].main}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;

        changeBackground(weather);
    } catch (error) {
        weatherResult.innerHTML = `<p>City not found!</p>`;
    }

       // getForecast(city);
    //} catch (error) {
        //weatherResult.innerHTML = `<p>City not found!</p>`;
   // }
}

async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        let forecastHTML = "<h3>5-Day Forecast</h3><div class='forecast-container'>";
        for (let i = 0; i < data.list.length; i += 8) {
            let date = data.list[i].dt_txt.split(" ")[0];
            let temp = data.list[i].main.temp;
            let weather = data.list[i].weather[0].main;
            let iconCode = data.list[i].weather[0].icon;
            let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            forecastHTML += `
                <div class="forecast-item">
                    <p>${date}</p>
                    <img src="${iconUrl}" alt="Weather icon">
                    <p>${temp}°C</p>
                    <p>${weather}</p>
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


function changeBackground(weather) {
    const body = document.body;

    if (weather.includes("Clear")) {
        body.style.background = "linear-gradient(to right, #f7b733, #fc4a1a)";
    } else if (weather.includes("Clouds")) {
        body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } else if (weather.includes("Rain")) {
        body.style.background = "linear-gradient(to right, #4b6cb7, #182848)";
    } else if (weather.includes("Snow")) {
        body.style.background = "linear-gradient(to right, #E6DADA, #274046)";
    } else {
        body.style.background = "linear-gradient(to right, #56CCF2, #2F80ED)";
    }
}

const saveBtn = document.getElementById("save-btn");

saveBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (city) {
        let savedCities = JSON.parse(localStorage.getItem("cities")) || [];
        if (!savedCities.includes(city)) {
            savedCities.push(city);
            localStorage.setItem("cities", JSON.stringify(savedCities));
            displaySavedCities();
        }
    }
});

function displaySavedCities() {
    const savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    let savedHTML = "<h3>Saved Cities</h3><ul>";
    savedCities.forEach(city => {
        savedHTML += `<li>${city} <button onclick="getWeather('${city}')">View</button></li>`;
    });
    savedHTML += "</ul>";
    document.getElementById("saved-cities").innerHTML = savedHTML;
}

// Call function to load saved cities on page load
displaySavedCities();

// Show the weather result with a smooth fade-in
weatherResult.classList.add('visible');
