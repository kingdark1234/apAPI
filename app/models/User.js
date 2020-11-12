// npm packages
const mongoose = require("mongoose");

// app imports
const { APIError } = require("../helpers");

// globals
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  lastName: String,
  phoneNo: String,
  project: String
});

userSchema.statics = {
  /**
   * Create a Single New Thing
   * @param {object} newUser - an instance of Thing
   * @returns {Promise<Thing, APIError>}
   */
  async createUser(user) {
    const duplicate = await this.findOne({ username: user.username });
    if (duplicate) {
      throw new APIError(
        409,
        "User Already Exists",
        `There is already a user with username '${user.username}'.`
      );
    }
    const newUser = await user.save();
    return newUser.toObject();
  },
  /**
   * Delete a single Thing
   * @param {String} username - the Thing's name
   * @returns {Promise<Thing, APIError>}
   */
  async deleteUser(username) {
    const deleted = await this.findOneAndRemove({ username });
    if (!deleted) {
      throw new APIError(404, "User Not Found", `No User '${username}' found.`);
    }
    return deleted.toObject();
  },
  /**
   * Get a single Thing by name
   * @param {String} name - the Thing's name
   * @returns {Promise<Thing, APIError>}
   */
  async readUser(username) {
    const user = await this.findOne({ username });

    if (!user) {
      throw new APIError(404, "Thing Not Found", `No thing '${username}' found.`);
    }
    return user.toObject();
  },
  /**
   * Get a list of Things
   * @param {Object} query - pre-formatted query to retrieve things.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Things, APIError>}
   */
  async readUsers(query, fields, skip, limit) {
    const users = await this.find(query, fields)
      .skip(skip)
      .limit(limit)
      .sort({ username: 1 })
      .exec();
    if (!users.length) {
      return [];
    }
    return users.map(user => user.toObject());
  },
  /**
   * Patch/Update a single Thing
   * @param {String} userName - the Thing's name
   * @param {Object} userUpdate - the json containing the Thing attributes
   * @returns {Promise<Thing, APIError>}
   */
  async updateUser(userName, userUpdate) {
    const user = await this.findOneAndUpdate({ userName }, userUpdate, {
      new: true
    });
    if (!user) {
      throw new APIError(404, "User Not Found", `No User '${userName}' found.`);
    }
    return user.toObject();
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  delete transformed.password;
  return transformed;
};

/** Ensure MongoDB Indices **/
userSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model("User", userSchema);
