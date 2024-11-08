import { useState } from "react";

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError('');
        
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        );
        console.log(geoResponse);
        const geoData = await geoResponse.json();
        
        if (!geoData.results?.length) {
          throw new Error('City not found');
        }
  
        const { latitude, longitude } = geoData.results[0];
        
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        console.log(weatherResponse);
        const weatherData = await weatherResponse.json();
        
        setWeather({
          city: geoData.results[0].name,
          country: geoData.results[0].country,
          temperature: Math.round(weatherData.current.temperature_2m),
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: weatherData.current.wind_speed_10m,
          precipitation: weatherData.current.precipitation,
          weatherCode: weatherData.current.weather_code,
          forecast: weatherData.daily
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };
  
    const getWeatherEmoji = (code) => {
      if (code === 0) return '☀️';
      if (code === 1) return '🌤️';
      if (code === 2) return '⛅';
      if (code === 3) return '☁️';
      if (code >= 45 && code <= 48) return '🌫️';
      if (code >= 51 && code <= 55) return '🌧️';
      if (code >= 61 && code <= 65) return '🌧️';
      if (code >= 71 && code <= 75) return '🌨️';
      if (code === 95) return '⛈️';
      return '🌈';
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
        <h1 className="text-center text-3xl text-white p-3 font-bold ">Weather Now</h1>
        <div className="max-w-3xl mx-auto">
         
          <div className="bg-white rounded-lg p-4 mb-4 shadow-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
              />
              <button
                onClick={fetchWeather}
                disabled={loading || !city}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </div>
  
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
  
          {weather && !loading && (
            <div className="space-y-4">
              
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">
                    {weather.city}, {weather.country}
                  </h2>
                  <div className="text-6xl font-bold text-blue-500 mb-2">
                    {getWeatherEmoji(weather.weatherCode)} {weather.temperature}°C
                  </div>
                </div>
  
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 mb-1">Wind Speed</div>
                    <div className="text-xl font-semibold">{weather.windSpeed} km/h</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 mb-1">Humidity</div>
                    <div className="text-xl font-semibold">{weather.humidity}%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 mb-1">Rain</div>
                    <div className="text-xl font-semibold">{weather.precipitation} mm</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-gray-500 mb-1">Temperature</div>
                    <div className="text-xl font-semibold">{weather.temperature}°C</div>
                  </div>
                </div>
              </div>
  
             
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">5-Day Forecast</h3>
                <div className="grid gap-4">
                  {weather.forecast.time.slice(0, 5).map((date, index) => (
                    <div key={date} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div>
                        <div className="font-medium">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl mb-1">
                          {Math.round(weather.forecast.temperature_2m_max[index])}°
                        </div>
                        <div className="text-gray-500">
                          {Math.round(weather.forecast.temperature_2m_min[index])}°
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default WeatherApp;