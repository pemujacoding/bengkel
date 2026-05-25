const Transaksi = require("../schema/Transaksi");

const findAll = async () => {
  return await Transaksi.findAll();
};

const findById = async (id) => {
  return await Transaksi.findByPk(id);
};

const findByRiwayat = async (id_riwayat) => {
  return await Transaksi.findAll({
    where: { id_riwayat: id_riwayat }
  });
};

const create = async (data) => {
  return await Transaksi.create(data);
};

const update = async (id, data) => {
  return await Transaksi.update(data, { where: { id } });
};

const remove = async (id) => {
  return await Transaksi.destroy({ where: { id } });
};

module.exports = { findAll, findById, findByRiwayat, create, update, remove };