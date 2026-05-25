const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database"); 

const app = express();

// 1. CORS harus di atas sebelum route
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World! Backend is running.");
});

const dataRoutes = require("./routes/bengkelRoutes");

// Kita pasang ke Express dengan prefix '/api'
app.use("/data", dataRoutes);
// --------------------------------

// 3. Database Sync & Listen
const port = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    console.log("Database connected");
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("Gagal konek DB, tapi coba jalankan server... Error:", err.message);
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  });