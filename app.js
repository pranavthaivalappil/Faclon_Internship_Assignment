

require("dotenv").config();
const mongoose = require("mongoose");
const Sensor = require("./models/Sensor");

const express = require("express");

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running ");
});

//Post route

app.post("/api/sensor/ingest", async (req, res) => {
    try {
      const { deviceId, temperature, timestamp } = req.body;
  
      // Validation
      if (!deviceId || temperature === undefined) {
        return res.status(400).json({
          error: "deviceId and temperature are required"
        });
      }
  
      const sensorData = new Sensor({
        deviceId,
        temperature,
        timestamp: timestamp || Date.now()
      });
  
      await sensorData.save();
  
      res.status(201).json({
        message: "Sensor data ingested successfully"
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error"
      });
    }
  });

  //Get
  app.get("/api/sensor/:deviceId/latest", async (req, res) => {
  try {
    const { deviceId } = req.params;

    const latestReading = await Sensor.findOne({ deviceId })
      .sort({ timestamp: -1 });

    if (!latestReading) {
      return res.status(404).json({
        error: "No data found for this device"
      });
    }

    res.json(latestReading);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

  

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
})

  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });



