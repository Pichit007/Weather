const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch'); // Make sure to install node-fetch if you're using Node.js < 18
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

// SQLite database setup
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        lat REAL NOT NULL,
        lon REAL NOT NULL
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Cities table created or already exists.');
    });

    db.run(`CREATE TABLE IF NOT EXISTS weather_data (
        id INTEGER PRIMARY KEY,
        city_id INTEGER,
        dt INTEGER NOT NULL,
        name TEXT,
        temp REAL NOT NULL,
        feels_like REAL NOT NULL,
        humidity REAL NOT NULL,
        pressure REAL NOT NULL,
        sea_level REAL NOT NULL,
        grnd_level REAL NOT NULL,
        temp_max REAL NOT NULL,
        temp_min REAL NOT NULL,
        FOREIGN KEY (city_id) REFERENCES cities (id)
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Weather data table created or already exists.');
    });
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


// Constants for APIs
const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = '938b23c6bca582e3c836579696a15192'; // Replace with your actual API key

const GEO_API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '4f0dcce84bmshac9e329bd55fd14p17ec6fjsnff18c2e61917', // Replace with your actual RapidAPI key
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
};

// Function to fetch city data
async function fetchCities(input) {
  try {
    const response = await fetch(
      `${GEO_API_URL}/cities?minPopulation=10000&namePrefix=${input}`,
      GEO_API_OPTIONS
    );

    const data = await response.json();
    const cities = data.data;

    // Insert city data into SQLite
    cities.forEach(async (city) => {
      const { id, name, latitude: lat, longitude: lon } = city;

      db.run(`INSERT INTO cities (id, name, lat, lon) VALUES (?, ?, ?, ?)`, 
      [id, name, lat, lon], function(err) {
          if (err) {
              console.log(err.message);
          } else {
              console.log(`Inserted city: ${name}`);
          }
      });
    });

    return data;
  } catch (error) {
    console.log(error);
    return;
  }
}

// Function to fetch weather data
async function fetchWeatherData(lat, lon) {
  try {
    let [weatherPromise, forecastPromise] = await Promise.all([
      fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
      fetch(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
    ]);

    const weatherResponse = await weatherPromise.json();
    const forecastResponse = await forecastPromise.json();

    const { dt, main, name } = weatherResponse;
    const { feels_like, humidity, pressure, sea_level, grnd_level, temp, temp_max, temp_min } = main;

    // Assuming you have a method to get city_id based on lat and lon
    const cityId = await getCityId(lat, lon); // Implement this function as needed

    db.run(`INSERT INTO weather_data (city_id, dt, name, temp, feels_like, humidity, pressure, sea_level, grnd_level, temp_max, temp_min) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [cityId, dt, name, temp, feels_like, humidity, pressure, sea_level, grnd_level, temp_max, temp_min], 
    function(err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`Inserted weather data for city ID: ${cityId}`);
        }
    });

    console.log(forecastResponse);
    return [weatherResponse, forecastResponse];
  } catch (error) {
    console.log(error);
  }
}

// Function to get city ID based on latitude and longitude
function getCityId(lat, lon) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id FROM cities WHERE lat = ? AND lon = ?`, [lat, lon], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.id : null);
      }
    });
  });
}

// Function to delete old weather data
function deleteOldWeatherData() {
  const currentDate = new Date();
  const fifteenDaysAgo = new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)); // 15 days ago

  db.run(`DELETE FROM weather_data WHERE dt < ?`, [Math.floor(fifteenDaysAgo.getTime() / 1000)], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Deleted old weather data");
    }
  });
}

// Call the deleteOldWeatherData function every day
setInterval(deleteOldWeatherData, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

// Endpoint to add weather data
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    try {
        const weatherData = await fetchWeatherData(lat, lon);
        res.status(200).json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Endpoint to fetch cities
app.get('/cities', async (req, res) => {
    const { input } = req.query;

    try {
        const citiesData = await fetchCities(input);
        res.status(200).json(citiesData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
});

// Endpoint to get all weather data
app.get('/weather', (req, res) => {
    db.all(`SELECT * FROM weather_data`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});