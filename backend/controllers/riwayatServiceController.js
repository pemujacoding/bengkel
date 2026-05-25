const riwayatServiceModel = require("../models/riwayatServiceModel");
const name = "Riwayat Service";

const getAll = async (req, res) => {
  try { 
    const data = await riwayatServiceModel.findAll(); 
    res.json(data); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const getById = async (req, res) => {
  try {
    const data = await riwayatServiceModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: `${name} tidak ditemukan` });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getByKendaraan = async (req, res) => {
  try {
    const data = await riwayatServiceModel.findByKendaraan(req.params.id_kendaraan);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getByMekanik = async (req, res) => {
  try {
    const data = await riwayatServiceModel.findByMekanik(req.params.id_mekanik);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDetailedById = async (req, res) => {
    try {
      const data = await riwayatServiceModel.findWithDetails(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Riwayat service tidak ditemukan" });
      }      
      res.json(data); 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const getAllDetailed = async (req, res) => {
    try {
      const data = await riwayatServiceModel.findAllWithDetails(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Riwayat service tidak ditemukan" });
      }      
      res.json(data); 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
  try { 
    const data = await riwayatServiceModel.create(req.body); 
    res.status(201).json(data); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const update = async (req, res) => {
  try { 
    await riwayatServiceModel.update(req.params.id, req.body); 
    res.json({ message: `${name} Berhasil Diperbarui` }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const remove = async (req, res) => {
  try { 
    await riwayatServiceModel.remove(req.params.id); 
    res.json({ message: `${name} Berhasil Dihapus` }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

module.exports = { getAll, getById, getByKendaraan, getByMekanik, getDetailedById, getAllDetailed,create, update, remove };