const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    heartRate: { type: JSON },
});

module.exports = mongoose.model("Data", dataSchema);