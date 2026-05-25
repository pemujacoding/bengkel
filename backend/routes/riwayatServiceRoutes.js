const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/riwayatServiceController");

router.get("/detail/:id", ctrl.getDetailedById);
router.get("/detail/", ctrl.getAllDetailed);
router.get("/kendaraan/:id_kendaraan", ctrl.getByKendaraan);
router.get("/mekanik/:id_mekanik", ctrl.getByMekanik);

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;