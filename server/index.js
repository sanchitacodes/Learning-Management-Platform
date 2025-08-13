import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/dbConnect.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import recommendationsRouter from "./routes/recommend.route.js";
import invoiceRouter from "./routes/invoice.route.js";
dotenv.config({});

//call database connection
connectDB();

const app = express();
const port = process.env.PORT || 3000;

//defaukt middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // 👈 Add this if form data is expected
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}));

//apis
app.use("/api", recommendationsRouter);
app.use('/api/invoice', invoiceRouter);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);



// app.get("/home", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Hello i am coming from backend",
//   });
// });

app.listen(port, () => {
  console.log(`Server listen at port ${port}`);
});
