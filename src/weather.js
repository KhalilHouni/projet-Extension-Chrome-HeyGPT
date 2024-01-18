const weatherApiKey = "23e05a7ea147f7645052bf0de2fd3fa3";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

// /// --------------- WeatherApi Functions --------------- ///

export async function getWeatherInfo(location) {
    return await fetch(`${weatherApiUrl}${location}&appid=${weatherApiKey}`)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
        	const weatherInfo = `Weather in ${location}: ${weatherDescription}, Temperature: ${temperature}°C`;
			console.log(weatherInfo);
			return weatherInfo;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}


export function createWeatherAnswer(weatherData) {
	const answerWeather = document.createElement('p');
	answerWeather.textContent = weatherData;
	return answerWeather;
}

export function containWeatherWord(userQuestion) {
	return (userQuestion.toLowerCase().includes("weather") ||
	userQuestion.toLowerCase().includes("clima") ||
	userQuestion.includes("天气") ||
	userQuestion.includes("الطقس") ||
	userQuestion.toLowerCase().includes("météo"));
}