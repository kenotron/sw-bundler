import express from "express";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new express();
app.use(express.static("static"));

const depMap = {
  "main.js": ["bootstrap.js", "installServiceWorker.js"],
  "bootstrap.js": ["square.js"],
};

app.get("/b/bootstrap.js", (req, res) => {
  const newContent = bundle(path.basename(req.url));
  res.send(newContent);
});

app.get("/*.js", (req, res) => {
  if (req.url.includes("bootstrap")) {
    return res.status(404).send("blah");
  }

  console.log(path.join(__dirname, "client", path.basename(req.url)));
  res.setHeader("content-type", "application/javascript");
  res.send(
    fs.readFileSync(
      path.join(__dirname, "client", path.basename(req.url)),
      "utf-8"
    )
  );
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});

function bundle(file) {
  const filePath = path.join(__dirname, "client", file);

  if (!fs.existsSync(filePath)) {
    return "";
  }

  return (
    `###${file}###${fs.readFileSync(filePath, "utf-8")}\n` +
    (depMap[file]?.map((f) => bundle(f)) || "")
  );
}
