let breaking = document.querySelector('.news-scroll');
const todayDate = moment().format('MMM Do');
const getWeatherBtn = document.getElementById("hallelujah");
const APIkey = "414af75288c260f4c9c7eed4eff2b900";
const weatherIcon = document.querySelectorAll('.weather-icon');
const pastSearchesContainer = document.querySelector('.past-searches');
const citiesSearchList = document.querySelector(".past-cities");
const cityButtons = document.querySelectorAll(".btn-history");

// This is an array of messages for the breaking news function
const breakingNewsMessages = [
`<h2> <i class="fas fa-music"></i> HAPPY BIRTHDAY TO PAUL JABARA, THE CO-COMPOSER OF IT'S RAINING MEN! <i class="fas fa-music"></i></h2>`,
`<h2> <i class="fas fa-rainbow"></i> HAPPY BIRTHDAY TO WEATHER GIRL, IZORA ARMSTEAD! HALLELUJAH FOR IZORA! <i class="fas fa-rainbow"></i></h2>`,
`<h2> <i class="fas fa-bolt"></i> IT'S RAINING MEN WAS RELEASED ON SEPTEMBER 10TH, 1982! TODAY, THE ICONIC SONG TURNS 40! <i class="fas fa-bolt"></i></h2>`,
`<h2> <i class="fas fa-glasses"></i> HAPPY BIRTHDAY TO PAUL SHAFFER, THE CO-COMPOSER OF IT'S RAINING MEN! <i class="fas fa-glasses"></i></h2>`,
`<h2> <i class="fas fa-cloud-moon"></i> HAPPY BIRTHDAY TO WEATHER GIRL, MARTHA WASH! HALLELUJAH FOR MARTHA! <i class="fas fa-cloud-moon"></i></h2>`,
`<h2><i class="fas fa-cloud-sun-rain"></i> ENTER THE CITIES YOU WOULD LIKE TO VISIT AND THE WEATHER GIRLS WILL TELL YOU IF IT IS RAINING THERE <i class="fas fa-cloud-sun-rain"></i></h2>`
];

// Outputs important days in the breaking news header
function breakingNews (forecast) {
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
  } else if (forecast) { 
    breaking.innerHTML = `TODAY YOU CAN EXPECT ${forecast.toUpperCase()}!`;
  } else {
    breaking.innerHTML = breakingNewsMessages[5];
  }
}

const cities = [];

// Connects the app to the weather api
function getAPI (userCity) {
  // Weather Reporter Header
  let showCity = document.getElementById("city-shown");
  showCity.textContent = `${userCity.toUpperCase()} WEATHER REPORT`;
  pastWeatherSearches(userCity);
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userCity},us&appid=${APIkey}`) 
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      weather = data;
      // enables the ticker tape to display the weather conditions for the current day
      let forecast = weather.weather[0].main;
      breakingNews(forecast);
      // information for the weather cards for the 6 day forecast
      currentWeatherSearch(weather);
      // resets the form for the user input
      document.querySelector(".form-control").value = "";
    })
}

// The UV Index requires an One Call API request unlike the other weather information
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
function uvColorCode () {
  let getUV = document.querySelectorAll(".uv-index");
  for (let i = 0; i < getUV.length; i++) {
    const currentUV = parseFloat(getUV[i].textContent);
    // the default color is green, if the UV Index is under 2
    if (currentUV >= 2 && currentUV < 6) {
      getUV[i].setAttribute("style", "background-color: var(--tall-blonde); color: var(--shaffer-shades);");
    } else if (currentUV >= 6 && currentUV < 8) {
      getUV[i].setAttribute("style", "background-color: var(--celsius-orange); color: var(--shaffer-shades);");
    } else if (currentUV >= 8 && currentUV < 11) {
      getUV[i].setAttribute("style", "background-color: var(--fahrenheit-red);");
    } else {
      getUV[i].setAttribute("style", "background-color: var(--jabara-green);");
    }
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

// Outputs the weather forecast to the page
function displayWeather (weather) {
  let getCards = document.querySelectorAll(".card");
  for (let i = 0; i < getCards.length; i++) {
    const currentCard = getCards[i];
    // displays the cards themselves
    currentCard.setAttribute("style", "visibility: visible")
    // needed information for each item
    const dateString = moment.unix(weather.daily[i].dt).format("MMM Do YYYY");
    const daysIcon = weather.daily[i].weather[0].icon;
    const daysTemp = weather.daily[i].temp.day;
    const daysWind = weather.daily[i].wind_speed;
    const daysHumidity = weather.daily[i].humidity;
    let daysUVIndex = weather.daily[i].uvi;
    // content for each card
    currentCard.childNodes[1].textContent = dateString;
    weatherIcon[i].setAttribute("src", `http://openweathermap.org/img/wn/${daysIcon}.png`);
    currentCard.children[1].children[1].children[0].children[0].textContent = celsiusToFahrenheit(daysTemp);
    currentCard.children[1].children[1].children[1].children[0].textContent = ` ${daysWind} MPH`;
    currentCard.children[1].children[1].children[2].children[0].textContent = ` ${daysHumidity} %`;
    currentCard.children[1].children[1].children[3].children[0].textContent = daysUVIndex;
  }
  uvColorCode();
}

// Saves user's past city inputs and makes them buttons
function pastWeatherSearches (recentSearch) {
  cities.push(recentSearch);
  localStorage.setItem("Past Searches", cities);
  recentSearch = recentSearch.toUpperCase();
  let citiesSearched = localStorage.getItem("Past Searches");
  let currentCityText = recentSearch;
  let currentCityButton = document.createElement("button");
    
  currentCityButton.setAttribute("class", ".btn-history");
  currentCityButton.textContent = currentCityText;
  citiesSearchList.appendChild(currentCityButton);
  
}

// Converts the temperature Celsius to Fahrenheit
function celsiusToFahrenheit (celTemp) {
  let convertedTemp =  (celTemp * 9 )/ (5 + 32);
  return Math.ceil(convertedTemp) + "°F";
}

window.addEventListener("load", breakingNews)
getWeatherBtn.addEventListener("click", function(event) {
  event.preventDefault();
  let userCity = document.getElementById("user-city").value;
  getAPI(userCity);
});

citiesSearchList.addEventListener("click", function(event) {
  let cityName = event.target.textContent.toLowerCase();
  //console.log(cityName);
  getAPI(cityName);
});
