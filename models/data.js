const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    heartRateData: Object,
});

module.exports = mongoose.model("Data", dataSchema);