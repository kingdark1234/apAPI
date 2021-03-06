// npm packages
const express = require("express");

// app imports
const { UserHandler, UsersHandler } = require("../handlers");

// globals
const router = new express.Router();
const { readUsers } = UsersHandler;
const { createUser, readUser, updateUser, deleteUser,getBooks,readBooks } = UserHandler;

/* All the Things Route */
router
  .route("")
  .get(readUsers)
  .post(createUser);

/* Single Thing by Name Route */
router
  .route("/:username")
  .get(readUser)
  .patch(updateUser)
  .delete(deleteUser);

router
  .route("/read")
  .post(readBooks)

router
  .route("/read/:username")
  .get(getBooks)

module.exports = router;
