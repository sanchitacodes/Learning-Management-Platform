// import fs from "fs";
// import dotenv from "dotenv";
// import { MongoClient } from "mongodb";

// dotenv.config({ path: '../.env' });

// const uri = process.env.MONGO_URL;
// const client = new MongoClient(uri);

// async function exportTransactions() {
//   try {
//     await client.connect();
//     const db = client.db("lms"); // Your database name
//     const purchases = await db.collection("coursepurchases").find({}).toArray();

//     // Group by userId and collect courseIds per transaction
//     const transactionsMap = {};
//     for (const purchase of purchases) {
//       const userId = purchase.userId;
//       if (!transactionsMap[userId]) transactionsMap[userId] = [];
//       transactionsMap[userId].push(purchase.courseId);
//     }

//     const transactions = Object.values(transactionsMap);
//     fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2));
//     console.log("✅ Transactions exported to transactions.json");
//   } finally {
//     await client.close();
//   }
// }

// exportTransactions();





import fs from "fs";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: '../.env' });

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

async function exportTransactions() {
  try {
    await client.connect();
    const db = client.db("lms");
    const purchases = await db.collection("coursepurchases").find({}).toArray();

    // Fetch all course names once
    const courses = await db.collection("courses").find({}).toArray();
    const courseIdToName = {};
    for (const course of courses) {
      courseIdToName[course._id.toString()] = course.courseTitle;
    }

    // Group course names per user
    const transactionsMap = {};
    for (const purchase of purchases) {
      const userId = purchase.userId;
      const courseId = purchase.courseId?.toString();
      const courseName = courseIdToName[courseId] || "Unknown Course";

      if (!transactionsMap[userId]) transactionsMap[userId] = [];
      transactionsMap[userId].push(courseName);
    }

    const transactions = Object.values(transactionsMap);
    fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2));
    console.log("✅ Transactions with course names exported to transactions.json");
  } finally {
    await client.close();
  }
}

exportTransactions();



// import dotenv from "dotenv";
// import { MongoClient } from "mongodb";
// import fs from "fs";

// dotenv.config({ path: '../.env' }); // ✅ Load .env variables
// console.log("Loaded env:", process.env.MONGO_URL);

// const uri = process.env.MONGO_URL;

// if (!uri) {
//   console.error("MONGO_URL is not defined in .env");
//   process.exit(1);
// }

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function fetchTransactions() {
//   try {
//     await client.connect();
//     const db = client.db("lms");
//     const purchases = await db.collection("purchases").find({}).toArray();

//     const transactions = purchases.map((purchase) => purchase.coursesPurchased);
//     fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2));

//     console.log("✅ transactions.json updated successfully.");
//   } catch (err) {
//     console.error("❌ Error fetching transactions:", err);
//   } finally {
//     await client.close();
//   }
// }

// fetchTransactions();
