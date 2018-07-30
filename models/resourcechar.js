const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const resourceSchema = new Schema({
  url : {
    type: String,
    required: true
  },
  class : {
    type: String,
    required :true
  },
  type: {
    type: String
  },
  description: {
    type: String
  }
});

var Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
