import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

const DayWeatherDetails = (props) => {
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: { xs: '12px', sm: '20px', md: '32px' },
        transition: 'transform 0.3s ease-in-out',
              '&:hover': {
              transform: 'scale(1.1)',
              },
      }}
    >
      <Typography
        xs={12}
        sx={{
          fontFamily: 'Poppins',
          fontWeight: { xs: '400', sm: '600' },
          fontSize: { xs: '12px', sm: '13px', md: '14px' },
          color: 'white',
          lineHeight: 1,
          height: '31px',
          alignItems: 'center',
          display: 'flex',
          
        }}
      >
        {props.day}
      </Typography>
      <Box
        xs={12}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '31px',
        }}
      >
      <Box
        component="img"
        sx={{
          width: { xs: '50px', sm: '38px', md: '50px' },
          height: 'auto',
          marginRight: '4px',
  }}
  alt="weather"
  src={props.src}
/>
        <Typography
          variant="h4"
          component="h4"
          sx={{
            fontSize: { xs: '12px', md: '14px' },
            color: 'rgba(255,255,255, .8)',
            lineHeight: 1,
            fontFamily: 'Roboto Condensed',
          }}
        >
          {props.description}
        </Typography>
      </Box>
    </Grid>
  );
};

export default DayWeatherDetails;
