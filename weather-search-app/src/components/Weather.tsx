import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Typography,
  Box
} from "@mui/material";
import axios from "axios";

import type { Coords, WeatherData } from "@/types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export default function WeatherSearch(): React.JSX.Element {
  const [cityQuery, setCityQuery] = useState<string>("");
  const [zipQuery, setZipQuery] = useState<string>("");
  const [coords, setCoords] = useState<Coords>({ lat: "", lon: "" });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);

  const fetchWeather = async (url: string): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get<WeatherData>(url);
      setWeather(response.data);
    } catch (err: any) {
      setError("Failed to fetch weather data: " + (err.message || "Unknown error"));
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (type: "city" | "zip" | "coords"): void => {
    let url = "https://api.openweathermap.org/data/3.0/onecall?units=metric&exclude=minutely,hourly,daily,alerts&appid=" + API_KEY;
    if (type === "city" || type === "zip") {
      const locationUrl = `https://api.openweathermap.org/geo/1.0/${type === "city" ? "direct" : "zip"}?${type === "city" ? `q=${cityQuery}` : `zip=${zipQuery}`}&limit=1&appid=${API_KEY}`;
      axios.get(locationUrl)
        .then(res => {
          const location = Array.isArray(res.data) ? res.data[0] : res.data;
          if (!location || !location.lat || !location.lon) throw new Error("Invalid location response");
          const coordUrl = `${url}&lat=${location.lat}&lon=${location.lon}`;
          fetchWeather(coordUrl);
        })
        .catch(err => {
          setError("Failed to fetch location data: " + (err.message || "Unknown error"));
          setLoading(false);
        });
    } else if (type === "coords") {
      const coordUrl = `${url}&lat=${coords.lat}&lon=${coords.lon}`;
      fetchWeather(coordUrl);
    }
  };

  const handleGeolocation = (): void => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`;
        fetchWeather(url);
      },
      (err) => {
        setError("Failed to retrieve your location: " + err.message);
        setLoading(false);
      }
    );
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Weather Search App
      </Typography>
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="City" />
        <Tab label="Zip Code" />
        <Tab label="Coordinates" />
      </Tabs>
      {tabIndex === 0 && (
        <Box mt={2}>
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={() => handleSearch("city")} disabled={loading}>
            Search
          </Button>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box mt={2}>
          <TextField
            label="Zip Code"
            variant="outlined"
            fullWidth
            value={zipQuery}
            onChange={(e) => setZipQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={() => handleSearch("zip")} disabled={loading}>
            Search
          </Button>
        </Box>
      )}
      {tabIndex === 2 && (
        <Box mt={2}>
          <TextField
            label="Latitude"
            variant="outlined"
            fullWidth
            value={coords.lat}
            onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Longitude"
            variant="outlined"
            fullWidth
            value={coords.lon}
            onChange={(e) => setCoords({ ...coords, lon: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={() => handleSearch("coords")} disabled={loading}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleGeolocation} disabled={loading} sx={{ ml: 2 }}>
            Use My Location
          </Button>
        </Box>
      )}

      {loading && <Typography mt={2}>Loading...</Typography>}
      {error && <Typography color="error" mt={2}>{error}</Typography>}

      {weather && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Weather Data</Typography>
            <Typography>Temperature: {weather.current.temp} °C</Typography>
            <Typography>Weather: {weather.current.weather[0].description}</Typography>
            <Typography>Humidity: {weather.current.humidity}%</Typography>
            <Typography>Wind Speed: {weather.current.wind_speed} m/s</Typography>
            <Typography>Wind Direction: {weather.current.wind_deg}°</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
