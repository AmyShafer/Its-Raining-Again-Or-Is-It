var userCity = document.getElementById("user-city").value;
var getWeatherBtn = document.getElementById("hallelujah");
var APIkey = "414af75288c260f4c9c7eed4eff2b900";
var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCity},us&APPID=${APIkey}`;

function getAPI () {
  //var requestUrl = 'api';

  fetch(requestUrl) 
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
}

getWeatherBtn.addEventListener("click", getAPI());


// https://api.openweathermap.org/data/2.5/weather?q=$newyork,us&APPID=414af75288c260f4c9c7eed4eff2b900
