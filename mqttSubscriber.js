const mqtt = require("mqtt");
const mongoose = require("mongoose");
require("dotenv").config();

const Sensor = require("./models/Sensor");

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (MQTT)"))
  .catch(err => console.error("MongoDB connection error:", err.message));

// 2. Connect to MQTT broker (public broker)
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// 3. Subscribe when connected
client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe("iot/sensor/+/temperature", (err) => {
    if (err) {
      console.error("MQTT subscription error:", err.message);
    } else {
      console.log("Subscribed to topic: iot/sensor/+/temperature");
    }
  });
});

// 4. Handle incoming messages
client.on("message", async (topic, message) => {
  try {
    // Example topic: iot/sensor/sensor-01/temperature
    const parts = topic.split("/");
    const deviceId = parts[2];

    const payload = JSON.parse(message.toString());
    const temperature = payload.temperature;
    const timestamp = payload.timestamp || Date.now();

    if (temperature === undefined) {
      console.log("Invalid MQTT message: temperature missing");
      return;
    }

    const sensorData = new Sensor({
      deviceId,
      temperature,
      timestamp
    });

    await sensorData.save();
    console.log(`Saved MQTT data for device: ${deviceId}`);
  } catch (error) {
    console.error("Error processing MQTT message:", error.message);
  }
});
