const RiwayatService = require("../schema/RiwayatService");
const Sparepart = require("../schema/Sparepart");
const SparepartDigunakan = require("../schema/SparepartDigunakan");


const findAll = async () => {
  return await SparepartDigunakan.findAll({
    include: [{ model: Sparepart }] // Ikut sertakan detail sparepart agar namanya muncul
  });
};

const findById = async (id) => {
  return await SparepartDigunakan.findByPk(id, {
    include: [{ model: Sparepart }]
  });
};

const findByRiwayat = async (id_riwayat) => {
  return await SparepartDigunakan.findAll({
    where: { id_riwayat: id_riwayat },
    include: [
      {
        model: Sparepart,
        required: true
      }
    ]
  });
};

const findWithDetails = async (id) => {
  return await SparepartDigunakan.findByPk(id, {
    include: [
      {
        model: RiwayatService,
        required: true
      },
      {
        model: Sparepart,
        required: true
      }
    ]
  });
};

const findAllWithDetails = async () => {
  return await SparepartDigunakan.findAll({
    include: [
      {
        model: RiwayatService,
        required: true
      },
      {
        model: Sparepart,
        required: true
      }
    ]
  });
};

const create = async (data) => {
  return await SparepartDigunakan.create(data);
};

const update = async (id, data) => {
  return await SparepartDigunakan.update(data, { where: { id } });
};

const remove = async (id) => {
  return await SparepartDigunakan.destroy({ where: { id } });
};

module.exports = { findAll, findById, findByRiwayat, findWithDetails, findAllWithDetails, create, update, remove };