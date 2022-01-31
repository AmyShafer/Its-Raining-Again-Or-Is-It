let breaking = document.querySelector('.news-scroll');
const todayDate = moment().format('MMM Do');
const getWeatherBtn = document.getElementById("hallelujah");
const APIkey = "414af75288c260f4c9c7eed4eff2b900";
const weatherIcon = document.querySelectorAll('.weather-icon');
const pastSearches = document.querySelector('.past-searches');

const breakingNewsMessages = [
`<i class="fas fa-music"></i> HAPPY BIRTHDAY TO PAUL JABARA, THE CO-COMPOSER OF IT'S RAINING MEN! <i class="fas fa-music"></i>`,
`<i class="fas fa-rainbow"></i> HAPPY BIRTHDAY TO WEATHER GIRL, IZORA ARMSTEAD! HALLELUJAH FOR IZORA! <i class="fas fa-rainbow"></i>`,
`<i class="fas fa-bolt"></i> IT'S RAINING MEN WAS RELEASED ON SEPTEMBER 10TH, 1982! TODAY, THE ICONIC SONG TURNS 40! <i class="fas fa-bolt"></i>`,
`<i class="fas fa-glasses"></i> HAPPY BIRTHDAY TO PAUL SHAFFER, THE CO-COMPOSER OF IT'S RAINING MEN! <i class="fas fa-glasses"></i>`,
`<i class="fas fa-cloud-moon"></i> HAPPY BIRTHDAY TO WEATHER GIRL, MARTHA WASH! HALLELUJAH FOR MARTHA! <i class="fas fa-cloud-moon"></i>`
];

const cities = [];

function getAPI (event) {
  event.preventDefault();
  let userCity = document.getElementById("user-city").value;
  // adds recent city search to the past searches
  pastWeatherSearches(userCity);
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
    const daysForecast = weather.daily[i].weather[0].main;
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
  breakingNews(forecast);
  uvColorCode(daysUVIndex);
  pastWeatherSearches();
}


// Saves user's past city inputs
function pastWeatherSearches (recentSearch) {
  console.log("HERE: ");
  let citiesList = document.querySelector(".past-cities-list");
  cities.push(recentSearch);
  localStorage.setItem("Past Searches", JSON.stringify(cities));
  let citiesSearched = localStorage.getItem("Past Searches");
  
    const currentCity = recentSearch.toUpperCase();
    const pastCity = document.createElement("li");
    pastCity.textContent = currentCity;

    citiesList.appendChild(pastCity);
}

// Outputs important days in the breaking news header
function breakingNews (forecast) {
  console.log("BREAKING NEWS!");
  // Paul Jabara's Birthday is January 31st
  if (todayDate === "Jan 31st") {
    breaking.innerHTML = breakingNewsMessages[0];
  // Izora Armstead's Birthday is July 6th  
  } else if (todayDate === "Jul 6th") {
    breaking.innerHTML = breakingNewsMessages[1];
  // It's Raining Men's Release Date was September 10th 1982
  } else if (todayDate === "Sep 10th") {
    breaking.innerHTML = breakingNewsMessages[2];
  // Paul Shaffer's Birthday is November 28th   
  } else if (todayDate === "Nov 28th") {
    breaking.innerHTML = breakingNewsMessages[3];
  // Martha Wash's Birthday is December 28th  
  } else if (todayDate === "Dec 28th") {
    breaking.innerHTML = breakingNewsMessages[4];
  // Weather Update
  } else { 
    breaking.textContent = `TODAY YOU CAN EXPECT ${forecast.toUpperCase()}!`;
  }
}

// Convert the temperature Celsius to Fahrenheit
function celsiusToFahrenheit (celTemp) {
  let convertedTemp =  (celTemp * 9 )/ (5 + 32);
  return Math.ceil(convertedTemp) + "°F";
} 

getWeatherBtn.addEventListener("click", getAPI);
window.addEventListener('load', breakingNews)

