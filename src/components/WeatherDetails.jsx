import React from "react";
import wind from "../assets/wind.png";
import humidity from "../assets/humidity.png";
import uv from "../assets/uv.png";
import { IoLocationOutline } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const WeatherDetails = ({ weatherData, isDay, forecastData, error }) => {
  if (!weatherData) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }

  const extraDetails = [
    {
      id: 1,
      imgSource: wind,
      detail: weatherData.current.wind_kph,
      unit: "km/h",
      title: "Wind",
    },
    {
      id: 2,
      imgSource: humidity,
      detail: weatherData.current.humidity,
      unit: "%",
      title: "Humidity",
    },
    {
      id: 3,
      imgSource: uv,
      detail: weatherData.current.uv,
      title: "UV",
    },
  ];

  // Function to format date
  const formatDate = (localtime) => {
    const [date, time] = localtime.split(" ");
    const [year, month, day] = date.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${day} ${monthNames[parseInt(month) - 1]}  ${year}`;
    return { date: formattedDate, time: time };
  };

  const { date, time } = formatDate(weatherData.location.localtime);

  // Get the current date and time
  const currentDateTime = new Date(weatherData.location.localtime);
  const currentDay = currentDateTime.getDate();
  const currentHour = currentDateTime.getHours();

  // Create an array of the next 24 hours starting from the current hour
  const next24Hours =
    forecastData.length > 0
      ? [
          ...forecastData[0].hour.slice(currentHour),
          ...forecastData[1]?.hour.slice(0, currentHour),
        ].slice(0, 24)
      : [];

  // Function to convert 24-hour time to 12-hour format with AM/PM
  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  return (
    <div className="flex justify-center items-center flex-col lg:items-start">
      <div className="flex flex-col md:hidden">
        <p className="font-semibold text-xs ml-2">Today, {date}</p>
        <div className="flex items-center">
          <IoLocationOutline size={25} />
          <h1 className="font-semibold text-sm">
            {weatherData.location.name}, {weatherData.location.country}
          </h1>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col lg:items-start">
        <LazyLoadImage
          src={weatherData.current.condition.icon}
          alt="weather-image"
          effect="blur"
          wrapperProps={{
            style: { transitionDelay: "0.2s" },
          }}
          className="w-44 h-44 rounded-xl lg:w-48 lg:h-48"
        />
        <div className="flex flex-col justify-center items-center lg:items-start">
          <h1 className="text-6xl mb-2 font-bold lg:text-8xl">
            {weatherData.current.temp_c}°
          </h1>
          <p className="text-lg font-semibold lg:text-xl">
            Feels like {weatherData.current.feelslike_c}°
          </p>
        </div>
        <p className="text-2xl font-bold mt-1 lg:text-3xl">
          {weatherData.current.condition.text}
        </p>
      </div>
      {/* 3 sections */}
      <div className="flex justify-evenly items-center w-full mt-12 lg:justify-start lg:gap-5">
        {extraDetails.map((data) => (
          <div
            key={data.id}
            className={`flex flex-col justify-center items-center ${
              isDay ? "bg-gray-400" : "bg-gray-600"
            } opacity-70 p-5 rounded-xl w-24 gap-1 sm:w-28 md:w-36 lg:w-48`}
          >
            <LazyLoadImage
              src={data.imgSource}
              alt="icons"
              effect="blur"
              wrapperProps={{
                style: { transitionDelay: "0.3s" },
              }}
              className="w-8 h-8 filter invert md:w-12 md:h-12 md:mb-2 lg:w-14 lg:h-14 lg:mb-4"
            />
            <h2 className="text-xl font-bold text-white md:text-2xl md:mb-1 lg:text-3xl">
              {data.detail}
              <span className="text-sm font-normal md:text-base">
                {data.unit}
              </span>
            </h2>
            <p className="text-base font-semibold md:text-lg">{data.title}</p>
          </div>
        ))}
      </div>
      {/* 7 days Forecast Section */}
      <div className="mt-10 w-full">
        <h2 className="text-xl font-bold ml-4">7-Day Forecast</h2>
        <div className="flex gap-2 justify-center flex-wrap w-full p-4 lg:justify-start">
          {forecastData.map((day) => {
            const forecastDate = new Date(day.date);
            const forecastDay = forecastDate.getDate();
            const isToday = currentDay === forecastDay;

            return (
              <div
                key={day.date}
                className={`flex flex-col items-center w-20 gap-2 mb-1 p-2 rounded-lg text-center ${
                  isDay ? "bg-gray-400" : "bg-gray-600"
                } ${isToday ? "border-2 border-yellow-500" : ""} lg:w-28`}
              >
                <p className="font-semibold text-xs">
                  {formatDate(day.date).date}
                </p>
                <LazyLoadImage
                  src={day.day.condition.icon}
                  alt="icons"
                  effect="blur"
                  wrapperProps={{
                    style: { transitionDelay: "0.4s" },
                  }}
                  className="w-14 h-14"
                />
                <p className="text-md font-bold">{day.day.avgtemp_c}°</p>
                <p className="text-xs">{day.day.condition.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 24 hours forecast Section */}
      {next24Hours.length > 0 && (
        <div className="mt-10 w-full">
          <h2 className="text-xl font-bold ml-4">24-Hour Forecast</h2>
          <div className="flex gap-2 justify-center flex-wrap w-full p-4 lg:justify-start">
            {next24Hours.map((hour, index) => {
              const hourTime = hour.time.split(" ")[1];
              const hourDate = new Date(hour.time);
              const isCurrentHour =
                currentDateTime.getHours() === hourDate.getHours() &&
                currentDateTime.getDate() === hourDate.getDate();
              const isTomorrow =
                hourDate.getDate() !== currentDateTime.getDate();

              return (
                <div
                  key={hour.time_epoch}
                  className={`flex flex-col items-center w-20 gap-2 p-2 rounded-lg text-center ${
                    isDay ? "bg-gray-400" : "bg-gray-600"
                  } ${isCurrentHour ? "border-2 border-yellow-500" : ""}`}
                >
                  <p className="font-semibold text-xs">
                    {isCurrentHour ? "Today" : isTomorrow ? "Tomorrow" : ""}
                  </p>
                  <p className="font-semibold text-xs">
                    {convertTo12HourFormat(hourTime)}
                  </p>
                  <LazyLoadImage
                    src={hour.condition.icon}
                    alt="icon"
                    effect="blur"
                    wrapperProps={{
                      style: { transitionDelay: "0.5s" },
                    }}
                    className="w-10 h-10"
                  />
                  <p className="text-md font-bold">{hour.temp_c}°</p>
                  <p className="text-xs">{hour.condition.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDetails;
