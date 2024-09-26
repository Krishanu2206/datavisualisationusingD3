const express = require("express");
const router =express.Router();
const getalldatacontroller = require("../controllers/datacontroller");

//routers
router.get("/getalldata", getalldatacontroller);

module.exports = router;