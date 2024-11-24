import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Import weather icons - Day
import clearSkyDay from '../../assets/icons/01d.png';
import clearSkyNight from '../../assets/icons/01n.png';
import fewCloudsDay from '../../assets/icons/02d.png';
import fewCloudsNight from '../../assets/icons/02n.png';
import scatteredCloudsDay from '../../assets/icons/03d.png';
import scatteredCloudsNight from '../../assets/icons/03n.png';
import brokenCloudsDay from '../../assets/icons/04d.png';
import brokenCloudsNight from '../../assets/icons/04n.png';
import showerRainDay from '../../assets/icons/09d.png';
import showerRainNight from '../../assets/icons/09n.png';
import rainDay from '../../assets/icons/10d.png';
import rainNight from '../../assets/icons/10n.png';
import thunderstormDay from '../../assets/icons/11d.png';
import thunderstormNight from '../../assets/icons/11n.png';
import snowDay from '../../assets/icons/13d.png';
import snowNight from '../../assets/icons/13n.png';
import mistDay from '../../assets/icons/50d.png';
import mistNight from '../../assets/icons/50n.png';

// DetailBox Component
const DetailBox = ({ icon, value, unit }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      color: 'rgba(255,255,255,0.7)',
      fontSize: { xs: '12px', sm: '14px' }
    }}
  >
    {icon}
    {value}{unit}
  </Box>
);

// Weather icon mapping function
const getWeatherIcon = (description, hour) => {
  const isNight = hour >= 18 || hour < 6;
  const getTimeBasedIcon = (dayIcon, nightIcon) => isNight ? nightIcon : dayIcon;

  const weatherMapping = {
    'clear sky': getTimeBasedIcon(clearSkyDay, clearSkyNight),
    'few clouds': getTimeBasedIcon(fewCloudsDay, fewCloudsNight),
    'scattered clouds': getTimeBasedIcon(scatteredCloudsDay, scatteredCloudsNight),
    'broken clouds': getTimeBasedIcon(brokenCloudsDay, brokenCloudsNight),
    'overcast clouds': getTimeBasedIcon(brokenCloudsDay, brokenCloudsNight),
    'shower rain': getTimeBasedIcon(showerRainDay, showerRainNight),
    'light intensity drizzle': getTimeBasedIcon(showerRainDay, showerRainNight),
    'drizzle': getTimeBasedIcon(showerRainDay, showerRainNight),
    'heavy intensity drizzle': getTimeBasedIcon(showerRainDay, showerRainNight),
    'light intensity drizzle rain': getTimeBasedIcon(showerRainDay, showerRainNight),
    'drizzle rain': getTimeBasedIcon(showerRainDay, showerRainNight),
    'heavy intensity drizzle rain': getTimeBasedIcon(showerRainDay, showerRainNight),
    'shower rain and drizzle': getTimeBasedIcon(showerRainDay, showerRainNight),
    'heavy shower rain and drizzle': getTimeBasedIcon(showerRainDay, showerRainNight),
    'shower drizzle': getTimeBasedIcon(showerRainDay, showerRainNight),
    'light intensity shower rain': getTimeBasedIcon(showerRainDay, showerRainNight),
    'heavy intensity shower rain': getTimeBasedIcon(showerRainDay, showerRainNight),
    'ragged shower rain': getTimeBasedIcon(showerRainDay, showerRainNight),
    'rain': getTimeBasedIcon(rainDay, rainNight),
    'light rain': getTimeBasedIcon(rainDay, rainNight),
    'moderate rain': getTimeBasedIcon(rainDay, rainNight),
    'heavy intensity rain': getTimeBasedIcon(rainDay, rainNight),
    'very heavy rain': getTimeBasedIcon(rainDay, rainNight),
    'extreme rain': getTimeBasedIcon(rainDay, rainNight),
    'thunderstorm': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'thunderstorm with light rain': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'thunderstorm with rain': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'thunderstorm with heavy rain': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'light thunderstorm': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'heavy thunderstorm': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'ragged thunderstorm': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'thunderstorm with light drizzle': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'thunderstorm with drizzle': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    'thunderstorm with heavy drizzle': getTimeBasedIcon(thunderstormDay, thunderstormNight),
    // ... rest of weather mappings ...
  };

  const lowercaseDesc = description.toLowerCase();
  return weatherMapping[lowercaseDesc] || clearSkyDay;
};

// DayForecast Component
const DayForecast = ({ date, forecasts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '15px',
        mb: 3,
        overflow: 'hidden'
      }}
    >
      <Box
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.05)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          }
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: { xs: '14px', sm: '16px', md: '18px' },
            fontWeight: 500,
            zIndex: 1,
          }}
        >
          {new Date(date).toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
        <IconButton 
          size="small" 
          sx={{ 
            color: 'white',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ p: 3, pt: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              marginTop: 2
            }}
          >
            {forecasts.map((forecast, index) => (
              <Box
                key={index}
                sx={{
                  width: '97%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transform: 'scale(1.01)'
                  }
                }}
              >
                {/* Time */}
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '12px', sm: '14px' },
                    minWidth: '60px'
                  }}
                >
                  {`${forecast.hour}:00`}
                </Typography>

                {/* Weather icon and description */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flex: 1
                  }}
                >
                  <Box
                    component="img"
                    src={getWeatherIcon(forecast.weather.description, forecast.hour)}
                    alt={forecast.weather.description}
                    sx={{
                      width: '40px',
                      height: '40px'
                    }}
                  />
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: { xs: '12px', sm: '14px' }
                    }}
                  >
                    {forecast.weather.description}
                  </Typography>
                </Box>

                {/* Weather stats */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    minWidth: '250px',
                    justifyContent: 'flex-end'
                  }}
                >
                  <DetailBox 
                    icon={<span style={{ fontSize: '12px' }}>🌡️</span>}
                    value={Math.round(forecast.temp)}
                    unit="°C"
                  />
                  <DetailBox 
                    icon={<span>💧</span>}
                    value={forecast.humidity}
                    unit="%"
                  />
                  <DetailBox 
                    icon={<span>💨</span>}
                    value={forecast.wind_speed}
                    unit=" m/s"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

// Main HourlyForecast Component
const HourlyForecast = ({ data }) => {
  if (!data || !data.data) return null;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h6"
        sx={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: { xs: '18px', sm: '20px', md: '22px' },
          fontWeight: 600,
          textAlign: 'center',
          mb: 3,
          mt: 2
        }}
      >
        พยากรณ์อากาศรายสัปดาห์
      </Typography>
      {Object.entries(data.data).map(([date, forecasts]) => (
        <DayForecast 
          key={date} 
          date={date} 
          forecasts={forecasts} 
        />
      ))}
    </Box>
  );
};

export default HourlyForecast;