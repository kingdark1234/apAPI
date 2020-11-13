// npm packages
const { validate } = require("jsonschema");

// app imports
const { User,Book,Read } = require("../models");
const { APIError } = require("../helpers");
const { userNewSchema,readSchema } = require("../schemas");

/**
 * Validate the POST request body and create a new Thing
 */
async function createUser(request, response, next) {
  const validation = validate(request.body, userNewSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
  }

  try {
    const newUser = await User.createUser(new User(request.body));
    return response.status(201).json(newUser);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single thing
 * @param {String} name - the name of the Thing to retrieve
 */
async function readUser(request, response, next) {
  const { username } = request.params;
  try {
    const userNameRes = await User.readUser(username);
    return response.json(userNameRes);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single thing
 * @param {String} name - the name of the Thing to update
 */
async function updateUser(request, response, next) {
  const { username } = request.params;

  const validation = validate(request.body, userNewSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
  }

  try {
    const user = await User.updateUser(username, request.body);
    return response.json(user);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single thing
 * @param {String} name - the name of the Thing to remove
 */
async function deleteUser(request, response, next) {
  const { username } = request.params;
  try {
    const deleteMsg = await User.deleteUser(username);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
}

async function getBooks(request, response, next) {
  const { username } = request.params;
  try {
    const userNameRes = await User.readUser(username);
    const project = userNameRes.project
    const bookRes = await Book.getBooks(project)
    return response.json(bookRes);
  } catch (err) {
    return next(err);
  }
}

async function readBooks(request, response, next) {
  const validation = validate(request.body, readSchema);
  if (!validation.valid) {
    return next(
      new APIError(
        400,
        "Bad Request",
        validation.errors.map(e => e.stack).join(". ")
      )
    );
  }

  try {
    const {username,title} = request.body
    const userNameRes = await User.readUser(username);
    const bookRes = await Book.getBook(title)
    console.log(userNameRes.project,bookRes.project)
    if(userNameRes.project !== bookRes.project && bookRes.project !== 'All'){
      return next(
        new APIError(
          403,
          "Permission deny",
          "You do not read other project"
        )
      );
    }
    const payload = {...request.body, readAt:new Date()}
    const newRead = await Read.createRead(new Read(payload));
    return response.status(201).json(newRead);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  getBooks,
  readBooks
};
