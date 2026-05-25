// schema/Transaksi.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const RiwayatService = require("./RiwayatService");

const Transaksi = sequelize.define("transaksi", {
  id_riwayat: {
    type: DataTypes.INTEGER,
    references: { model: RiwayatService, key: 'id' }
  },
  nominal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  metode: { type: DataTypes.STRING(200) },
  status: { type: DataTypes.STRING(50) }
}, { tableName: 'transaksi', timestamps: false });

Transaksi.belongsTo(RiwayatService, { foreignKey: 'id_riwayat' });
module.exports = Transaksi;