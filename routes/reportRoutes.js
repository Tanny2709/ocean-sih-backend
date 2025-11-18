// import express from "express";
// import { getReports } from "../controllers/reportController.js";
const express=require('express')
const {getReports}=require('../controllers/reportController.js')
const router = express.Router();

router.get("/", getReports);

module.exports = router;
