const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    heartRateData: Object,
    heightData: Object,
    bloodPressureSystolicData: Object,
    bloodPressureDiastolicData: Object,
    bodyMassData: Object,
    bodyTemperatureData: Object,
    activeEnergyBurnedData: Object,
    leanBodyMassData: Object,
    respiratoryRateData: Object,
    restingHeartRateData: Object,
    stepCountData: Object
});

module.exports = mongoose.model("Data", dataSchema);