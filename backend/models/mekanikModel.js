const Mekanik = require("../schema/Mekanik");

const findAll = async () => {
  return await Mekanik.findAll();
};

const findById = async (id) => {
  return await Mekanik.findByPk(id);
};

const create = async (data) => {
  return await Mekanik.create(data);
};

const update = async (id, data) => {
  return await Mekanik.update(data, { where: { id } });
};

const remove = async (id) => {
  return await Mekanik.destroy({ where: { id } });
};

module.exports = { findAll,  findById, create, update, remove };