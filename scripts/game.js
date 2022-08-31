const ws = new WebSocket("ws://192.168.1.21:8080");
const progress = document.querySelector("progress");
ws.addEventListener("open", (e) => {
  console.log("successfull connection");
});
ws.addEventListener("message", async (e) => {
  const data = await e.data.text();
  if (player === 2) {
    if (data.startsWith("player2")) return;

    const key = data.split("-")[1];

    const playerClassName = `player1`;

    const activeSquare = document.querySelector(`.cell.${playerClassName}`);

    if (key === "ArrowLeft") {
      if (!activeSquare.previousElementSibling) return; //we're at the left most side
      activeSquare.classList.remove(playerClassName);
      activeSquare.previousElementSibling.classList.add(playerClassName);
      ws.send(`${playerClassName}-${key}`);
      return;
    }

    if (key === "ArrowRight") {
      if (!activeSquare.nextElementSibling) return; //we're at the right most side
      activeSquare.classList.remove(playerClassName);
      activeSquare.nextElementSibling.classList.add(playerClassName);
      ws.send(`${playerClassName}-${key}`);

      return;
    }

    if (key === "ArrowUp") {
      if (!activeSquare.parentNode.previousElementSibling) return; //we're at the top

      const indexOfNode = getChildElementIndex(activeSquare);
      activeSquare.classList.remove(playerClassName);
      activeSquare.parentNode.previousElementSibling.children[
        indexOfNode
      ].classList.add(playerClassName);
      ws.send(`${playerClassName}-${key}`);

      return;
    }

    if (key === "ArrowDown") {
      if (!activeSquare.parentNode.nextElementSibling) return; //we're at the bottom
      const indexOfNode = getChildElementIndex(activeSquare);
      activeSquare.classList.remove(playerClassName);
      activeSquare.parentNode.nextElementSibling.children[
        indexOfNode
      ].classList.add(playerClassName);
      ws.send(`${playerClassName}-${key}`);

      return;
    }
  } else {
    if (data.startsWith("player1")) return;

    const key = data.split("-")[1];

    const playerClassName = `player2`;

    const activeSquare = document.querySelector(`.cell.${playerClassName}`);

    if (key === "ArrowLeft") {
      if (!activeSquare.previousElementSibling) return; //we're at the left most side
      activeSquare.classList.remove(playerClassName);
      activeSquare.previousElementSibling.classList.add(playerClassName);
      ws.send(`${playerClassName}-${key}`);
      return;
    }

    if (key === "ArrowRight") {
      if (!activeSquare.nextElementSibling) return; //we're at the right most side
      activeSquare.classList.remove(playerClassName);
      activeSquare.nextElementSibling.classList.add(playerClassName);
      ws.send(`${playerClassName}-${key}`);

      return;
    }

    if (key === "ArrowUp") {
      if (!activeSquare.parentNode.previousElementSibling) return; //we're at the top

      const indexOfNode = getChildElementIndex(activeSquare);
      activeSquare.classList.remove(playerClassName);
      activeSquare.parentNode.previousElementSibling.children[
        indexOfNode
      ].classList.add(playerClassName);
      ws.send(`${playerClassName}-${key}`);

      return;
    }

    if (key === "ArrowDown") {
      if (!activeSquare.parentNode.nextElementSibling) return; //we're at the bottom
      const indexOfNode = getChildElementIndex(activeSquare);
      activeSquare.classList.remove(playerClassName);
      activeSquare.parentNode.nextElementSibling.children[
        indexOfNode
      ].classList.add(playerClassName);
      ws.send(`${playerClassName}-${key}`);

      return;
    }
  }
});

const player = Number(
  Object.fromEntries(new URL(window.location.href).searchParams).player
);

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

  const playerNumber = player || 1;
  const playerClassName = `player${[playerNumber]}`;

  const activeSquare = document.querySelector(`.cell.${playerClassName}`);

  if (key === "ArrowLeft") {
    if (!activeSquare.previousElementSibling) return; //we're at the left most side
    activeSquare.classList.remove(playerClassName);
    activeSquare.previousElementSibling.classList.add(playerClassName);
    ws.send(`${playerClassName}-${key}`);
    return;
  }

  if (key === "ArrowRight") {
    if (!activeSquare.nextElementSibling) return; //we're at the right most side
    activeSquare.classList.remove(playerClassName);
    activeSquare.nextElementSibling.classList.add(playerClassName);
    ws.send(`${playerClassName}-${key}`);

    return;
  }

  if (key === "ArrowUp") {
    if (!activeSquare.parentNode.previousElementSibling) return; //we're at the top

    const indexOfNode = getChildElementIndex(activeSquare);
    activeSquare.classList.remove(playerClassName);
    activeSquare.parentNode.previousElementSibling.children[
      indexOfNode
    ].classList.add(playerClassName);
    ws.send(`${playerClassName}-${key}`);

    return;
  }

  if (key === "ArrowDown") {
    if (!activeSquare.parentNode.nextElementSibling) return; //we're at the bottom
    const indexOfNode = getChildElementIndex(activeSquare);
    activeSquare.classList.remove(playerClassName);
    activeSquare.parentNode.nextElementSibling.children[
      indexOfNode
    ].classList.add(playerClassName);
    ws.send(`${playerClassName}-${key}`);

    return;
  }
});

function getChildElementIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}
