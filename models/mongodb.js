// DB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fuck');
exports.mongoose = mongoose;
