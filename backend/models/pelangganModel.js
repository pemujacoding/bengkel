const Pelanggan = require("../schema/Pelanggan");

const findAll = async () => {
  return await Pelanggan.findAll();
};

const findById = async (id) => {
  return await Pelanggan.findByPk(id);
};

const create = async (data) => {
  return await Pelanggan.create(data);
};

const update = async (id, data) => {
  return await Pelanggan.update(data, { where: { id } });
};

const remove = async (id) => {
  return await Pelanggan.destroy({ where: { id } });
};

module.exports = { findAll, findById, create, update, remove };