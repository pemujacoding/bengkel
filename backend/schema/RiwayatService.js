const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Kendaraan = require("./Kendaraan");
const Mekanik = require("./Mekanik");

const RiwayatService = sequelize.define("riwayat_service", {
  id_kendaraan: {
    type: DataTypes.INTEGER,
    references: { model: Kendaraan, key: 'id' }
  },
  id_mekanik: {
    type: DataTypes.INTEGER,
    references: { model: Mekanik, key: 'id' }
  },
  tanggal: {type: DataTypes.DATE},
  keluhan: { type: DataTypes.TEXT, allowNull: false },
  pelayanan: { type: DataTypes.TEXT, allowNull: true },
  status: {type: DataTypes.STRING(20), allowNull:false}
}, { tableName: 'riwayat_service', timestamps: false });

RiwayatService.belongsTo(Kendaraan, { foreignKey: 'id_kendaraan' });
RiwayatService.belongsTo(Mekanik, { foreignKey: 'id_mekanik' });
module.exports = RiwayatService;