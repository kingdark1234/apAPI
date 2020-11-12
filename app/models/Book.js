// npm packages
const mongoose = require("mongoose");

// app imports
const { APIError } = require("../helpers");

// globals
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  titleTH: String,
  titleEN: String,
  detailTH: String,
  detailEN: String,
  project: String,
  startDate: Date,
  stopDate: Date,
});


bookSchema.statics = {
  async readBook(project) {
    try {
      const book = await this.find({project:[project,'All']});

      if (!book) {
        throw new APIError(404, "Book Not Found", `No thing '${project}' found.`);
      }
      console.log(book)
    return book;  
    } catch (error) {
      console.log(error)
    }
  },
}

/* Transform with .toObject to remove __v and _id from response */
if (!bookSchema.options.toObject) bookSchema.options.toObject = {};
bookSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  delete transformed.password;
  return transformed;
};

/** Ensure MongoDB Indices **/
bookSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model("Book", bookSchema);