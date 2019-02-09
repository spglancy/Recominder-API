const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processedDataSchema = new Schema({
    heartRateData: Object,
});

module.exports = mongoose.model("processedData", processedDataSchema);