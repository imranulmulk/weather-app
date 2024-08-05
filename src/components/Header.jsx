import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { IoLocationOutline } from "react-icons/io5";

const Header = ({
  fetchWeatherData,
  weatherData,
  fetchForecastWeather,
  error,
}) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm === "") {
      alert("Enter a city name");
      return;
    }
    fetchWeatherData(searchTerm);
    fetchForecastWeather(searchTerm);
    setSearchTerm(""); // Clear the search term
  };

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

    const formattedDate = `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    return { date: formattedDate, time: time };
  };

  return (
    <div
      className={`flex justify-between items-center border-gray-200 border-b-2 mb-10 p-4 flex-row-reverse md:flex-row ${
        !weatherData ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Render date and location only if weatherData is valid */}
      {weatherData ? (
        <div className="hidden md:flex flex-col">
          <p className="font-semibold text-xs">
            Today, {formatDate(weatherData.location.localtime).date}
          </p>
          <div className="flex items-center">
            <IoLocationOutline size={25} />
            <h1 className="font-semibold text-sm">
              {weatherData.location.name}, {weatherData.location.country}
            </h1>
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-center">
        {!searchVisible && (
          <button onClick={toggleSearch} className="rounded-full p-2">
            <FiSearch size={25} />
          </button>
        )}
        <motion.div
          initial={{ width: 0 }} // Initial width when hidden
          animate={{ width: searchVisible ? "240px" : "0px" }} // Width when visible or hidden
          transition={{ duration: 0.3 }} // Duration of the animation
          className="overflow-hidden"
        >
          <form
            onSubmit={handleSearch}
            className={`flex items-center border-2 border-white rounded-full ${
              searchVisible ? "p-1" : "p-0"
            }`}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="focus:outline-none text-xl px-2 rounded-lg mr-1 w-[100%] bg-transparent placeholder:text-white"
            />
            {searchVisible && (
              <button type="submit" className="p-1">
                <FiSearch size={25} />
              </button>
            )}
          </form>
        </motion.div>
      </div>
      {/* Display error message if there's an error */}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default Header;
