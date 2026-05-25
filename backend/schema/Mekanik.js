const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mekanik = sequelize.define("mekanik", {
  nama: { type: DataTypes.STRING(200), allowNull: false },
  no_telp: { type: DataTypes.STRING(50) },
  alamat: { type: DataTypes.TEXT }
}, { tableName: 'mekanik', timestamps: false });

module.exports = Mekanik;