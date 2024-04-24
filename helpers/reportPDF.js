const PDFDocument = require("pdfkit");
var fs = require("fs");
const { uploadFileToS3 } = require("./helpers");

async function createReportPDF(invoice) {
  var fileName = await invoiceFunction(invoice);
  return fileName;
}
async function randomString(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function invoiceFunction(invoice) {
  var fileName = (await randomString(10)) + Date.now() + ".pdf";
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  await generateHeader(doc);
  await generateCustomerInformation(doc, invoice);
  await generateFooter(doc);

  const buffers = [];
  var buffer = "";

  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", () => {
    buffer = Buffer.concat(buffers);

    var obj = {
      data: buffer,
      mimetype: "application/pdf",
    };
    uploadFileToS3(
      obj,
      fileName,
      process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_REPORT
    );
  });

  doc.end();

  return fileName;
}

async function generateHeader(doc) {
  const x = 0;
  const y = 0;
  doc
    .image("public/logo/report_header.png", x, y, {
      fit: [600, 130, 600, 180],

      align: "center",
      valign: "center",
    })
    .text("SESSION REPORT", 250, 140)
    .fontSize(10);
}

async function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20);

  generateHr(doc, 170);
  generateHr(doc, 200);
  generateHr(doc, 230);
  generateHr(doc, 380);
  generateHr(doc, 480);
  generateHr(doc, 580);
  generateHr(doc, 680);

  /** left  line */
  generateVerticalHr(doc, 50, 170, 50, 770);
  /** middle line */
  generateVerticalHr(doc, 290, 170, 290, 230);
  /** small first */
  generateVerticalHr(doc, 155, 200, 155, 230);
  /** small Last */
  // generateVerticalHr(doc, 400, 200, 400, 230);
  /** right  line */
  generateVerticalHr(doc, 550, 170, 550, 770);

  doc
    .fontSize(10)
    .text("", 50, 200)
    .font("Helvetica")
    .text("Patient Name :", 60, 180)
    .font("Helvetica-Bold")
    .text(invoice.patientName, 130, 180)

    .fontSize(10)
    .text("", 370, 200)
    .font("Helvetica")
    .text("Theripest Name :", 300, 180)
    .font("Helvetica-Bold")
    .text(invoice.therapisName, 380, 180)

    /** 2 Row */

    .fontSize(10)
    .text("", 350, 200)
    .font("Helvetica")
    .text("Time:", 160, 210)
    .font("Helvetica-Bold")
    .text(invoice.time, 190, 210)

    .fontSize(10)
    .text("", 300, 200)
    .font("Helvetica")
    .text("Date:", 60, 210)
    .font("Helvetica-Bold")
    .text(invoice.date, 90, 210)

    /** Report Id */
    .fontSize(10)
    .text("", 370, 200)
    .font("Helvetica")
    .text("Report Id:", 300, 210)
    .font("Helvetica-Bold")
    .text(invoice.uuid, 350, 210)

    /** 3 Row */
    .fontSize(10)
    .text("", 400, 200)
    .font("Helvetica")
    .text("Session Summary:", 60, 240)
    .font("Helvetica-Bold")
    .text(invoice.sessionSummary, 60, 260)

    /** 4 Row */
    .fontSize(10)
    .text("", 300, 200)
    .font("Helvetica")
    .text("Home Work:", 60, 390)
    .font("Helvetica-Bold")
    .text(invoice.homeWork, 60, 410)

    /** 5 Row */
    .fontSize(10)
    .text("", 300, 200)
    .font("Helvetica")
    .text("Topic and Questions for next session:", 60, 490)
    .font("Helvetica-Bold")
    .text(invoice.topicQuestions, 60, 510)

    /** 6 Row */

    .fontSize(10)
    .text("", 300, 200)
    .font("Helvetica")
    .text("Comments:", 60, 590)
    .font("Helvetica-Bold")
    .text(invoice.comments, 60, 610)

    /** 7 Row */

    .fontSize(10)
    .text("", 300, 200)
    .font("Helvetica")
    .text("Intervention Needed:", 60, 690)
    .font("Helvetica-Bold")
    .text(invoice.interventionNeeded, 60, 710)

    .moveDown();

  generateHr(doc, 770);
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function generateVerticalHr(doc, startX, startY, endX, endY) {
  doc.moveTo(startX, startY).lineTo(endX, endY).stroke();
}

async function generateFooter(doc) {
  const x = 0;
  const y = 790;
  doc.image("public/logo/footer.png", x, y, {
    fit: [600, 58, 600, 80],
    align: "center",
    valign: "center",
  });
}

module.exports = {
  createReportPDF,
};
