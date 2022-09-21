const myIPs = ["192.168.1.21", "192.168.1.82", "192.168.240.1", "localhost"];
const ws = new WebSocket(`ws://${myIPs[3]}:8080`);
const progress = document.querySelector("progress");
const createLobbyBtn = document.getElementById("create-lobby");
const joinLobbyBtn = document.getElementById("join-lobby");
const exitLobbyBtn = document.getElementById("exit-lobby");
const viewAllLobbiesBtn = document.getElementById("view-all-lobbies");
const lobbyIdInput = document.getElementById("lobby-id");
const lobbyInfo = document.getElementById("lobby-info");
const wsInfo = document.getElementById("ws-info");
const lobbiesDialog = document.getElementById("lobbies-dialog");
const lobbiesDiv = document.getElementById("lobbies");
const closeDialogBtn = document.getElementById("close-dialog");
const playerId = getCookie(document.cookie, "id");
let currentLobby;
ws.addEventListener("open", (e) => {
  updateWsInfo({ ...e, connected: true });
});
ws.addEventListener("message", async (e) => {
  // updateWsInfo()

  const data = e.data;
  const json = JSON.parse(data);

  // console.log(json);
  // console.log(currentLobby)
  if (json.type === "set-cookie") {
    document.cookie = `id=${json.data}; SameSite=lax; Secure`;
    return;
  }

  if (!currentLobby && json.type === "create-lobby") {
    currentLobby = json.data.lobby;
    createLobby(currentLobby);
    return;
  }
  if (!currentLobby && json.type === "join-lobby") {
    currentLobby = json.data.lobby;
    player = 2;
    joinLobby(currentLobby);
    return;
  }

  if (currentLobby?.id === json.lobbyId && json.type === "exit-lobby") {
    updateLobbyInfo(undefined);
    return;
  }

  if (currentLobby?.id === json.data?.lobby?.id && json.type === "move") {
    console.log(`move for lobby ${json.data.lobby.id}`);
    return;
  }

  if (json.type === "all-lobbies") {
    console.log(json);
    displayLobbies(json.data.lobbies);
    return;
  }

  if (json.data?.lobby?.id === currentLobby?.id) {
    updateLobbyInfo(json.data.lobby);
  }

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

ws.addEventListener("error", (e) => {
  updateWsInfo({ ...e, connected: false });
});

let player = Number(
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
  if (!currentLobby) return;
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
  let moveData = {
    type: "move",
    data: {
      lobbyId: currentLobby?.id,
      move: key
    }
  };

  if (key === "ArrowLeft") {
    if (!activeSquare.previousElementSibling) return; //we're at the left most side
    activeSquare.classList.remove(playerClassName);
    activeSquare.previousElementSibling.classList.add(playerClassName);
    // ws.send(`${playerClassName}-${key}`)
    // return
  }

  if (key === "ArrowRight") {
    if (!activeSquare.nextElementSibling) return; //we're at the right most side
    activeSquare.classList.remove(playerClassName);
    activeSquare.nextElementSibling.classList.add(playerClassName);
    // ws.send(`${playerClassName}-${key}`)

    // return
  }

  if (key === "ArrowUp") {
    if (!activeSquare.parentNode.previousElementSibling) return; //we're at the top

    const indexOfNode = getChildElementIndex(activeSquare);
    activeSquare.classList.remove(playerClassName);
    activeSquare.parentNode.previousElementSibling.children[
      indexOfNode
    ].classList.add(playerClassName);
    // ws.send(`${playerClassName}-${key}`)

    // return
  }

  if (key === "ArrowDown") {
    if (!activeSquare.parentNode.nextElementSibling) return; //we're at the bottom
    const indexOfNode = getChildElementIndex(activeSquare);
    activeSquare.classList.remove(playerClassName);
    activeSquare.parentNode.nextElementSibling.children[
      indexOfNode
    ].classList.add(playerClassName);
    // ws.send(`${playerClassName}-${key}`)

    // return
  }

  ws.send(JSON.stringify(moveData));
});

createLobbyBtn?.addEventListener("click", () => {
  const data = JSON.stringify({
    type: "create-lobby",
    data: null
  });
  ws.send(data);
});
joinLobbyBtn?.addEventListener("click", () => {
  const { value } = lobbyIdInput;
  if (!value) {
    alert("Please enter a lobby id");
    lobbyIdInput?.focus();
    return;
  }

  const data = JSON.stringify({
    type: "join-lobby",
    data: {
      lobbyId: value
    }
  });
  ws.send(data);
});

viewAllLobbiesBtn.addEventListener("click", () => {
  const data = JSON.stringify({
    type: "all-lobbies",
    data: null
  });

  ws.send(data);
  lobbiesDialog.showModal();
});

lobbiesDialog.addEventListener("click", (event) => {
  const isButton = event.target.nodeName === "BUTTON";
  const isJoinLobbyButton = event.target.id.includes("join-lobby-");
  if (!isButton || !isJoinLobbyButton) {
    return;
  }

  const lobbyId = event.target.id.substring(11);
  const data = JSON.stringify({
    type: "join-lobby",
    data: {
      lobbyId
    }
  });
  ws.send(data);
  lobbiesDialog.close();
  viewAllLobbiesBtn.style.pointerEvents = "none";
  viewAllLobbiesBtn.style.opacity = "0";
  clearLobbiesList();
});

closeDialogBtn.addEventListener("click", () => {
  clearLobbiesList();
});

exitLobbyBtn.addEventListener("click", () => {
  if (!currentLobby) return;

  ws.send(
    JSON.stringify({
      type: "exit-lobby",
      lobbyId: currentLobby.id
    })
  );

  createLobbyBtn.removeAttribute("disabled");
  joinLobbyBtn.removeAttribute("disabled");
  exitLobbyBtn.style.pointerEvents = "none";
  exitLobbyBtn.style.opacity = "0";
  viewAllLobbiesBtn.style.pointerEvents = "all";
  viewAllLobbiesBtn.style.opacity = "1";
  lobbyIdInput.value = "";
  lobbyIdInput.removeAttribute("disabled");
});

function updateWsInfo(data) {
  wsInfo.textContent = JSON.stringify(data, null, 2);
}

function getChildElementIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}

function createLobby(lobby) {
  createLobbyBtn.setAttribute("disabled", "true");
  joinLobbyBtn.setAttribute("disabled", "true");
  viewAllLobbiesBtn.style.pointerEvents = "none";
  viewAllLobbiesBtn.style.opacity = "0";
  exitLobbyBtn.style.pointerEvents = "all";
  exitLobbyBtn.style.opacity = "1";
  lobbyIdInput.value = "";
  lobbyIdInput.setAttribute("disabled", "true");
  lobbyInfo.textContent = JSON.stringify(lobby, null, 2);
}

function joinLobby(lobby) {
  createLobbyBtn.setAttribute("disabled", "true");
  joinLobbyBtn.setAttribute("disabled", "true");
  viewAllLobbiesBtn.style.pointerEvents = "none";
  viewAllLobbiesBtn.style.opacity = "0";
  exitLobbyBtn.style.pointerEvents = "all";
  exitLobbyBtn.style.opacity = "1";
  lobbyIdInput.value = "";
  lobbyIdInput.setAttribute("disabled", "true");
  lobbyInfo.textContent = JSON.stringify(lobby, null, 2);
}

function updateLobbyInfo(lobby) {
  currentLobby = lobby;
  lobbyInfo.textContent = JSON.stringify(currentLobby, null, 2);
}

function displayLobbies(lobbies) {
  const l = Object.entries(lobbies);
  if (l.length === 0) {
    lobbiesDiv.innerHTML += `
      <p style="color: red">No current lobbies</p>
    `;
    return;
  }
  l.forEach(([column, lobby]) => {
    lobbiesDiv.innerHTML += `
      <button style="display:block;" id="join-lobby-${lobby.id}">${lobby.id} - [${lobby.players.length}]</button>
    `;
  });
}

function clearLobbiesList() {
  lobbiesDiv.innerHTML = "";
}

function getCookie(cookies, name) {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
