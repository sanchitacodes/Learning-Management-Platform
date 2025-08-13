// import express from "express"
// import isAuthenticated from "../middleware/isAuthenticated.js";
// import PDFDocument from "pdfkit";
// import { User } from "../models/user.model.js"; // make sure paths match your app
// import { Course } from "../models/course.model.js";
// const router = express.Router();

// router.get('/:userId/:courseId',  async (req, res) => {
//   try {
//     const { userId, courseId } = req.params;

//     const user = await User.findById(userId);
//     const course = await Course.findById(courseId);

//     if (!user || !course) {
//       return res.status(404).send("User or course not found");
//     }

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader(
//       'Content-Disposition',
//       `attachment; filename=invoice-${course.courseTitle}.pdf`
//     );

//     doc.pipe(res);

//     doc.fontSize(20).text('Course Invoice', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(14).text(`Name: ${user.name}`);
//     doc.text(`Email: ${user.email}`);
//     doc.text(`Course: ${course.courseTitle}`);
//     doc.text(`Price: ₹${course.coursePrice || 'N/A'}`);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`);

//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to generate invoice");
//   }
// });

// export default router;

// import express from "express";
// import PDFDocument from "pdfkit";
// import numberToWords from "number-to-words"; // ✅ Correct CommonJS import
// const { toWords } = numberToWords;
// import { User } from "../models/user.model.js";
// import { Course } from "../models/course.model.js";
// import isAuthenticated from "../middleware/isAuthenticated.js";

// const router = express.Router();

// router.get("/:userId/:courseId", isAuthenticated, async (req, res) => {
//   try {
//     const { userId, courseId } = req.params;
//     const user = await User.findById(userId);
//     const course = await Course.findById(courseId);

//     if (!user || !course) {
//       return res.status(404).send("User or course not found");
//     }

//     const doc = new PDFDocument({ margin: 40 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=invoice-${course.courseTitle}.pdf`
//     );

//     doc.pipe(res);

//     // Header
//     doc
//       .fontSize(16)
//       .text("Tax Invoice / Bill of Supply / Cash Memo", { align: "center" })
//       .moveDown(0.5);
//     doc
//       .fontSize(10)
//       .text("(Original for Recipient)", { align: "center" })
//       .moveDown();

//     // Order Info
//     doc.fontSize(10);
//     doc.text(`Order Number: ORD-${Math.floor(Math.random() * 1000000)}`);
//     doc.text(`Invoice Number: INV-${Math.floor(Math.random() * 1000000)}`);
//     doc.text(`Order Date: ${new Date().toLocaleDateString()}`);
//     doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
//     doc.moveDown();

//     // Seller Info
//     doc.font("Helvetica-Bold").text("Sold By:");
//     doc.font("Helvetica").text("MYCOURSE TECHNOLOGIES PRIVATE LIMITED");
//     doc.text("123 Learning Tower, EdTech City, Bangalore, KA – 560001");
//     doc.text("PAN No: AABBC1234D");
//     doc.text("GSTIN: 29AABBC1234D1Z5");
//     doc.moveDown();

//     // Buyer Info
//     doc.font("Helvetica-Bold").text("Billed To:");
//     doc.font("Helvetica").text(`${user.name}`);
//     doc.text(`${user.email}`);
//     doc.text("Sarojini Apartment, National Highway");
//     doc.text("SILCHAR, ASSAM, 788005");
//     doc.text("State/UT Code: 18");
//     doc.moveDown();

//     // Item Table Headers
//     doc.font("Helvetica-Bold");
//     doc.text("Sl. No", 40);
//     doc.text("Description", 90);
//     doc.text("Unit Price", 250);
//     doc.text("Qty", 320);
//     doc.text("Net Amount", 370);
//     doc.text("Tax Rate", 450);
//     doc.text("Tax Type", 510);
//     doc.text("Tax Amt", 580);
//     doc.text("Total", 640);
//     doc.moveDown(0.5);
//     doc.moveTo(40, doc.y).lineTo(560, doc.y).stroke();
//     doc.moveDown(0.5);

//     // Item Row
//     const price = course.coursePrice;
//     const taxRate = 0.18;
//     const taxAmount = (price * taxRate).toFixed(2);
//     const total = (price + parseFloat(taxAmount)).toFixed(2);

//     doc.font("Helvetica");
//     doc.text("1", 40);
//     doc.text(course.courseTitle.slice(0, 30) + "...", 90, undefined, {
//       width: 140,
//     });
//     doc.text(`₹${price}`, 250);
//     doc.text("1", 320);
//     doc.text(`₹${price}`, 370);
//     doc.text("18%", 450);
//     doc.text("IGST", 510);
//     doc.text(`₹${taxAmount}`, 580);
//     doc.text(`₹${total}`, 640);
//     doc.moveDown(1);

//     // Total
//     doc.font("Helvetica-Bold").text(`TOTAL: ₹${total}`, { align: "right" });
//     doc
//       .font("Helvetica")
//       .text(`Amount in Words: ${toWords(parseInt(total))} only`, {
//         align: "right",
//       });
//     doc.moveDown();

//     // Footer
//     doc.text("Whether tax is payable under reverse charge - No");
//     doc.moveDown(2);
//     doc.text("Authorized Signatory", { align: "right" });

//     doc.end();
//   } catch (err) {
//     console.error("Invoice generation error:", err);
//     res.status(500).send("Failed to generate invoice");
//   }
// });

// export default router;



import express from "express";
import PDFDocument from "pdfkit";
import numberToWords from "number-to-words";
const { toWords } = numberToWords;
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/:userId/:courseId", isAuthenticated, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).send("User or course not found");
    }

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${course.courseTitle}.pdf`
    );
    doc.pipe(res);

    const price = Number(course.coursePrice || 0);
    const discount = 0;
    const taxRate = 0.18;
    const taxAmount = Number((price * taxRate).toFixed(2));
    const netAmount = price - discount;
    const total = Number((netAmount + taxAmount).toFixed(2));

    const shipping = 40;
    const shippingDiscount = 40;

    let y = 60;

    // === HEADER ===
    doc
      .fontSize(16)
      .text("Tax Invoice / Bill of Supply / Cash Memo", { align: "center" });
    doc
      .fontSize(10)
      .text("(Original for Recipient)", { align: "center" })
      .moveDown();

    // === Order Info ===
    doc.fontSize(10);
    doc.text(`Order Number: ORD-${Math.floor(Math.random() * 1000000)}`);
    doc.text(`Invoice Number: INV-${Math.floor(Math.random() * 1000000)}`);
    doc.text(`Order Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // === Seller Info ===
    doc.font("Helvetica-Bold").text("Sold By:");
    doc.font("Helvetica").text("MYCOURSE TECHNOLOGIES PRIVATE LIMITED");
    doc.text("123 Learning Tower, EdTech City, Bangalore, KA – 560001");
    doc.text("PAN No: AABBC1234D");
    doc.text("GSTIN: 29AABBC1234D1Z5");
    doc.moveDown();

    // === Buyer Info ===
    doc.font("Helvetica-Bold").text("Billed To:");
    doc.font("Helvetica").text(user.name);
    doc.text(user.email);
    doc.text("Sarojini Apartment, National Highway");
    doc.text("SILCHAR, ASSAM, 788005");
    doc.text("State/UT Code: 18");
    doc.moveDown();

    // === Table Header ===
y = doc.y + 10;
doc.font("Helvetica-Bold").fontSize(9);
doc.text("Sl.", 30, y);
doc.text("Description", 60, y);
doc.text("Unit", 210, y);
doc.text("Disc.", 260, y);
doc.text("Qty", 305, y);
doc.text("Net", 340, y);
doc.text("Tax %", 390, y);
doc.text("Type", 430, y);
doc.text("Tax Amt", 475, y);
doc.text("Total", 520, y);

doc.moveTo(30, y + 12).lineTo(570, y + 12).stroke();

// === Row 1: Course ===
y += 18;
doc.font("Helvetica").fontSize(9);
doc.text("1", 30, y);
doc.text(`${course.courseTitle}\nHSN: 49011010`, 60, y, { width: 140 });
doc.text(`₹${price.toFixed(2)}`, 210, y);
doc.text(`₹0.00`, 260, y);
doc.text("1", 305, y);
doc.text(`₹${netAmount.toFixed(2)}`, 340, y);
doc.text("18%", 390, y);
doc.text("IGST", 430, y);
doc.text(`₹${taxAmount.toFixed(2)}`, 475, y);
doc.text(`₹${total.toFixed(2)}`, 520, y);

y += 38;

// === Row 2: Shipping ===
doc.text(" ", 30, y);
doc.text("Shipping Charges", 60, y);
doc.text(`₹${shipping.toFixed(2)}`, 210, y);
doc.text(`-₹${shippingDiscount.toFixed(2)}`, 260, y);
doc.text("1", 305, y);
doc.text("₹0.00", 340, y);
doc.text("0%", 390, y);
doc.text("IGST", 430, y);
doc.text("₹0.00", 475, y);
doc.text("₹0.00", 520, y);

y += 30;
doc.moveTo(30, y).lineTo(570, y).stroke();



    // === Total (Fix alignment) ===
    doc.font("Helvetica-Bold").text(`TOTAL: ₹${total.toFixed(2)}`, 400, y + 10, {
  width: 150,
  align: "right",
});

doc.font("Helvetica-Bold").text("Amount in Words:", 30, y + 40);
doc.font("Helvetica").text(`${toWords(total)} only`, 150, y + 40);

// Signature
doc.font("Helvetica-Bold").text("For MYCOURSE TECHNOLOGIES:", 350, y + 80, {
  width: 200,
  align: "right",
});
doc.font("Helvetica").text("Authorized Signatory", 350, y + 105, {
  width: 200,
  align: "right",
});

// Footer Line
doc.moveTo(30, y + 140).lineTo(570, y + 140).stroke();
doc.fontSize(9).text("Whether tax is payable under reverse charge - No", 30, y + 150);


    doc.end();
  } catch (err) {
    console.error("Invoice generation error:", err);
    if (!res.headersSent) {
      res.status(500).send("Failed to generate invoice");
    }
  }
});

export default router;



// import express from "express";
// import PDFDocument from "pdfkit";
// import isAuthenticated from "../middleware/isAuthenticated.js";

// const router = express.Router();

// router.get("/:userId/:courseId", isAuthenticated, async (req, res) => {
//   try {
//     const doc = new PDFDocument({ margin: 50 });
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=single-column-table.pdf");
//     doc.pipe(res);

//     // === Title ===
//     doc
//       .fontSize(16)
//       .text("Sample Invoice", { align: "center" })
//       .moveDown(2);

//     // === Table Header ===
//     let y = doc.y;
//     doc
//       .rect(50, y, 500, 20)
//       .fillAndStroke("#f0f0f0", "black")
//       .fillColor("black")
//       .font("Helvetica-Bold")
//       .fontSize(10)
//       .text("Description", 55, y + 5);

//     y += 20;

//     // === Table Row ===
//     const descriptionText = "Hyper Text Markup Language (HTML) - HSN: 49011010";
//     doc
//       .rect(50, y, 500, 60)
//       .stroke()
//       .font("Helvetica")
//       .fontSize(10)
//       .fillColor("black")
//       .text(descriptionText, 55, y + 5, {
//         width: 490,
//         height: 50,
//         align: "left",
//       });

//     y += 70;

//     // === Footer or Notes ===
//     doc
//       .font("Helvetica")
//       .fontSize(9)
//       .text("Whether tax is payable under reverse charge - No", 50, y + 20);

//     doc.end();
//   } catch (err) {
//     console.error("PDF error:", err);
//     if (!res.headersSent) {
//       res.status(500).send("Error generating PDF");
//     }
//   }
// });

// export default router;
