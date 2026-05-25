const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const RiwayatService = require("./RiwayatService");
const Sparepart = require("./Sparepart");

const SparepartDigunakan = sequelize.define("sparepart_digunakan", {
  id_riwayat: {
    type: DataTypes.INTEGER,
    references: { model: RiwayatService, key: 'id' }
  },
  id_sparepart: {
    type: DataTypes.INTEGER,
    references: { model: Sparepart, key: 'id' }
  },
  jumlah: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'sparepart_digunakan', timestamps: false });

SparepartDigunakan.belongsTo(RiwayatService, { foreignKey: 'id_riwayat' });
SparepartDigunakan.belongsTo(Sparepart, { foreignKey: 'id_sparepart' });
module.exports = SparepartDigunakan;