import React from 'react';
import { Grid, Typography } from '@mui/material';
import DailyForecastItem from './DailyForecastItem';
import ErrorBox from '../../Reusable/ErrorBox';
import Layout from '../../Reusable/Layout';

const DailyForecast = ({ data, forecastList }) => {
  const noDataProvided =
    !data ||
    !forecastList ||
    Object.keys(data).length === 0 ||
    data.cod === '404' ||
    forecastList.cod === '404';

  let subHeader;

  if (!noDataProvided && forecastList.length > 0)
    subHeader = (
      <Typography
        variant="h5"
        component="h5"
        sx={{
          fontSize: { xs: '10px', sm: '14px' },
          textAlign: 'center',
          lineHeight: 1,
          color: '#D7E9FF',
          fontFamily: 'Roboto Condensed',
          marginBottom: '1rem',
        }}
      >
        {forecastList.length === 1
          ? '1 การคาดการณ์ของวันนี้'
          : `${forecastList.length} การคาดการณ์ของวันนี้`}
      </Typography>
    );

  let content;

  if (noDataProvided) content = <ErrorBox flex="1" type="error" />;

  if (!noDataProvided && forecastList.length > 0)
    content = (
      <Grid
        item
        container
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: 'fit-content',
        }}
        spacing="7px"
      >
        {forecastList.map((item, idx) => (
          <Grid
            key={idx}
            item
            xs={4}
            sm={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              marginBottom: { xs: '1rem', sm: '0' },
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
              transform: 'scale(1.1)',
              },
            }}
          >
            <DailyForecastItem item={item} data={data} />
          </Grid>
        ))}
      </Grid>
    );

  if (!noDataProvided && forecastList && forecastList.length === 0)
    subHeader = (
      <ErrorBox
        flex="1"
        type="info"
        margin="2rem auto"
        errorMessage="ไม่มีการพยากรณ์สําหรับคืนนี้"
      />
    );

  return (
    <Layout
      title={
        <span className="wavy-text">
          การพยากรณ์ ณ วันนี้
        </span>
      }
      content={content}
      sectionSubHeader={subHeader}
      sx={{ marginTop: '2.9rem' }}
      mb="0.3rem"
    />
  );
};

export default DailyForecast;
