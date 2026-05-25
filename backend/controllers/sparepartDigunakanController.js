const SparepartDigunakanModel = require("../models/SparepartDigunakanModel");
const name = "Sparepart Digunakan";

const getAll = async (req, res) => {
  try { 
    const data = await SparepartDigunakanModel.findAll(); 
    res.json(data); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const getById = async (req, res) => {
  try {
    const data = await SparepartDigunakanModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: `${name} tidak ditemukan` });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getByRiwayat = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await SparepartDigunakanModel.findByRiwayat(req.params.id_riwayat);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDetailedById = async (req, res) => {
    try {
      const data = await SparepartDigunakanModel.findWithDetails(req.params.id);
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
      const data = await SparepartDigunakanModel.findAllWithDetails(req.params.id);
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
    const data = await SparepartDigunakanModel.create(req.body); 
    res.status(201).json(data); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const update = async (req, res) => {
  try { 
    await SparepartDigunakanModel.update(req.params.id, req.body); 
    res.json({ message: `${name} Berhasil Diperbarui` }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const remove = async (req, res) => {
  try { 
    await SparepartDigunakanModel.remove(req.params.id); 
    res.json({ message: `${name} Berhasil Dihapus` }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

module.exports = { getAll, getById, getByRiwayat, getDetailedById, getAllDetailed, create, update, remove };