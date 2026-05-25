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