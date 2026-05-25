const express = require("express");
const router = express.Router();

const pelangganRoutes = require("./pelangganRoutes");
const mekanikRoutes = require("./mekanikRoutes");
const sparepartRoutes = require("./sparepartRoutes");
const kendaraanRoutes = require("./kendaraanRoutes");
const jadwalServiceRoutes = require("./jadwalServiceRoutes");
const riwayatServiceRoutes = require("./riwayatServiceRoutes");
const sparepartDigunakanRoutes = require("./sparepartDigunakanRoutes");
const transaksiRoutes = require("./transaksiRoutes");

router.use("/pelanggan", pelangganRoutes);
router.use("/mekanik", mekanikRoutes);
router.use("/sparepart", sparepartRoutes);
router.use("/kendaraan", kendaraanRoutes);
router.use("/jadwal-service", jadwalServiceRoutes);
router.use("/riwayat-service", riwayatServiceRoutes);
router.use("/sparepart-digunakan", sparepartDigunakanRoutes);
router.use("/transaksi", transaksiRoutes);

module.exports = router;