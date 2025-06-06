require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const uploadsPath = path.join(__dirname, "../uploads");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Serwowanie plików statycznych
app.use(express.static(path.join(__dirname, "..")));

// Middleware do ochrony panelu admina
function requireAuth(req, res, next) {
  if (req.session && req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login.html");
  }
}

// 🔐 Logowanie
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.redirect("/admin-panel.html");
  } else {
    res.redirect("/login.html?error=1");
  }
});

// 🔐 Wylogowanie
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.setHeader("Cache-Control", "no-store");
    res.redirect("/index.html");
  });
});

// 🔐 Chroniony dostęp do panelu admina
app.get("/admin-panel.html", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../admin-panel.html"));
});

// 📁 Lista miotów
app.get("/api/mioty", (req, res) => {
  fs.readdir(uploadsPath, { withFileTypes: true }, (err, dirs) => {
    if (err) return res.status(500).json({ error: "Błąd czytania katalogu uploads" });

    const mioty = dirs.filter(d => d.isDirectory()).map(d => d.name);
    res.json(mioty);
  });
});

// 📁 Szczegóły jednego miotu
app.get("/api/miot", (req, res) => {
  const litterName = decodeURIComponent(req.query.name);
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

// 🟢 Start
app.listen(PORT, () => {
  console.log(`✅ Serwer działa: http://localhost:${PORT}`);
});
