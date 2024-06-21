const mongoose = require("mongoose");

const ResponsesSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  activityName: {
    type: String,
    required: true,
  },
  satisfactionLevel: {
    type: Number,
    required: true,
  },
  activities: {
    type: [String],
    required: true,
  },
  question1: {
    type: Number,
    required: true,
  },
  question2: {
    type: Number,
    required: true,
  },
  question3: {
    type: Number,
    required: true,
  },
  question4: {
    type: Number,
    required: true,
  },
  question5: {
    type: Number,
    required: true,
  },
  question6: {
    type: Number,
    required: true,
  },
  question7: {
    type: Number,
    required: true,
  },
  question8: {
    type: Number,
    required: true,
  },
  question9: {
    type: Number,
    required: true,
  },
  question10: {
    type: Number,
    required: true,
  },
  question11: {
    type: Number,
    required: true,
  },
  question12: {
    type: Number,
    required: true,
  },
  question13: {
    type: Number,
    required: true,
  },
  positive: {
    type: Number,
    required: true,
  },
  negative: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Responses", ResponsesSchema);
