# Weather Search App

This React + TypeScript application allows users to search for current weather conditions by:

- City name
- Zip code
- GPS coordinates
- Or use their current location (via geolocation)

It uses the **OpenWeather API v3.0** with the **One Call** endpoint and is built with **Vite** and **Material UI (MUI)**.

---

## ✨ Features

- Simple tab-based UI for multiple input types
- Live geolocation support
- Error handling and loading states
- Clean, typed architecture for easy maintenance

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/weather-search-app.git
cd weather-search-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root of your project and add your OpenWeather API key:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

> ⚠️ Make sure to restart the dev server after creating this file.

### 4. Start the App

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to use the app.

---

## 💡 Example Inputs

- City: `London`, `Tokyo`
- Zip Code: `90210` (US), `SW1A` (UK - include country code if needed)
- Coordinates: `lat: 51.5074`, `lon: -0.1278`

Use the "Use My Location" button to fetch data from your current location.

---

## 📁 Project Structure

```
src/
├── components/        # Main React components
├── types/             # TypeScript interfaces (e.g. weather.ts)
├── App.tsx            # Main app entry
└── main.tsx           # Vite root entry
```

---

## 🏃 Roadmap Ideas

- Add hourly and daily forecasts
- Theme toggle (light/dark mode)
- Weather icons and map integration

---

## ✉️ License

This project is open-source and available under the [MIT License](LICENSE).

