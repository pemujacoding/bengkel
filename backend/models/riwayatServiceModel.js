const RiwayatService = require("../schema/RiwayatService");
const Kendaraan = require("../schema/Kendaraan");
const Mekanik = require("../schema/Mekanik");
const Pelanggan = require("../schema/Pelanggan");

const findAll = async () => {
  return await RiwayatService.findAll();
};

const findById = async (id) => {
  return await RiwayatService.findByPk(id);
};

const findByKendaraan = async (id_kendaraan) => {
  return await RiwayatService.findAll({
    where: { id_kendaraan: id_kendaraan }
  });
};

const findByMekanik = async (id_mekanik) => {
  return await RiwayatService.findAll({
    where: { id_mekanik: id_mekanik }
  });
};

const findWithDetails = async (id) => {
  return await RiwayatService.findByPk(id, {
    include: [
      {
        model: Kendaraan,
        required: true,
        include: [
          {
            model: Pelanggan,
            required: true
          }
        ]
      },
      {
        model: Mekanik,
        required: true
      } 
    ]
  });
};

const findAllWithDetails = async () => {
  return await RiwayatService.findAll({
    include: [
      {
        model: Kendaraan,
        required: true,
        include: [
          {
            model: Pelanggan,
            required: true
          }
        ]
      },
      {
        model: Mekanik,
        required: true
      }
    ]
  });
};

const create = async (data) => {
  return await RiwayatService.create(data);
};

const update = async (id, data) => {
  return await RiwayatService.update(data, { where: { id } });
};

const remove = async (id) => {
  return await RiwayatService.destroy({ where: { id } });
};

module.exports = { findAll, findById, findByKendaraan, findByMekanik, findAllWithDetails, findWithDetails, create, update, remove };