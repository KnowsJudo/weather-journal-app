/* Global Variables */
const owmAppId = 'default-application_4992067';
const owmAppKey = '613a506d57msh110e01a339ef205p12e3e1jsn07202a303361';
const owmBaseURL = 'community-open-weather-map.p.rapidapi.com'

//Get request to fetch weather data
const getTemp = async (url, zipcode, appKey) => {
    const response = await fetch(`https://${url}/weather?zip=${zipcode}`, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': appKey,
            'X-RapidAPI-Host': url
        },
    });
    try {
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    } catch (error) {
        console.log('a get error occured', error);
    }
};

// Register callback on click event
document.getElementById('generate').addEventListener('click', callBack);

function callBack(e) {
    const newZip = document.getElementById('zip').value;
    const userRes = document.getElementById('feelings').value;
    // Create a new date instance dynamically with JS
    const d = new Date();
    const newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

    // Use weatherData from getTemp in chained post request to server.js
    getTemp(owmBaseURL, `${newZip},au`, owmAppKey).then((weatherData) => {
        const body = {
            temp: weatherData.main.temp,
            date: newDate,
            userRes: userRes
        };
        postData('/submit', body)
    })
};

// Convert kelvin value to degrees celsius
const toCelsius = (temp) => `${(temp - 273.15).toFixed(1)}°C`;

// Post request to server.js
const postData = async (url, data = {}) => {
    await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        // Chain promise to handle retrieving data from server.js
        .then(() => getData())
        .catch((error) => console.log('a post error occured', error))
};

// Get request to fetch projectData
const getData = async (url = '/all') => {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    try {
        const newData = await response.json();
        // Feed in fetch data
        displayData(newData.date, newData.temp, newData.userRes);
    } catch (error) {
        console.log('a get error occured', error);
    }
};

// Dynamically update UI with projectData values
const displayData = (date = '', temp = 0, content = '') => {
    document.getElementById('date').innerHTML = date;
    document.getElementById('temp').innerHTML = toCelsius(temp);
    document.getElementById('content').innerHTML = content;
};