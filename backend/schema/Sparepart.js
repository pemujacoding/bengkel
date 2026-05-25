const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sparepart = sequelize.define("sparepart", {
  nama: { type: DataTypes.STRING(200), allowNull: false },
  harga: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  kategori: { type: DataTypes.STRING(100) },
  merk: { type: DataTypes.STRING(200) },
  stok: { type: DataTypes.INTEGER, defaultValue: 0 },
  deskripsi: { type: DataTypes.TEXT, allowNull: true },
  gambar: {type: DataTypes.TEXT, allowNull: true}
}, { tableName: 'sparepart', timestamps: false });

module.exports = Sparepart;