import { MONTHS, DAYS } from './DateConstants';

const date = new Date();

export function getWeekDays() {
  const dayInAWeek = new Date().getDay();
  const days = DAYS.slice(dayInAWeek, DAYS.length).concat(
    DAYS.slice(0, dayInAWeek)
  );
  return days;
}

export function getDayMonthFromDate() {
  const month = MONTHS[date.getMonth()].slice(0, 3);
  const day = date.toLocaleString('en-US', {
    day: '2-digit',
    timeZone: 'Asia/Bangkok', // Ensure it's in GMT+7
  });

  return day + ' ' + month;
}

export function transformDateFormat() {
  const month = date.toLocaleString('en-US', {
    month: '2-digit',
    timeZone: 'Asia/Bangkok', // GMT+7
  });
  const day = date.toLocaleString('en-US', {
    day: '2-digit',
    timeZone: 'Asia/Bangkok', // GMT+7
  });
  const year = date.toLocaleString('en-US', {
    year: 'numeric',
    timeZone: 'Asia/Bangkok', // GMT+7
  });
  const time = date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Bangkok', // GMT+7
  });

  const newFormatDate = year.toString().concat('-', month, '-', day, ' ', time);
  return newFormatDate;
}

export function getGMT7Datetime() {
  const gmt7Time = date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Bangkok', // GMT+7
  });

  const gmt7Date = date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Bangkok', // GMT+7
  });
  const formattedDate = gmt7Date.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3');
  return formattedDate.concat(' ', gmt7Time);
}

export function getGMT7Time() {
  const gmt7Time = date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Bangkok', // GMT+7
  });

  return gmt7Time;
}
