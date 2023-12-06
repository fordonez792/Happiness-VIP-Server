const express = require("express");
const { parse } = require("json2csv");
const fs = require("fs");
const path = require("path");

const Responses = require("../models/Responses");
const { authenticateToken } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { email, activitiesSelected, responses } = req.body;
  let response;

  try {
    if (email !== "") {
      response = await Responses.findOne({
        email,
      });
    }

    if (response) {
      return res.status(400).json({
        status: "FAILED",
        message: "This email already filled survey",
      });
    }

    const positive =
      (parseInt(responses["1"]) +
        parseInt(responses["2"]) +
        parseInt(responses["3"])) /
      3;
    const negative =
      (parseInt(responses["4"]) +
        parseInt(responses["5"]) +
        parseInt(responses["6"])) /
      3;

    const newResponse = new Responses({
      email,
      activities: activitiesSelected,
      question1: parseInt(responses["1"]),
      question2: parseInt(responses["2"]),
      question3: parseInt(responses["3"]),
      question4: parseInt(responses["4"]),
      question5: parseInt(responses["5"]),
      question6: parseInt(responses["6"]),
      question7: parseInt(responses["7"]),
      question8: parseInt(responses["8"]),
      question9: parseInt(responses["9"]),
      question10: parseInt(responses["10"]),
      question11: parseInt(responses["11"]),
      question12: parseInt(responses["12"]),
      question13: parseInt(responses["13"]),
      question14: parseInt(responses["14"]),
      question15: parseInt(responses["15"]),
      question16: parseInt(responses["16"]),
      question17: parseInt(responses["17"]),
      question18: parseInt(responses["18"]),
      question19: parseInt(responses["19"]),
      question20: parseInt(responses["20"]),
      question21: parseInt(responses["21"]),
      positive,
      negative,
    });
    await newResponse.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Survey response submitted successfully",
      positive,
      negative,
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: "Some error happened while submitting response",
      error,
    });
  }
});

router.get("/get-count", authenticateToken, async (req, res) => {
  const count = await Responses.countDocuments();
  res.json({
    status: "SUCCESS",
    count,
  });
});

router.get("/get-results", async (req, res) => {
  Responses.find({}, { _id: 1, positive: 1, negative: 1 })
    .then((allResponses) => {
      if (allResponses) {
        res.json({
          status: "SUCCESS",
          allResponses,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message:
          "Some error occured while fetching all positive and negative results",
      });
    });
});

router.post("/export", authenticateToken, async (req, res) => {
  Responses.find({}, { _id: 0, __v: 0 })
    .then((allResponses) => {
      const fields = [
        "email",
        "activities",
        "question1",
        "question2",
        "question3",
        "question4",
        "question5",
        "question6",
        "question7",
        "question8",
        "question9",
        "question10",
        "question11",
        "question12",
        "question13",
        "question14",
        "question15",
        "question16",
        "question17",
        "question18",
        "question19",
        "question20",
        "question21",
        "time",
      ];
      const csv = parse(allResponses, { fields });

      const filePath = path.join(`survey-data.csv`);

      fs.writeFile(filePath, csv, { encoding: "utf8" }, (error) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ status: "FAILED", message: "Failed to create file" });
        }

        res.download(filePath, "survey-data.csv", (downloadError) => {
          if (downloadError) {
            console.error(downloadError);
            return res
              .status(500)
              .json({ status: "FAILED", message: "Failed to download file" });
          }
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "FAILED",
        message: "Failed to fetch responses from MongoDB",
      });
    });
});

module.exports = router;
