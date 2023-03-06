let decodedContainer = document.getElementById("decodedContainer");
decodedContainer.style.visibility = "hidden";
decodeBtn.addEventListener("click", () => {
  decodedContainer.style.visibility = "hidden";
  const encodedtext = document.getElementById("encodedTextArea").value;
  let decodedtextArea = document.getElementById("decodedTextArea");
  decodedTextArea.value = atob(encodedtext);
  auto_grow(decodedTextArea);
  decodedContainer.style.visibility = "visible";
});
function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + 20 + "px";
}
