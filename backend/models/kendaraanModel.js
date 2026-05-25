const Kendaraan = require("../schema/Kendaraan");

const findAll = async () => {
  return await Kendaraan.findAll();
};

const findById = async (id) => {
  return await Kendaraan.findByPk(id);
};

const findByPelanggan = async (id_pelanggan) => {
  return await Kendaraan.findAll({
    where: { id_pelanggan: id_pelanggan }
  });
};

const create = async (data) => {
  return await Kendaraan.create(data);
};

const update = async (id, data) => {
  return await Kendaraan.update(data, { where: { id } });
};

const remove = async (id) => {
  return await Kendaraan.destroy({ where: { id } });
};

module.exports = { findAll, findById, findByPelanggan, create, update, remove };