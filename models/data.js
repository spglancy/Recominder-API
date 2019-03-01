const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    // get Timo to send user email for referencing data
    userId: { type: Schema.Types.ObjectId, ref: "User" },
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
    stepCountData: Object,
    createdAt: Date
});

dataSchema.pre("save", function(next) {
    //setting the createdAt date
    this.createdAt = new Date();
   next();
  });

module.exports = mongoose.model("Data", dataSchema);