const breaking = document.querySelector('.news-scroll');
const getWeatherBtn = document.getElementById("hallelujah");
const APIkey = "414af75288c260f4c9c7eed4eff2b900";
const weatherIcon = document.querySelectorAll('.weather-icon');

function getAPI (event) {
  event.preventDefault();
  let userCity = document.getElementById("user-city").value;
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userCity},us&appid=${APIkey}`) 
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weather = data;
      currentWeatherSearch(weather);
    })
}

// The UV Index requires an One Call API request unlike the other information
function uvIndex (weatherData) {
  let oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.lat}&lon=${weatherData.long}&appid=${APIkey}`;

  fetch(oneCallAPI) 
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let uvIndex = data.current.uvi;
      let icon = data.current.weather[0].icon;
      weatherData.uvIndex = uvIndex;
      displayWeather(data);
    })
}

// UV color code
function uvColorCode (daysUVIndex) {
  // the default color is green, if the UV Index is under 2
  if (daysUVIndex >= 2 && daysUVIndex < 6) {
    currentCard.children[1].children[1].children[3].children[0].setAttribute("style", "background-color: yellow; color: black");
  } else if (daysUVIndex >= 6 && daysUVIndex < 8) {
    currentCard.children[1].children[1].children[3].children[0].setAttribute("style", "background-color: orange color: black;");
  } else if (daysUVIndex >= 8 && daysUVIndex < 11) {
    currentCard.children[1].children[1].children[3].children[0].setAttribute("style", "background-color: red;");
  } 
}

// Organizes all the needed information into an object
function currentWeatherSearch(weather) {
  let weatherObj = {
    lat: weather.coord.lat,
    long: weather.coord.lon,
    icon: weather.weather[0].icon,
    temp: celsiusToFahrenheit(weather.main.temp),
    wind: weather.wind.speed,
    humidity: weather.main.humidity,
    uvIndex: 0
  }
  uvIndex(weatherObj);
}

function displayWeather (weather) {
  let getCards = document.querySelectorAll(".card");
  for (let i = 0; i < getCards.length; i++) {
    const currentCard = getCards[i];
    // displays the cards themselves
    currentCard.setAttribute("style", "visibility: visible")
    // needed information for each item
    const dateString = moment.unix(weather.daily[i].dt).format("MMM Do YYYY");
    const daysForecast = weather.daily[i].main;
    const daysIcon = weather.daily[i].weather[0].icon;
    const daysTemp = weather.daily[i].temp.day;
    const daysWind = weather.daily[i].wind_speed;
    const daysHumidity = weather.daily[i].humidity;
    const daysUVIndex = weather.daily[i].uvi;
    // content for each card
    currentCard.childNodes[1].textContent = dateString;
    weatherIcon[i].setAttribute("src", `http://openweathermap.org/img/wn/${daysIcon}.png`);
    currentCard.children[1].children[1].children[0].children[0].textContent = celsiusToFahrenheit(daysTemp);
    currentCard.children[1].children[1].children[1].children[0].textContent = ` ${daysWind} MPH`;
    currentCard.children[1].children[1].children[2].children[0].textContent = ` ${daysHumidity} %`;
    currentCard.children[1].children[1].children[3].children[0].textContent = daysUVIndex;
  }
  uvColorCode(daysUVIndex);
  breakingNews(daysForecast);
}

/*
// Saves user's past city inputs
function pastWeatherSearches () {

}
*/

// Outputs important days in the breaking news header
function breakingNews (forecast) {
  // Paul Shaffer's Birthday is November 28th 
  // Paul Jabara's Birthday is January 31st
  // Martha Wash's Birthday is December 28th
  // Izora Armstead's Birthday is July 6th
  // It's Raining Men's Release Date was September 10th 1982
  // Weather Update
  breaking = `TODAY YOU CAN EXPECT ${forecast.toUpperCase()}`;
}


// Convert the temperature Celsius to Fahrenheit
function celsiusToFahrenheit (celTemp) {
  let convertedTemp =  (celTemp * 9 )/ (5 + 32);
  return Math.ceil(convertedTemp) + "°F";
} 

getWeatherBtn.addEventListener("click", getAPI);

