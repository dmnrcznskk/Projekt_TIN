const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const uploadsPath = path.join(__dirname, "../uploads");

app.use(express.static(path.join(__dirname, "..")));

app.get("/api/mioty", (req, res) => {
  fs.readdir(uploadsPath, { withFileTypes: true }, (err, dirs) => {
    if (err) return res.status(500).json({ error: "Błąd czytania katalogu uploads" });

    const mioty = dirs.filter(d => d.isDirectory()).map(d => d.name);
    res.json(mioty);
  });
});

app.get("/api/miot", (req, res) => {
  const litterName = req.query.name;
  if (!litterName) return res.status(400).json({ error: "Brak nazwy miotu" });

  const litterPath = path.join(uploadsPath, litterName);
  if (!fs.existsSync(litterPath)) return res.status(404).json({ error: "Miot nie istnieje" });

  const cats = fs.readdirSync(litterPath, { withFileTypes: true });
  const result = [];

  cats.forEach(cat => {
    if (cat.isDirectory()) {
      const catName = cat.name;
      const catFolder = path.join(litterPath, catName);
      let images = [];

      try {
        images = fs.readdirSync(catFolder).filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file));
      } catch (_) {}

      result.push({
        name: catName,
        images: images.map(img =>
          `/uploads/${encodeURIComponent(litterName)}/${encodeURIComponent(catName)}/${encodeURIComponent(img)}`
        )
      });
    }
  });

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`✅ Serwer działa: http://localhost:${PORT}`);
});
