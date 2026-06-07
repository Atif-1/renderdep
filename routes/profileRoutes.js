const express=require("express");
const {analyzeProfile, getProfileAnalysis, getAllAnalysis, deleteProfileAnalysis}=require("../controller/profileController");

const Router=express.Router();

Router.route("/analyze-profile").post(analyzeProfile);
Router.route("/profile-analysis").post(getProfileAnalysis);
Router.route("/get-analysis").get(getAllAnalysis);
Router.route("/delete-analysis/:id").delete(deleteProfileAnalysis);

module.exports=Router;