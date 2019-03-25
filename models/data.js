const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    // get Timo to send user email for referencing data
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    heartRateData: [],
    heightData: [],
    bodyMassData: [],
    activeEnergyBurnedData: [],
    distanceWalkingRunning: [],
    restingHeartRateData: [],
    stepCountData: [],
})

module.exports = mongoose.model("Data", dataSchema);