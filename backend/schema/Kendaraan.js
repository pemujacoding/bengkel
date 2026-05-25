const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Pelanggan = require("./Pelanggan");

const Kendaraan = sequelize.define("kendaraan", {
  id_pelanggan: {
    type: DataTypes.INTEGER,
    references: { model: Pelanggan, key: 'id' }
  },
  jenis: { type: DataTypes.STRING(50) },
  merk: { type: DataTypes.STRING(100) },
  plat: { type: DataTypes.STRING(50) }
}, { tableName: 'kendaraan', timestamps: false });

Kendaraan.belongsTo(Pelanggan, { foreignKey: 'id_pelanggan' });
module.exports = Kendaraan;