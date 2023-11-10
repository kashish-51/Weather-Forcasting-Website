import React from "react";

function TopButtons({ setQuery }) {
  const cities = [
    {
      id: 1,
      title: "India",
    },
    {
      id: 2,
      title: "Pakistan",
    },
    {
      id: 3,
      title: "China",
    },
    {
      id: 4,
      title: "Bhutan",
    },
    {
      id: 5,
      title: "Nepal",
    },
  ];

  return (
    <div className="flex items-center justify-around my-6">
      {cities.map((city) => (
        <button
          key={city.id}
          className="text-white text-lg font-medium"
          onClick={() => setQuery({ q: city.title })}
        >
          {city.title}
        </button>
      ))}
    </div>
  );
}

export default TopButtons;