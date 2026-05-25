const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pelanggan = sequelize.define("pelanggan", {
  nama: { type: DataTypes.STRING(200), allowNull: false },
  no_telp: { type: DataTypes.STRING(50) },
  alamat: { type: DataTypes.TEXT },
  username: {type: DataTypes.STRING(20)},
  password: {type: DataTypes.STRING(64)}
}, { tableName: 'pelanggan', timestamps: false });

module.exports = Pelanggan;