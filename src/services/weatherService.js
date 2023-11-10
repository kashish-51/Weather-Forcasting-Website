// Importing DateTime class from the "luxon" library
import { DateTime } from "luxon";

// Defining constants for the OpenWeatherMap API key and base URL
const API_KEY = "eb54944d5af025a881e7ea6182f50d83";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Function to fetch weather data from the OpenWeatherMap API
const getWeatherData = (infoType, searchParams) => {
  // Creating a URL using the base URL and infoType (e.g., "weather" or "onecall")
  const url = new URL(BASE_URL + "/" + infoType);

  // Appending search parameters and the API key to the URL
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  // Making a fetch request to the constructed URL and returning the JSON response
  return fetch(url).then((res) => res.json());
};

// Function to format current weather data
const formatCurrentWeather = (data) => {
  // Destructuring relevant data from the API response
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  // Returning a formatted object with selected weather data
  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

// Function to format forecast weather data
const formatForecastWeather = (data) => {
  let { timezone, daily, hourly } = data;

  // Handling cases where daily or hourly forecast data is unavailable
  if (!daily || !hourly) {
    console.error("No daily or hourly forecast data available.");
    return { timezone, daily: [], hourly: [] };
  }

  // Mapping and formatting daily forecast data
  daily = daily.slice(1, 3).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });

  // Mapping and formatting hourly forecast data
  hourly = hourly.slice(1, 3).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].icon,
    };
  });

  // Returning an object with formatted forecast data
  return { timezone, daily, hourly };
};

// Function to get formatted weather data by combining current and forecast data
const getFormattedWeatherData = async (searchParams) => {
  // Fetching and formatting current weather data
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  // Extracting latitude and longitude from current weather data
  const { lat, lon } = formattedCurrentWeather;

  // Fetching and formatting forecast weather data
  const formattedForecastWeather = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then(formatForecastWeather);

  // Combining current and forecast weather data into a single object
  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

// Function to format a timestamp to a local time string
const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

// Function to generate the URL for the weather icon based on the provided code
const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

// Exporting the main function for getting formatted weather data as the default export
export default getFormattedWeatherData;

// Exporting additional utility functions
export { formatToLocalTime, iconUrlFromCode };
