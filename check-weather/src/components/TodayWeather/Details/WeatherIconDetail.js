import { Box } from '@mui/material';
import React from 'react';

const WeatherIconDetail = (props) => {
  return (
    <Box
      component="img"
      className="bounce"
      sx={{
        width: { xs: '50px', sm: '130px' },
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: '0 auto',
        padding: '0',
      }}
      alt="weather"
      src={props.src}
    />
  );
};

export default WeatherIconDetail;
