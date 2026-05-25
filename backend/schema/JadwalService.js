// schema/JadwalService.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Kendaraan = require("./Kendaraan");

const JadwalService = sequelize.define("jadwal_service", {
  id_kendaraan: {
    type: DataTypes.INTEGER,
    references: { model: Kendaraan, key: 'id' }
  },
  judul: { type: DataTypes.STRING(50), allowNull: false },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  deskripsi: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'jadwal_service', timestamps: false });

JadwalService.belongsTo(Kendaraan, { foreignKey: 'id_kendaraan' });
module.exports = JadwalService;