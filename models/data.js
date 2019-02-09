const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    heartRate: Object,
});

module.exports = mongoose.model("Data", dataSchema);