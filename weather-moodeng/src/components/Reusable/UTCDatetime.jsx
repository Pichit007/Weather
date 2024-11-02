import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

// Utility function to get the datetime in Thailand's timezone (GMT +7)
const getThailandDatetime = () => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const UTCDatetime = () => {
  const [thailandFullDate, setThailandFullDate] = useState(getThailandDatetime());

  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setThailandFullDate(getThailandDatetime());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const thailandTimeValue = (
    <Typography
      variant="h5"
      component="h5"
      sx={{
        fontWeight: '700',
        fontSize: { xs: '10px', sm: '15px' },
        color: 'rgba(255, 255, 255, .7)',
        lineHeight: 1,
        paddingRight: '20px',
        paddingBottom: '7px',
        fontFamily: 'Poppins',
      }}
    >
      {thailandFullDate} GMT+7
    </Typography>
  );
  return thailandTimeValue;
};

export default UTCDatetime;
