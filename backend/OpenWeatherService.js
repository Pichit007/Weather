const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = '938b23c6bca582e3c836579696a15192';

const GEO_API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '4f0dcce84bmshac9e329bd55fd14p17ec6fjsnff18c2e61917',
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
};

// ฟังก์ชันสำหรับจัดกลุ่มข้อมูลพยากรณ์อากาศตามวันและเวลา
const processForcastData = (forcastResponse) => {
  const processedData = {
    daily: {},
    hourly: []
  };

  if (forcastResponse && forcastResponse.list) {
    forcastResponse.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      const hour = date.getHours();

      // จัดกลุ่มข้อมูลรายวัน
      if (!processedData.daily[dayKey]) {
        processedData.daily[dayKey] = {
          date: date,
          forecasts: []
        };
      }

      // เพิ่มข้อมูลพยากรณ์รายชั่วโมง
      processedData.daily[dayKey].forecasts.push({
        hour: hour,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        weather: item.weather[0],
        dt: item.dt
      });

      // เก็บข้อมูลรายชั่วโมงแยก
      processedData.hourly.push({
        dt: item.dt,
        hour: hour,
        temp: item.main.temp,
        weather: item.weather[0],
        humidity: item.main.humidity,
        wind_speed: item.wind.speed
      });
    });
  }

  return processedData;
};

export async function fetchWeatherData(lat, lon) {
  try {
    const [weatherPromise, forcastPromise] = await Promise.all([
      fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
      fetch(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
    ]);

    const weatherResponse = await weatherPromise.json();
    const forcastResponse = await forcastPromise.json();
    
    // ประมวลผลข้อมูลพยากรณ์อากาศ
    const processedForecast = processForcastData(forcastResponse);

    return {
      current: weatherResponse,
      forecast: processedForecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchCities(input) {
  try {
    const response = await fetch(
      `${GEO_API_URL}/cities?minPopulation=10000&namePrefix=${input}`,
      GEO_API_OPTIONS
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}