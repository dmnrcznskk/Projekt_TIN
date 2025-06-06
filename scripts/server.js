const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Obsługa plików statycznych z katalogu głównego
app.use(express.static(path.join(__dirname, "..")));

app.get("/api/mioty", (req, res) => {
  const uploadsDir = path.join(__dirname, "../uploads");

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Nie można odczytać katalogu uploads" });
    }

    const mioty = files.filter(file =>
      fs.statSync(path.join(uploadsDir, file)).isDirectory()
    );

    res.json(mioty);
  });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
