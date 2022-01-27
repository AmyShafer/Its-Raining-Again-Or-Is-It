var getWeatherBtn = document.getElementById("hallelujah");
var APIkey = "414af75288c260f4c9c7eed4eff2b900";
//var requestUrl = ;

function getAPI (event) {
  event.preventDefault();
  var userCity = document.getElementById("user-city").value;
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userCity},us&appid=${APIkey}`) 
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weather = data;
      console.log(weather);
      currentWeatherSearch(weather);
    })
}

// The UV Index requires an One Call API request unlike the other information
function uvIndex (weatherData) {
  var oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.lat}&lon=${weatherData.long}&appid=${APIkey}`;

  fetch(oneCallAPI) 
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var uvIndex = data.current.uvi;
      weatherData.uvIndex = uvIndex;
      console.log(data);
      displayWeather(data);
      return uvIndex;
    })
}

// Organizes all the needed information into an object
function currentWeatherSearch(weather) {

  var weatherObj = {
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
  var getCards = document.querySelectorAll(".card");
  console.log(getCards);
  for (var i = 0; i < getCards.length; i++) {
    var currentCard = getCards[i];
    var dateString = moment.unix(weather.daily[i].dt).format("MMM Do YY");
    currentCard.childNodes[1].textContent = dateString;
  }
}

/*
function pastWeatherSearches () {

}
*/

// Convert the temperature Celsius to Fahrenheit
function celsiusToFahrenheit (celTemp) {
  var convertedTemp =  (celTemp * 9 )/ (5 + 32);
  return Math.ceil(convertedTemp) + "°F";
} 

getWeatherBtn.addEventListener("click", getAPI);



