const express = require("express");
const router = express();
const userVerifyToken = require("../helpers/jwt").verifyTokenUser;

const { therapiesList } = require("../controller/therapyController/index");
const { addTherapi } = require("../controller/therapyController/index");
const { updateTherapi } = require("../controller/therapyController/index");
const { deleteTherapi } = require("../controller/therapyController/index");
const { getbyid } = require("../controller/therapyController/index");
/**
 * USERS LIST
 */
router.get("/", async (req, res) => {
  try {
    var ctrlResponse = await therapiesList.getAll(req);
    res.send(ctrlResponse);
  } catch (err) {
    res.send(err);
  }
});

/**
 * ADD LIST
 */
router.post("/", async (req, res) => {
  try {
    var ctrlResponse = await addTherapi.add(req);
    res.send(ctrlResponse);
  } catch (err) {
    res.send(err);
  }
});

/**
 * getbyid Therapi
 */
router.get("/:id", async (req, res) => {
  try {
    var ctrlResponse = await getbyid.getbyid(req);
    res.send(ctrlResponse);
  } catch (err) {
    res.send(err);
  }
});

/**
 * update Therapi
 */
router.put("/:id", async (req, res) => {
  try {
    var ctrlResponse = await updateTherapi.update(req);
    res.send(ctrlResponse);
  } catch (err) {
    res.send(err);
  }
});

/**
 * Remove Therapi
 */
router.delete("/:id", async (req, res) => {
  try {
    var ctrlResponse = await deleteTherapi.delete(req);
    res.send(ctrlResponse);
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
