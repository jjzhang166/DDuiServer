// DB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ddui');
exports.mongoose = mongoose;
