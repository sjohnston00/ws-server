const ws = new WebSocket("ws://192.168.1.21:8080");
ws.addEventListener("open", (e) => {
  console.log("successfull connection");
});
ws.addEventListener("message", async (e) => {
  const data = await e.data.text();
  console.log(data);
});

(() => {
  const rows = [...document.querySelectorAll(".row")];
  const row1Cells = [...rows[0].children];
  const player1 = rows.at(-1).children[0];
  const player2 = row1Cells.at(-1);
  player1.classList.add("player1");
  player2.classList.add("player2");
})();

document.body.addEventListener("keydown", (e) => {
  const { key } = e;

  if (
    key !== "ArrowLeft" &&
    key !== "ArrowRight" &&
    key !== "ArrowDown" &&
    key !== "ArrowUp"
  )
    return;

  const activeSquare = document.querySelector(".cell.player1");

  if (key === "ArrowLeft") {
    if (!activeSquare.previousElementSibling) return; //we're at the left most side
    activeSquare.classList.remove("player1");
    activeSquare.previousElementSibling.classList.add("player1");
    ws.send(key);
    return;
  }

  if (key === "ArrowRight") {
    if (!activeSquare.nextElementSibling) return; //we're at the right most side
    activeSquare.classList.remove("player1");
    activeSquare.nextElementSibling.classList.add("player1");
    ws.send(key);

    return;
  }

  if (key === "ArrowUp") {
    if (!activeSquare.parentNode.previousElementSibling) return; //we're at the top

    const indexOfNode = getChildElementIndex(activeSquare);
    activeSquare.classList.remove("player1");
    activeSquare.parentNode.previousElementSibling.children[
      indexOfNode
    ].classList.add("player1");
    ws.send(key);

    return;
  }

  if (key === "ArrowDown") {
    if (!activeSquare.parentNode.nextElementSibling) return; //we're at the bottom
    const indexOfNode = getChildElementIndex(activeSquare);
    activeSquare.classList.remove("player1");
    activeSquare.parentNode.nextElementSibling.children[
      indexOfNode
    ].classList.add("player1");
    ws.send(key);

    return;
  }
});

function getChildElementIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}
