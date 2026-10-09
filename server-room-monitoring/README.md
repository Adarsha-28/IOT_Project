# IoT-Based Server Room Temperature Monitoring and Warning System

A complete, industrial-grade IoT environmental monitoring and threshold warning dashboard designed for college project demonstrations and actual server room installations.

---

## 📌 Project Overview

The **IoT-Based Server Room Temperature Monitoring and Warning System** continuously monitors the ambient temperature and humidity of a server room using a **DHT11 sensor** connected to an **ESP32 DevKit V1** microcontroller. 

The ESP32 reads sensor values, evaluates them against predefined temperature thresholds, drives hardware indicator LEDs, and transmits telemetry packets over Wi-Fi to a Node.js/Express REST backend backed by MongoDB.

> **IMPORTANT SYSTEM SCOPE:**
> This is strictly a **MONITORING AND WARNING SYSTEM**. It monitors real-time environmental conditions and issues immediate alerts when temperature thresholds are crossed.
> It does **NOT** use prediction, predictive maintenance, artificial intelligence, or early warning heuristics.

---

## ⚙️ Predefined Temperature Threshold Logic

The system adheres strictly to the following fixed threshold rules:

| Temperature Range | System Status | Dashboard Accent | Green LED (GPIO 18) | Red LED (GPIO 19) | Status Message |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **≤ 30.0 °C** | **NORMAL** | Green | **ON** | **OFF** | *Temperature within normal range* |
| **> 30.0 °C and ≤ 35.0 °C** | **WARNING** | Orange | **OFF** | **ON** | *Temperature above normal range* |
| **> 35.0 °C** | **HIGH TEMPERATURE** | Red | **OFF** | **ON** | *High temperature detected* |

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (Clean industrial theme, light slate background, crisp white cards)
- **Charts:** Recharts (Line charts with static reference threshold lines at 30°C and 35°C)
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend & Database
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js REST API
- **Database:** MongoDB
- **Database Name:** `ServerRoomMonitoring`
- **Collections:** `sensor_data`, `warnings`
- **Fallback:** Automatic in-memory persistence when MongoDB service is offline

### Hardware / Firmware
- **Microcontroller:** ESP32 DevKit V1 (30-pin / 36-pin)
- **Sensor:** DHT11 Digital Temperature & Humidity Sensor
- **Protocol:** Wi-Fi (HTTP REST POST telemetry)
- **Firmware:** Arduino C++ (`esp32/server_room_esp32.ino`)

---

## 🔌 Hardware Wiring & Pin Mapping

| Component | ESP32 Pin | Details |
| :--- | :--- | :--- |
| **DHT11 DATA** | **GPIO 4** | Digital Input with 10kΩ pull-up to 3.3V |
| **DHT11 VCC** | **3.3V** | Operating Voltage |
| **DHT11 GND** | **GND** | Common Ground |
| **Green Status LED** | **GPIO 18** | Output (Current-limiting 220Ω resistor to GND) |
| **Red Warning LED** | **GPIO 19** | Output (Current-limiting 220Ω resistor to GND) |

---

## 🗄️ Database Schemas (MongoDB)

### Database: `ServerRoomMonitoring`

#### 1. Collection: `sensor_data`
```json
{
  "temperature": 32.5,
  "humidity": 61.0,
  "status": "WARNING",
  "timestamp": "2026-10-07T13:30:00.000Z"
}
```

#### 2. Collection: `warnings`
```json
{
  "temperature": 36.2,
  "humidity": 68.0,
  "status": "HIGH TEMPERATURE",
  "message": "High temperature detected",
  "timestamp": "2026-10-07T13:30:00.000Z"
}
```

---

## 🌐 REST API Endpoints

### 1. `GET /api/sensor/latest`
Returns the most recent sensor reading and active LED states.
```json
{
  "temperature": 32.5,
  "humidity": 61.0,
  "status": "WARNING",
  "message": "Temperature above normal range",
  "timestamp": "2026-10-07T13:30:00.000Z",
  "ledStatus": {
    "greenLed": false,
    "redLed": true
  }
}
```

### 2. `GET /api/sensor/history?range=24h`
Query params: `range=1h|6h|24h|7d`  
Returns chronological readings for graphing.

### 3. `GET /api/warnings`
Returns the latest threshold breach events and recovery logs.

### 4. `POST /api/sensor/data`
Used by the ESP32 to publish sensor data.
```json
// Request:
{
  "temperature": 32.5,
  "humidity": 61.0
}

// Response:
{
  "success": true,
  "temperature": 32.5,
  "humidity": 61.0,
  "status": "WARNING",
  "message": "Temperature above normal range",
  "timestamp": "2026-10-07T13:30:00.000Z",
  "ledStatus": {
    "greenLed": false,
    "redLed": true
  }
}
```

---

## 🚀 Running the Project

### 1. Backend Server
```bash
cd server
npm install
npm run dev
```
*Backend runs on `http://localhost:5000` with MongoDB connection to `mongodb://127.0.0.1:27017/ServerRoomMonitoring`.*

### 2. Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🎮 Presentation & Demo Mode

The dashboard features an integrated **Demo Mode** (`VITE_DEMO_MODE=true` in `client/.env` or toggleable via the header button):
- Simulates realistic temperature variations and humidity telemetry.
- Includes a **Threshold Demonstration Controller** in the Live Monitoring section:
  - **Normal (27°C):** Turns badge green, status NORMAL, Green LED ON.
  - **Warning (32.5°C):** Turns badge orange, status WARNING, Red LED ON.
  - **High Temp (36.8°C):** Turns badge red, status HIGH TEMPERATURE, Red LED ON.
- Allows seamless switching between Live ESP32 mode and Demo mode with a single click.
