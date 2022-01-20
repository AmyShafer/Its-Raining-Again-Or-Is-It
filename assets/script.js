var userCity = document.getElementById("#userCity");
var APIkey = "414af75288c260f4c9c7eed4eff2b900";
var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=Doylestown,us&APPID=414af75288c260f4c9c7eed4eff2b900";

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

getAPI();



