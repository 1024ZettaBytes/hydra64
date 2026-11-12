const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db");

const app = express();

const listClass = {
  PENDING: "primary",
  READ: "success",
};
const _class = "list-group-item list-group-item-action list-group-item-";

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const creepyTemplate = fs.readFileSync(path.join(__dirname, "creepy.html"), "utf8");
const listPosts = db.prepare("SELECT id, url, status FROM posts ORDER BY id");
const markRead = db.prepare("UPDATE posts SET status = 'READ' WHERE id = ?");

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.get("/torrentdloader", (req, res) => {
  res.sendFile("webtor.html", { root: __dirname });
});

app.get("/creepy", (req, res) => {
  const htmlList = listPosts
    .all()
    .map((post, i) => {
      const url = escapeHtml(post.url);
      return `<a onClick="markAsRead(${post.id})" href="${url}" class="${
        _class + listClass[post.status]
      }" target="_blank" rel="noopener noreferrer">${i + 1} - ${url}</a>`;
    })
    .join("");
  res.send(creepyTemplate.replace("{{list}}", htmlList));
});

app.post("/creepy/:id/read", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.sendStatus(400);
  const { changes } = markRead.run(id);
  res.sendStatus(changes ? 204 : 404);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
