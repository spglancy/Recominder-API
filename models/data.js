const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    // get Timo to send user email for referencing data
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    heartRateData: Object,
    heightData: Object,
    bodyMassData: Object,
    activeEnergyBurnedData: Object,
    distanceWalkingRunning: Object,
    restingHeartRateData: Object,
    stepCountData: Object,
})

module.exports = mongoose.model("Data", dataSchema);