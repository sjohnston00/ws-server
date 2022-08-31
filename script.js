const ws = new WebSocket("ws://192.168.1.21:8080");
ws.addEventListener("open", (e) => {
  console.log("successfull connection");
  ws.send("round string");
});
ws.addEventListener("message", async (e) => {
  const data = await e.data.text();
  document.body.innerHTML += "<br/>" + data;
  console.log(data);
});
ws.addEventListener("error", async (e) => {
  console.log("error", e);
});
ws.addEventListener("close", async (e) => {
  console.log("close", e);
  console.log(ws);
});
