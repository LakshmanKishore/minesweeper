let table = document.querySelector("#table");
let h1 = document.querySelector("#heading");
let i, j, x, y;
let lose = false; //for displaying win or lose
let bomb = "#";

function Create2DArray(rows, columns) {
  var x = new Array(rows);
  for (let i = 0; i < rows; i++) {
    x[i] = new Array(columns);
  }
  return x;
}

let rowsAndColumns = 10;

let td = Create2DArray(rowsAndColumns, rowsAndColumns);
let boxSize; //bw-->boxsize

if (window.innerHeight < window.innerWidth) {
  boxSize = window.innerHeight;
} else {
  boxSize = window.innerWidth;
}

function Box(box, i, j) {
  this.i = i;
  this.j = j;
  this.box = box;
  this.hidden = true;
}

function generateTable(table) {
  for (let i = 0; i < rowsAndColumns; i++) {
    let row = table.insertRow();
    for (let j = 0; j < rowsAndColumns; j++) {
      let cell = row.insertCell();
      let text = document.createTextNode(" ");
      cell.style.border = "solid 2px black";
      cell.style.height = (boxSize - 100) / 10 + "px";
      cell.style.width = (boxSize - 100) / 10 + "px";
      cell.style.fontWeight = "bold";
      cell.style.textAlign = "center";
      cell.style.backgroundColor = "green";
      cell.style.textIndent = "-9999px";
      cell.style.fontSize = "30px";
      cell.style.padding = "0px";
      cell.appendChild(text);
      td[i][j] = new Box(cell, i, j);
    }
  }
}
generateTable(table);

//To place bombs
for (let i = 0; i < rowsAndColumns; i++) {
  let bombX = Math.floor(Math.random() * rowsAndColumns);
  let bombY = Math.floor(Math.random() * rowsAndColumns);

  if (
    (bombX - 1 >= 0 && td[bombX - 1][bombY].box.innerText == bomb) ||
    (bombX + 1 < rowsAndColumns && td[bombX + 1][bombY].box.innerText == bomb)
  ) {
    i--;
    continue;
  }

  if (td[bombX][bombY].box.innerText != bomb) {
    td[bombX][bombY].box.innerText = bomb;
    td[bombX][bombY].hidden = false;
  } else i--;
}

//Increment neighbor surrounded by the bomb
for (let i = 0; i < rowsAndColumns; i++) {
  for (let j = 0; j < rowsAndColumns; j++)
    if (td[i][j].box.innerText == bomb) {
      for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
          if (x != -1 && x != rowsAndColumns && y != -1 && y != rowsAndColumns)
            if (td[x][y].box.innerText != bomb) {
              td[x][y].box.innerText++;
            }
        }
      }
    }
}

table.addEventListener("click", start);

function start(e) {
  let boxSelect = e.target.closest("td");

  if (!boxSelect) return;

  for (let i = 0; i < rowsAndColumns; i++)
    for (let j = 0; j < rowsAndColumns; j++) {
      if (boxSelect == td[i][j].box) {
        if (boxSelect.innerText == "#") {
          h1.innerText = "Game Over";
          alert("GAME OVER");
          revealAll();
        }
        checkEmpty(i, j);
        if (boxSelect.innerText != "") {
          boxSelect.style.backgroundColor = "white";
          boxSelect.style.textIndent = "0px";
          td[i][j].hidden = false;
        }
      }
    }

  //To check win
  let win = true;
  td.map((x) => (win = win && x.every((x) => !x.hidden)));
  if (win) {
    if (!lose) {
      heading.innerText = "YOU WON MINESWEEPER";
      alert("You won the game");
    }
    table.removeEventListener("click", start);
  }
}

function checkEmpty(x, y) {
  if (td[x][y].box.style.backgroundColor != "white")
    if (td[x][y].box.innerText == "") {
      reveal(x, y);
      checkNeighbour(x, y);
    }
}

function checkNeighbour(i, j) {
  for (let x = i - 1; x <= i + 1; x++) {
    for (let y = j - 1; y <= j + 1; y++) {
      if (x != -1 && x != rowsAndColumns && y != -1 && y != rowsAndColumns) {
        checkEmpty(x, y);
        reveal(x, y);
      }
    }
  }
}

function reveal(x, y) {
  td[x][y].box.style.backgroundColor = "white";
  td[x][y].box.style.textIndent = "0px";
  td[x][y].hidden = false;
}

function revealAll() {
  for (let x = 0; x < rowsAndColumns; x++)
    for (let y = 0; y < rowsAndColumns; y++) {
      reveal(x, y);
      if (x == rowsAndColumns - 1 && y == rowsAndColumns - 1) lose = true;
    }
}
