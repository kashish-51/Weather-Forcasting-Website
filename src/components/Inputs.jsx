// Importing necessary React and third-party library components
import React, { useState } from "react";
import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";
import { toast } from "react-toastify";

// Defining the Inputs functional component
function Inputs({ setQuery, units, setUnits }) {
  // Using state to manage the city input value
  const [city, setCity] = useState("");

  // Handling the change of temperature units (metric or imperial)
  const handleUnitsChange = (e) => {
    // Extracting the selected unit from the clicked button
    const selectedUnit = e.currentTarget.name;
    
    // Checking if the selected unit is different from the current unit
    if (units !== selectedUnit) setUnits(selectedUnit);
  };

  // Handling the click event when searching for a city
  const handleSearchClick = () => {
    // Checking if the city input is not empty
    if (city !== "") setQuery({ q: city });
  };

  // Handling the click event to fetch the user's location
  const handleLocationClick = () => {
    // Checking if the geolocation API is available in the browser
    if (navigator.geolocation) {
      // Displaying an information toast notification
      toast.info("Fetching user's location.");

      // Fetching the user's current position
      navigator.geolocation.getCurrentPosition((position) => {
        // Displaying a success toast notification
        toast.success("Location fetched!");

        // Extracting latitude and longitude from the position and updating the query state
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        setQuery({ lat, lon });
      });
    }
  };

  // Rendering the JSX for the Inputs component
  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        {/* Input field for searching a city */}
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          type="text"
          placeholder="Search for city...."
          className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase"
        />
        {/* Search icon */}
        <UilSearch
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleSearchClick}
        />
        {/* Location icon for fetching the user's location */}
        <UilLocationPoint
          size={25}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleLocationClick}
        />
      </div>

      {/* Section for temperature unit buttons */}
      <div className="flex flex-row w-1/4 items-center justify-center">
        {/* Button for selecting Celsius */}
        <button
          name="metric"
          className="text-xl text-white font-light transition ease-out hover:scale-125"
          onClick={handleUnitsChange}
        >
          °C
        </button>
        {/* Separator */}
        <p className="text-xl text-white mx-1">|</p>
        {/* Button for selecting Fahrenheit */}
        <button
          name="imperial"
          className="text-xl text-white font-light transition ease-out hover:scale-125"
          onClick={handleUnitsChange}
        >
          °F
        </button>
      </div>
    </div>
  );
}

// Exporting the Inputs component as the default export
export default Inputs;
