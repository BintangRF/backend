const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs").promises;
const Pasien = require("../models/pasien");
const bcrypt = require("bcrypt");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", upload.single("foto_pasien"), async (req, res) => {
  try {
    const {
      nama_pasien,
      tanggal_lahir,
      gender,
      nomor_ponsel,
      email_pasien,
      alamat,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const foto_pasien = req.file
      ? req.file.buffer.toString("base64")
      : await getDefaultProfileImage();

    await Pasien.create({
      nama_pasien,
      tanggal_lahir,
      gender,
      nomor_ponsel,
      email_pasien,
      alamat,
      password: hashedPassword,
      foto_pasien,
    });

    // Redirect to login page after successful registration
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Pendaftaran gagal. Coba lagi nanti.");
  }
});

async function getDefaultProfileImage() {
  try {
    const defaultImageBuffer = await fs.readFile("public/img/poto-profil.png");
    return defaultImageBuffer.toString("base64");
  } catch (error) {
    console.error("Error reading default profile image:", error);
    throw error;
  }
}

module.exports = router;
