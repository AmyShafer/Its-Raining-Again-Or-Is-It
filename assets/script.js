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
      weatherData.icon = icon;
      console.log(uvIndex + " -- " + icon);
      displayWeather(data);
    })
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
  console.log("Icon: " + weatherObj.icon);
  uvIndex(weatherObj);
}

function displayWeather (weather) {
  console.log(weather);
  let getCards = document.querySelectorAll(".card");
  for (let i = 0; i < getCards.length; i++) {
    const currentCard = getCards[i];
    const dateString = moment.unix(weather.daily[i].dt).format("MMM Do YYYY");
    const currentIcon = weather.daily[i].weather[0].icon;
    //const {icon} = data.weather[0];
    currentCard.childNodes[1].textContent = dateString;
    weatherIcon[i].setAttribute("src", `http://openweathermap.org/img/wn/${currentIcon}.png`);
    //currentCard.childNodes[2].textContent = `https://openweathermap.org/img/w/${currentIcon}.png`;
  }
}

/*
function pastWeatherSearches () {

}
*/

// Convert the temperature Celsius to Fahrenheit
function celsiusToFahrenheit (celTemp) {
  let convertedTemp =  (celTemp * 9 )/ (5 + 32);
  return Math.ceil(convertedTemp) + "°F";
} 

getWeatherBtn.addEventListener("click", getAPI);



