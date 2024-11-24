import { Box, Typography } from '@mui/material';
import React from 'react';

const TemperatureWeatherDetail = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{
          fontWeight: '700',
          fontSize: { xs: '22px', sm: '22px', md: '22px' },
          color: 'white',
          textTransform: 'uppercase',
          lineHeight: 1,
          marginBottom: '8px',
          fontFamily: 'Poppins',
        }}
      >
        {Math.round(props.temperature)} °C
      </Typography>
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: '19px', sm: '19px', md: '19px' },
          color: 'rgba(255,255,255, .7)',
          lineHeight: 1,
          letterSpacing: { xs: '1px', sm: '0' },
          fontFamily: 'Roboto Condensed',
        }}
      >
        {props.description}
      </Typography>
    </Box>
  );
};

export default TemperatureWeatherDetail;
