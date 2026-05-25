const kendaraanModel = require("../models/kendaraanModel");
const name = "Kendaraan";

const getAll = async (req, res) => {
  try { 
    const data = await kendaraanModel.findAll(); 
    res.json(data); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const getById = async (req, res) => {
  try {
    const data = await kendaraanModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: `${name} tidak ditemukan` });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getByPelanggan = async (req, res) => {
  try {
    const data = await kendaraanModel.findByPelanggan(req.params.id_pelanggan);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try { 
    const data = await kendaraanModel.create(req.body); 
    res.status(201).json(data); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const update = async (req, res) => {
  try { 
    await kendaraanModel.update(req.params.id, req.body); 
    res.json({ message: `${name} Berhasil Diperbarui` }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

const remove = async (req, res) => {
  try { 
    await kendaraanModel.remove(req.params.id); 
    res.json({ message: `${name} Berhasil Dihapus` }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};

module.exports = { getAll, getById, getByPelanggan, create, update, remove };