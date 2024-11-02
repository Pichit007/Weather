import React, { useState } from 'react';
import { Box, Container, Grid, Link, Typography} from '@mui/material';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import Logo from './assets/logo.png';
import pig from './assets/icons/frist.png';
import ErrorBox from './components/Reusable/ErrorBox';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import {getTodayForecastWeather, getWeekForecastWeather,} from './utilities/DataUtils';
import axios from 'axios';

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(' ');

    setIsLoading(true);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const todatabase= await axios.get(`/weather?lat=${latitude}&lon=${longitude}`)
      const [todayWeatherResponse,weekForecastResponse] = todatabase.data
      console.log(todayWeatherResponse);

      // const [weekForecastResponse] =
      //   await fetchWeatherData(latitude, longitude);
      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
      <Box
        component="img"
        sx={{
          height: { xs: '16px', sm: '22px', md: '300px' },
          width: 'auto',
        }}
        alt="pig"
        src={pig}
        className="rotating-image" // Add the CSS class here
      />
      <Typography
        variant="h4"
        component="h4"
        className="bounce"
        sx={{
          fontSize: { xs: '12px', sm: '16px' },
          color: 'rgba(255,255,255, .85)',
          fontFamily: 'Poppins',
          textAlign: 'center',
          margin: '2rem 0',
          maxWidth: '80%',
          lineHeight: '22px',
        }}
      >
        "หมูเด้งสุดคิวท์พยากรณ์อากาศ! มาอัปเดตอากาศสดใสและการพยากรณ์ใน 6 วันจากเมืองกว่า 200,000 แห่งกันเถอะ!"
      </Typography>
    </Box>
  );
  
  

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '500px',
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '10px', sm: '12px' },
              color: 'rgba(255, 255, 255, .8)',
              lineHeight: 1,
              fontFamily: 'Poppins',
            }}
          >
            กำลังโหลด โปรดรอสักครู่...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: { xs: '95%', sm: '80%', md: '1100px' },
        width: '100%',
        height: '100%',
        margin: '1% auto',
        padding: '1rem 0 3rem',
        marginBottom: '0rem',
        borderRadius: {
          xs: 'none',
          sm: '7rem 7rem 7rem 7rem',
        },
        boxShadow: {
          xs: 'none',
          sm: 'rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px',
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: isHovered ? '32px' : '16px', sm: isHovered ? '44px' : '22px', md: isHovered ? '200px' : '180px' },
                width: 'auto',
                
                transition: 'height 0.3s ease', // เพิ่ม transition เพื่อให้การเปลี่ยนแปลงขนาดดูนุ่มนวล
              }}
              alt="logo"
              src={Logo}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
            </Box>
            
            <Box 
            display="flex" 
            justifyContent="center"
            className="">
            <UTCDatetime /> 
            <Link
              href="https://github.com/Amin-Awinti"
              target="_blank"
              underline="none"
              sx={{ display: 'flex' }}
            >
            </Link>
          </Box>
          <Search onSearchChange={searchChangeHandler} />
        </Grid>
        {appContent}
      </Grid>
    </Container>
  );
}

export default App;
