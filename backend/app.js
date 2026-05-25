const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database"); 

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World! Backend is running.");
});

const dataRoutes = require("./routes/bengkelRoutes");
app.use("/data", dataRoutes);

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log("Mencoba menyambungkan ke database...");
  sequelize.sync()
    .then(() => {
      console.log("Database connected & synced successfully!");
    })
    .catch(err => {
      console.error("Database connection failed! Error:", err.message);
      console.log("Aplikasi tetap berjalan, tapi fitur yang butuh DB akan error.");
    });
});