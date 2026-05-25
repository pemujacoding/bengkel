const JadwalService = require("../schema/JadwalService");

const findAll = async () => {
  return await JadwalService.findAll();
};

const findById = async (id) => {
  return await JadwalService.findByPk(id);
};

const findByKendaraan = async (id_kendaraan) => {
  return await JadwalService.findAll({
    where: { id_kendaraan: id_kendaraan }
  });
};

const create = async (data) => {
  return await JadwalService.create(data);
};

const update = async (id, data) => {
  return await JadwalService.update(data, { where: { id } });
};

const remove = async (id) => {
  return await JadwalService.destroy({ where: { id } });
};

module.exports = { findAll, findById, findByKendaraan, create, update, remove };