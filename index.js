
console.log("Before API");
const API_KEY = "b4a539a2c10b21d0558410ab70cb1903";
console.log("After API");

async function showWeather(){
    let city = 'goa';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    console.log("Weather data:-> " , data);

    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} ℃`;
    document.body.appendChild(newPara);
    console.log("Weather data:-> " , data);

}