const transaksiModel = require("../models/transaksiModel");
const name = "Transaksi";

const getAll = async (req, res) => {
  try { 
    const data = await transaksiModel.findAll(); 
    res.json(data); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const getById = async (req, res) => {
  try {
    const data = await transaksiModel.findById(req.params.id);
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
    const data = await transaksiModel.findByRiwayat(req.params.id_riwayat);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try { 
    const data = await transaksiModel.create(req.body); 
    res.status(201).json(data); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const update = async (req, res) => {
  try { 
    await transaksiModel.update(req.params.id, req.body); 
    res.json({ message: `${name} Berhasil Diperbarui` }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const remove = async (req, res) => {
  try { 
    await transaksiModel.remove(req.params.id); 
    res.json({ message: `${name} Berhasil Dihapus` }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

module.exports = { getAll, getById, getByRiwayat, create, update, remove };