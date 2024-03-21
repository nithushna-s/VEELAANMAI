const mongoose = require("mongoose");
const moment = require("moment");

const rentalSchema = new mongoose.Schema(
  {
   
    land: { type: mongoose.Schema.Types.ObjectId, ref: "Land" },
    startDate: {
      type: String,
      default: () => moment().format("YYYY-MM-DD"),
    },
    endDate: {
      type: String,
      default: () => moment().format("YYYY-MM-DD"),
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    timestamp: {
      type: String,
      default: () => moment().format("YYYY-MM-DD HH.mmA"),
    },
  },
  {
    timestamps: true,
  }
);

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
