const express = require("express");//for api
const cors = require("cors");//froanted and backend connect
const multer = require("multer");//excel handle kare
const XLSX = require("xlsx");//file read karva

const app = express();
app.use(cors());//Cross-origin request mate
app.use(express.json());

// Multer setup (memory) direct read
const upload = multer({
  storage: multer.memoryStorage(),
});

// ================= UPLOAD API =================
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    // 🔹 Locale detect from file name
    let locale = "en";
    const fileName = file.originalname.toLowerCase();
    if (fileName.includes("hi")) locale = "hi";
    if (fileName.includes("gu")) locale = "gu";

    // 🔹 Read Excel file
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    let rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    //  Remove header row
    rows.shift();

    // 🔹 Generate ID + Name
    const result = rows
      .filter(row => row[0]) // first column required
      .map((row, index) => {
        let name = "";

        //  First name + Last name
        if (row[1]) {
          name = `${row[0]} ${row[1]}`.trim();
        }
        //  Single column full name (Gujarati / Hindi)
        else {
          name = row[0].trim();
        }

        return {
          id: index + 1,     //  AUTO ID
          value: name,       //  NAME FROM FILE
          locale: locale,    //  LOCALE
        };
      });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================= SERVER =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
