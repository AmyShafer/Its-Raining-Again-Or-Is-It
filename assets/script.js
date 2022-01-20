var userCity = document.getElementById("user-city").value;
var getWeatherBtn = document.getElementById("hallelujah");
var APIkey = "414af75288c260f4c9c7eed4eff2b900";
var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCity},us&APPID=${APIkey}`;

function getAPI () {

  fetch(requestUrl) 
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
        weather = data;
        currentWeatherSearch(weather);
    })
}

function currentWeatherSearch(weather) {
  var weatherObj = {
    temp: celsiusToFahrenheit(weather.main.temp),
    wind: weather.wind.speed,
    humidity: weather.main.humidity,
    uvIdex: weather.main.uvIndex
  }
  console.log(weatherObj);
}

function pastWeatherSearches () {

}

function celsiusToFahrenheit (celTemp) {
  var convertedTemp =  (celTemp * 9 )/ (5 + 32);
  return Math.ceil(convertedTemp) + "°F";
} 

getWeatherBtn.addEventListener("click", getAPI());


// https://api.openweathermap.org/data/2.5/weather?q=$newyork,us&APPID=414af75288c260f4c9c7eed4eff2b900
