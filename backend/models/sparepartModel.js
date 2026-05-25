const Sparepart = require("../schema/Sparepart");

const findAll = async () => {
  return await Sparepart.findAll();
};

const findById = async (id) => {
  return await Sparepart.findByPk(id);
};

const create = async (data) => {
  return await Sparepart.create(data);
};

const update = async (id, data) => {
  return await Sparepart.update(data, { where: { id } });
};

const remove = async (id) => {
  return await Sparepart.destroy({ where: { id } });
};

module.exports = { findAll, findById, create, update, remove };