const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const CourseSchema = new Schema({
  block: {
    type: String,
  },
  teacher: {
    type: String,
  },
  course: {
    type: String,
  },

  // a two dimensional array containing the date assigned, and the homework itself
  homework: {
    type: Array
  },
  code: {
    type: String
  }
});

var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
