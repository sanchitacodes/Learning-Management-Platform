import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
// console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { courseIds } = req.body;
  console.log("User object:", req.id);

  const userId = req.id;

  // Fetch selected courses
  const courses = await Course.find({ _id: { $in: courseIds } });

  if (courses.length === 0) {
    return res.status(404).json({ message: "Courses not found" });
  }

  let totalAmount = 0;

  // Calculate grand total (course price + 18% GST + ₹10 fee per course)
  for (const course of courses) {
    const gst = +(course.coursePrice * 0.18).toFixed(2);
    const platformFee = 10;
    const courseTotal = +(course.coursePrice + gst + platformFee).toFixed(2);
    totalAmount += courseTotal;
  }

  // Convert to paisa (Stripe expects amount in smallest currency unit)
  const totalAmountInPaise = Math.round(totalAmount * 100);

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   mode: "payment",
  //   line_items: courses.map((course) => {
  //     const gst = +(course.coursePrice * 0.18).toFixed(2);
  //     const platformFee = 10;
  //     const courseTotal = +(course.coursePrice + gst + platformFee).toFixed(2);

  //     return {
  //       price_data: {
  //         currency: "inr",
  //         product_data: {
  //           name: course.courseTitle,
  //         },
  //         unit_amount: Math.round(courseTotal * 100), // in paisa
  //       },
  //       quantity: 1,
  //     };
  //   }),
  //   success_url: `http://localhost:5173/course-progress/${courseIds[0]}`,
  //   cancel_url: `http://localhost:5173/course-detail/${courseIds[0]}`,
  //   metadata: {
  //     userId: userId.toString(),
  //   },
  // });

  const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",
  billing_address_collection: "required", // Show form fields
  shipping_address_collection: {
    allowed_countries: ["IN"],
  },
  line_items: courses.map((course) => {
    const gst = +(course.coursePrice * 0.18).toFixed(2);
    const platformFee = 10;
    const courseTotal = +(course.coursePrice + gst + platformFee).toFixed(2);

    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: course.courseTitle,
        },
        unit_amount: Math.round(courseTotal * 100),
      },
      quantity: 1,
    };
  }),
  success_url: `http://localhost:5173/course-progress/${courseIds[0]}`,
  cancel_url: `http://localhost:5173/course-detail/${courseIds[0]}`,
  metadata: {
    userId: userId.toString(),
  },
});



  // Save pending purchases for each course with accurate amount
  for (const course of courses) {
    const gst = +(course.coursePrice * 0.18).toFixed(2);
    const platformFee = 10;
    const totalAmount = +(course.coursePrice + gst + platformFee).toFixed(2);

    const newPurchase = new CoursePurchase({
      courseId: course._id,
      userId,
      amount: totalAmount, // ✅ Correct amount per course
      status: "pending",
      paymentId: session.id,
    });

    await newPurchase.save();
  }

  res.status(200).json({ url: session.url });
});

// export const createCheckoutSession = async (req, res) => {
//   try {
//     const userId = req.id;
//     // console.log("REQ.BODY:", req.body);
//     const { courseIds } = req.body;
//     console.log("First course ID:", courseIds[0]);
    

//     if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
//       return res.status(400).json({ message: "No course IDs provided" });
//     }
    
//     const courses = await Course.find({ _id: { $in: courseIds } });

//     if (courses.length === 0) {
//       return res.status(404).json({ message: "Courses not found!" });
//     }

//     // Prepare line items for Stripe
//   const line_items = courses.map((course) => {
//   const gst = course.coursePrice * 0.18;
//   const platformFee = course.coursePrice * 0.10; // Optional
//   const totalAmount = course.coursePrice + gst + platformFee;

//   return {
//     price_data: {
//       currency: "inr",
//       product_data: {
//         name: course.courseTitle,
//         images: [course.courseThumbnail],
//       },
//       unit_amount: Math.round(totalAmount * 100), // Convert to paise
//     },
//     quantity: 1,
//   };
// });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `http://localhost:5173/course-progress/${courseIds[0]}`, // A general page after success
//       cancel_url: `http://localhost:5173/course-detail/${courseIds[0]}`, // Optional cancel page
//       metadata: {
//         courseIds: courseIds.join(","), // Store comma-separated IDs
//         userId: userId,
//       },
//       shipping_address_collection: {
//         allowed_countries: ["IN"],
//       },
//     });

//     // Store each purchase as "pending"
//     for (const course of courses) {
//       const newPurchase = new CoursePurchase({
//         courseId: course._id,
//         userId,
//         amount: course.coursePrice,
//         status: "pending",
//         paymentId: session.id,
//       });
//       await newPurchase.save();
//     }

//     return res.status(200).json({
//       success: true,
//       url: session.url,
//     });
//   } catch (error) {
//     console.error("Checkout session error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// export const stripeWebhook = async (req, res) => {
//   let event;

//   try {
//     const payloadString = JSON.stringify(req.body, null, 2);
//     const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

//     const header = stripe.webhooks.generateTestHeaderString({
//       payload: payloadString,
//       secret,
//     });

//     event = stripe.webhooks.constructEvent(payloadString, header, secret);
//   } catch (error) {
//     console.error("Webhook error:", error.message);
//     return res.status(400).send(`Webhook error: ${error.message}`);
//   }

//   // Handle the checkout session completed event
//   if (event.type === "checkout.session.completed") {
//     console.log("check session complete is called");

//     try {
//       const session = event.data.object;

//       const purchases = await CoursePurchase.find({
//         paymentId: session.id,
//       }).populate({ path: "courseId" });

//       if (!purchases) {
//         return res.status(404).json({ message: "Purchase not found" });
//       }

//       for (const purchase of purchases) {
//       if (session.amount_total) {
//         purchase.amount = session.amount_total / 100;
//       }
//       purchase.status = "completed";

//       // Make all lectures visible by setting `isPreviewFree` to true
//       if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//         await Lecture.updateMany(
//           { _id: { $in: purchase.courseId.lectures } },
//           { $set: { isPreviewFree: true } }
//         );
//       }

//       await purchase.save();
    
//       // Update user's enrolledCourses
//       await User.findByIdAndUpdate(
//         purchase.userId,
//         { $addToSet: { enrolledCourse: purchase.courseId._id } }, // Add course ID to enrolledCourses
//         { new: true }
//       );

//       // Update course to add user ID to enrolledStudents
//       await Course.findByIdAndUpdate(
//         purchase.courseId._id,
//         { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
//         { new: true }
//       );
//     } 
//     //  console.log("All purchases processed for session:", session.id);
//   }catch (error) {
//       console.error("Error handling event:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
//   res.status(200).send();
// };

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("✅ Checkout session completed");

    try {
      const session = event.data.object;

      const purchases = await CoursePurchase.find({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchases || purchases.length === 0) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      for (const purchase of purchases) {
        // ✅ No need to overwrite amount
        purchase.status = "completed";

        // Make all lectures visible
        if (purchase.courseId && purchase.courseId.lectures.length > 0) {
          await Lecture.updateMany(
            { _id: { $in: purchase.courseId.lectures } },
            { $set: { isPreviewFree: true } }
          );
        }

        await purchase.save();

        // Update user's enrolledCourses
        await User.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCourse: purchase.courseId._id } },
          { new: true }
        );

        // Update course's enrolledStudents
        await Course.findByIdAndUpdate(
          purchase.courseId._id,
          { $addToSet: { enrolledStudents: purchase.userId } },
          { new: true }
        );
      }

    } catch (error) {
      console.error("Error handling webhook:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};



export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    // console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getAllPurchasedCourse = async (_, res) => {
//   try {
//     const purchasedCourse = await CoursePurchase.find({
//       status: "completed",
//     }).populate("courseId");
//     if (!purchasedCourse) {
//       return res.status(404).json({
//         purchasedCourse: [],
//       });
//     }
//     return res.status(200).json({
//       purchasedCourse,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };



export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;
    // console.log("User ID in getAllPurchasedCourse:", userId);


    const purchasedCourse = await CoursePurchase.find({
      userId,
      status: "completed",
    }).populate("courseId");

    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// export const getInstructorSalesSummary = async (req, res) => {
//   try {
//     const instructorId = req.id; // assuming req.id = logged-in instructor
//     console.log("Instructor ID from req.id:", req.id);


//     // Step 1: Get all courses created by the instructor
//     const instructorCourses = await Course.find({ creator: instructorId }).select("_id courseTitle");

//     if (!instructorCourses || instructorCourses.length === 0) {
//       return res.status(200).json({ totalRevenue: 0, totalSales: 0, purchasedCourse: [] });
//     }

//     const courseIds = instructorCourses.map(course => course._id);

//     // Step 2: Get all completed purchases for those courses
//     const purchases = await CoursePurchase.find({
//       courseId: { $in: courseIds },
//       status: "completed"
//     }).populate("courseId");

//     // Step 3: Calculate revenue and sales
//     const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
//     const totalSales = purchases.length;

//     return res.status(200).json({
//       totalRevenue,
//       totalSales,
//       purchasedCourse: purchases
//     });

//   } catch (error) {
//     console.error("Error in instructor sales summary:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getInstructorSalesSummary = async (req, res) => {
  try {
    const instructorId = req.id;

    // Get all courses created by the instructor
    const instructorCourses = await Course.find({ creator: instructorId }).select("_id courseTitle");

    if (!instructorCourses || instructorCourses.length === 0) {
      return res.status(200).json({ totalRevenue: 0, totalSales: 0, purchasedCourse: [] });
    }

    const courseIds = instructorCourses.map(course => course._id);

    // Get all completed purchases and populate both course & user details
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    })
      // .populate("courseId", "courseTitle")  // only required fields
      // .populate("userId", "name email");     // now user info also available
      .populate({ path: "courseId", select: "courseTitle coursePrice creator" })  
      .populate({ path: "userId", select: "name email" });

    const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalSales = purchases.length;

    return res.status(200).json({
      totalRevenue,
      totalSales,
      purchasedCourse: purchases, // includes user and course details
    });

  } catch (error) {
    console.error("Error in instructor sales summary:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getRecommendedCourses = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Step 1: Get all userIds who purchased this course
    const users = await CoursePurchase.find({ courseId }).distinct("userId");

    if (users.length === 0) return res.json([]);

    // Step 2: Get other courses those users purchased
    const recommendations = await CoursePurchase.aggregate([
      {
        $match: {
          userId: { $in: users },
          courseId: { $ne: courseId },
        },
      },
      {
        $group: {
          _id: "$courseId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 4 }, // change as needed
    ]);

    const courseIds = recommendations.map((rec) => rec._id);
    const courses = await Course.find({ _id: { $in: courseIds } });

    res.json(courses);
  } catch (err) {
    console.error("Error in getRecommendedCourses:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
