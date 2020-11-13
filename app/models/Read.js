// npm packages
const mongoose = require("mongoose");

// app imports
const { APIError } = require("../helpers");

// globals
const Schema = mongoose.Schema;

const readSchema = new Schema({
  username: String,
  title: String,
  readAt: Date,
});


readSchema.statics = {
  async createRead(read) {
    const newRead = await read.save();
    return newRead.toObject();
  },
}

/* Transform with .toObject to remove __v and _id from response */
if (!readSchema.options.toObject) readSchema.options.toObject = {};
readSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
readSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model("Read", readSchema);