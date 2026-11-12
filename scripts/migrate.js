// One-time import of postList.json into SQLite. Safe to re-run: existing URLs are skipped.
const fs = require("fs");
const path = require("path");
const db = require("../db");

const file = process.argv[2] || path.join(__dirname, "..", "postList.json");
const posts = JSON.parse(fs.readFileSync(file, "utf8"));

const insert = db.prepare("INSERT OR IGNORE INTO posts (url, status) VALUES (?, ?)");
const importAll = db.transaction((rows) => {
  let inserted = 0;
  for (const { url, status } of rows) {
    inserted += insert.run(url, status === "READ" ? "READ" : "PENDING").changes;
  }
  return inserted;
});

const inserted = importAll(posts);
const total = db.prepare("SELECT COUNT(*) AS n FROM posts").get().n;
console.log(`Imported ${inserted} of ${posts.length} posts from ${file}. Table now has ${total} rows.`);
