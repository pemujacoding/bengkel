const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sparepartDigunakanController");

router.get("/detail/:id", ctrl.getDetailedById);
router.get("/detail/", ctrl.getAllDetailed);

router.get("/riwayat/:id_riwayat", ctrl.getByRiwayat);

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;