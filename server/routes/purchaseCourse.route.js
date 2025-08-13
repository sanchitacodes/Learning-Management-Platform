import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, stripeWebhook } from "../controller/coursePurchase.controller.js";
import { getInstructorSalesSummary, getRecommendedCourses } from "../controller/coursePurchase.controller.js";


const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/webhook").post(express.raw({type:"application/json"}), stripeWebhook);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
router.get("/sales-summary", isAuthenticated, getInstructorSalesSummary);
router.route("/").get(isAuthenticated,getAllPurchasedCourse);
router.route("/course/:courseId/recommendations").get(isAuthenticated, getRecommendedCourses);


export default router;