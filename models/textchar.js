const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const TextSchema = new Schema({
  date : {
    type: Date
  },
  body : {
    type: String
  },
  submittedBy : {
    type: String
  },
});

var Text = mongoose.model('Text', TextSchema);
module.exports = Text;
