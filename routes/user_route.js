const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");

// one endpoint, /api/user with an optional /:id, for every method
router.route("/{:id}")
    .get(userController.getUsers)
    .post(userController.createUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)
    .all(userController.methodNotAllowed);

module.exports = router;
