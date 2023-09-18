const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weatherContainer");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchFrom = document.querySelector("[data-searchFrom]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const API_KEY = "b4a539a2c10b21d0558410ab70cb1903";

let oldTab = userTab;
oldTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchFrom.classList.contains("active")){
            //Checking is search form container visible? if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchFrom.classList.add("active");
        }
        else{
            //jump from search tab to your weather tab
            searchFrom.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now i am on your weather tab, now show weather, so lets check local storage first
            //fetching the data from local storage
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", ()=> {
    // passed clickd tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    // passed cliked tab as input parameter
    switchTab(searchTab);
});

//check if cordinates are already oresent in session storage

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        // if local coordinates are not present means till now we have not given location access permission
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    // API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
        
        const data =  await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // this function is to fetch values form the data and put it to userInfoContainer
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatheDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weather info and put it on UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windSpeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HW- show an alert for no geolocation support avialable;
    }
};

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
};

grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");

searchFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    if(searchInput.value === "") return;

    fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userContainer.classList.add("active");
        renderWeatherInfo(data);
    }   
    catch(e){
        // H.W
    }
}