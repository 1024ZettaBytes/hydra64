let express = require("express");
const fs = require("fs");
let app = express();

const listClass = {
  PENDING: "primary",
  READ: "success",
};
const _class = "list-group-item list-group-item-action list-group-item-";

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});
app.get("/creepy", (req, res) => {
  let arr = JSON.parse(fs.readFileSync('./postList.json', 'utf8'));
  const baseHtml = fs.readFileSync("./creepy.html").toString();
  let htmlList = "";
  for (let x = 0; x < arr.length; x++) {
    htmlList += `<a onClick="markAsRead(${x})" href="${arr[x].url}" class="${
      _class + listClass[arr[x].status]
    }" target="_blank">${x + 1} - ${arr[x].url}</a>`;
  }
  const finalHtml = baseHtml.replace("{{list}}", htmlList);
  res.send(finalHtml);
});

app.get("/creepy/markRead/:index", (req, res) => {
  const { index } = req.params;
  let content = JSON.parse(fs.readFileSync('./postList.json', 'utf8'));
  content[index].status = "READ";
  fs.writeFileSync("./postList.json", JSON.stringify(content, null, 2));
  res.status(200).send();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
