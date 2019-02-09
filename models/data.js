const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    heartRate: { type: Object },
});

module.exports = mongoose.model("Data", dataSchema);