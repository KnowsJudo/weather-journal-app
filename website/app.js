// cors workaround due to no localhost support when running in web
const corsFix = "https://cors-anywhere.herokuapp.com/"

/* Global Variables */
const owmAppKey = '2e3f5bd7564a71e84934e70a7dc2eed1';
const owmBaseURL = 'api.openweathermap.org/data/2.5';
//Get request to fetch weather data
const getTemp = async (url, zipcode, appKey) => {
    const response = await fetch(`${corsFix}http://${url}/weather?zip=${zipcode},AU&APPID=${appKey}&units=metric`, {
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
    getTemp(owmBaseURL, newZip, owmAppKey).then((weatherData) => {
        const body = {
            temp: weatherData.main.temp,
            date: newDate,
            userRes: userRes
        };
        postData('/submit', body)
    })
};

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
    document.getElementById('temp').innerHTML = `${temp}°C`;
    document.getElementById('content').innerHTML = content;
};