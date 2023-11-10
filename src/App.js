// Importing necessary styles and components
import "./App.css";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forcast from "./components/Forcast";
import getFormattedWeatherData from "./services/weatherService";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the main App component
function App() {
  // State variables using the useState hook
  const [query, setQuery] = useState({ q: "berlin" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  // useEffect hook to fetch weather data when component mounts or dependencies change
  useEffect(() => {
    // Function to fetch weather data asynchronously
    const fetchWeather = async () => {
      const message = query.q ? query.q : "current location.";

      // Display a toast notification indicating that weather data is being fetched
      toast.info("Fetching weather for " + message);

      // Asynchronously fetch weather data using the imported service function
      await getFormattedWeatherData({ ...query, units }).then((data) => {
        // Display a success toast notification upon successful data fetch
        toast.success(
          `Successfully fetched weather for ${data.name}, ${data.country}.`
        );

        // Update the weather state with the fetched data
        setWeather(data);
      });
    };

    // Call the fetchWeather function
    fetchWeather();
  }, [query, units]); // Dependencies for the useEffect hook

  // Function to determine the background gradient based on temperature
  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };

  // Render the main component with JSX
  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      {/* Render TopButtons component and pass setQuery function */}
      <TopButtons setQuery={setQuery} />
      {/* Render Inputs component and pass setQuery, units, and setUnits functions */}
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {/* Conditional rendering based on the existence of weather data */}
      {weather && (
        <div>
          {/* Render TimeAndLocation component and pass weather data */}
          <TimeAndLocation weather={weather} />
          {/* Render TemperatureAndDetails component and pass weather data */}
          <TemperatureAndDetails weather={weather} />

          {/* Render Forcast components for hourly and daily forecasts */}
          <Forcast title="hourly Forcast" items={weather.hourly} />
          <Forcast title="daily Forcast" items={weather.daily} />
        </div>
      )}

      {/* Render ToastContainer for displaying toast notifications */}
      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
    </div>
  );
}

// Export the App component as the default export
export default App;
