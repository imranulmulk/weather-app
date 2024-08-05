import { useEffect, useState } from "react";
import Header from "./components/Header";
import axios from "axios";
import WeatherDetails from "./components/WeatherDetails";
import dayImage from "./assets/day.jpg";
import nightImage from "./assets/night.jpg";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isDay, setIsDay] = useState(true);
  const [error, setError] = useState("");

  // Current Weather
  const fetchWeatherData = async (searchTerm) => {
    const api = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${api}&q=${searchTerm}&aqi=no`;

    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
      setIsDay(response.data.current.is_day === 1); // Update isDay state based on API response
      setError(""); // Clear error on successful fetch
    } catch (error) {
      console.log("Error fetching weather data", error);
      setWeatherData(null);
      setError("Invalid city name. Please try again."); // Set error message
    }
  };

  // Forecast
  const fetchForecastWeather = async (searchTerm) => {
    const api = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${api}&q=${searchTerm}&days=7&aqi=no&alerts=no`;

    try {
      const response = await axios.get(url);
      setForecastData(response.data.forecast.forecastday);
    } catch (error) {
      console.log("Error fetching forecast weather data", error);
      setForecastData([]);
    }
  };

  useEffect(() => {
    fetchWeatherData("London");
    fetchForecastWeather("London");
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default location if user denies location access or there's an error
          fetchWeatherData("London");
        }
      );
    } else {
      // Fallback to a default location if geolocation is not supported
      fetchWeatherData("London");
    }
  }, []);

  return (
    <div
      className="w-full h-screen p-2 md:flex md:justify-center md:items-center text-white transition-all overflow-hidden"
      style={{
        backgroundImage: `url(${isDay ? dayImage : nightImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`h-full overflow-scroll overflow-x-hidden scrollbar-thin scrollbar-webkit rounded-xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60 md:w-[90%] md:rounded-xl md:p-3 ${
          isDay ? "bg-gray-300" : "bg-gray-700"
        }`}
      >
        {/* header */}
        <Header
          fetchWeatherData={fetchWeatherData}
          weatherData={weatherData}
          fetchForecastWeather={fetchForecastWeather}
        />
        <WeatherDetails
          weatherData={weatherData}
          isDay={isDay}
          forecastData={forecastData}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;
