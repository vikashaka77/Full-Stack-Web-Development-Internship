// Tic Tac Toe with AI + Scoreboard
// (mix of human practicality + AI help)

//  Elements
const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector(".msg");
const msgNewBtn = document.querySelector("#msg-new-btn");
const difficultySelect = document.querySelector(".difficulty-select");

let difficulty = "easy"; 
let playWithAI = false;
let turnO = true;  // O starts first
let gameActive = true;

// Scores
const scoreO = document.getElementById("score-o");
const scoreX = document.getElementById("score-x");
const scoreDraw = document.getElementById("score-draw");
let scores = { O: 0, X: 0, draw: 0 };

// Winning positions
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

// Difficulty level selector
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
difficultyRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    difficulty = radio.value;
    console.log("Difficulty changed to:", difficulty);
  });
});

// Mode selector
const modeRadios = document.querySelectorAll('input[name="mode"]');
modeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    playWithAI = (radio.value === "ai");
    difficultySelect.style.display = playWithAI ? "block" : "none";
    resetGame();
  });
});

//  Reset game 
function resetGame() {
  turnO = true;
  gameActive = true;
  boxes.forEach(b => {
    b.innerText = "";
    b.disabled = false;
    b.classList.remove("X","O");
  });
  msgContainer.classList.add("hide");
  console.log("Game has been reset.");
}

// Winner / Draw
function showWinner(winner) {
  gameActive = false;
  msg.innerText = "🎉 Winner is " + winner;
  msgContainer.classList.remove("hide");
  disableBoxes();
  scores[winner]++; updateScores();
}

function showDraw() {
  gameActive = false;
  msg.innerText = "🤝 Draw!";
  msgContainer.classList.remove("hide");
  disableBoxes();
  scores.draw++; updateScores();
}

function disableBoxes(){
  boxes.forEach(b => b.disabled = true);
}

function updateScores(){
  scoreO.innerText = scores.O;
  scoreX.innerText = scores.X;
  scoreDraw.innerText = scores.draw;
}

// Check winner/draw 
function checkWinnerOrDraw() {
  for (let p of winPatterns) {
    const [a,b,c] = p;
    if(boxes[a].innerText &&
       boxes[a].innerText === boxes[b].innerText &&
       boxes[b].innerText === boxes[c].innerText){
      showWinner(boxes[a].innerText);
      return true;
    }
  }
  if ([...boxes].every(b => b.innerText !== "")) {
    showDraw(); return true;
  }
  return false;
}

// AI moves
function aiMove() {
  if (!gameActive) return;
  if (difficulty === "easy") {
    aiEasy();
  } else if (difficulty === "medium") {
    aiMedium();
  } else {
    aiHard();  // minimax
  }
}

function aiEasy(){
  const empty = [...boxes].filter(b => b.innerText === "");
  if (!empty.length) return;
  const pick = empty[Math.floor(Math.random()*empty.length)];
  makeAIMove(pick);
}

function aiMedium(){
  let move = findBestMove("X");
  if(!move) move = findBestMove("O");
  if(!move){
    const free = [...boxes].filter(b => b.innerText==="");
    if(!free.length) return;
    move = free[Math.floor(Math.random()*free.length)];
  }
  makeAIMove(move);
}

function aiHard(){
  const best = minimax(getBoardArray(),"X").index;
  if(best !== undefined){
    makeAIMove(boxes[best]);
  }
}

function makeAIMove(box){
  box.innerText = "X";
  box.classList.add("X");
  box.disabled = true;
  if(!checkWinnerOrDraw()){
    turnO = !turnO;
  }
}

function getBoardArray(){
  return [...boxes].map(b => b.innerText);
}

function findBestMove(player){
  for (let pat of winPatterns){
    const [a,b,c] = pat;
    const line = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
    const count = line.filter(x=>x===player).length;
    const empties = pat.filter(i=>boxes[i].innerText==="");
    if(count===2 && empties.length===1){
      return boxes[empties[0]];
    }
  }
  return null;
}

//  Minimax (kept AI-style, because humans usually borrow this) 
function minimax(board, player){
  const hu="O", ai="X";
  const avail = board.map((v,i)=> v===""?i:null).filter(v=>v!==null);

  if(checkWin(board,hu)) return {score:-10};
  if(checkWin(board,ai)) return {score:10};
  if(avail.length===0) return {score:0};

  let moves=[];
  for(let i=0;i<avail.length;i++){
    let move={};
    move.index = avail[i];
    board[avail[i]] = player;

    let result;
    if(player===ai){
      result = minimax(board,hu);
      move.score = result.score;
    } else {
      result = minimax(board,ai);
      move.score = result.score;
    }

    board[avail[i]] = "";
    moves.push(move);
  }

  // pick best
  let best;
  if(player===ai){
    let bestScore=-Infinity;
    for(let m of moves){ if(m.score>bestScore){bestScore=m.score;best=m;} }
  } else {
    let bestScore=Infinity;
    for(let m of moves){ if(m.score<bestScore){bestScore=m.score;best=m;} }
  }
  return best;
}

function checkWin(board,player){
  return winPatterns.some(p => p.every(i=> board[i]===player));
}

// Player clicks
boxes.forEach(b=>{
  b.addEventListener("click", ()=>{
    if(!gameActive || b.innerText!=="") return;

    if(turnO){
      b.innerText="O"; b.classList.add("O"); b.disabled=true;
      if(!checkWinnerOrDraw()){
        turnO=!turnO;
        if(playWithAI && !turnO){
          setTimeout(aiMove, 400); // AI "thinking" delay
        }
      }
    } else {
      if(!playWithAI){
        b.innerText="X"; b.classList.add("X"); b.disabled=true;
        if(!checkWinnerOrDraw()){ turnO=!turnO; }
      }
    }
  });
});

// Buttons 
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
msgNewBtn.addEventListener("click", resetGame);

// Init
updateScores();
resetGame();
