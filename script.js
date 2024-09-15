const gameContainer = document.getElementById('game-container');
const modeSelectScreen = document.getElementById('mode-select-screen');
const modeBtn = document.querySelectorAll('.mode-btn');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const markSelectBtn = document.querySelectorAll('.mark-select-btn');
const playerOptionsScreen = document.getElementById('player-options-screen');
const player1InfoScreen = document.getElementById('player1-info');
const player2InfoScreen = document.getElementById('player2-info');
const submitPlayer1InfoBtn = document.getElementById('submit-player1-info');
const submitPlayer2InfoBtn = document.getElementById('submit-player2-info');
const tileContainer = document.getElementById('tile-container');

const GameBoard = (() => {
    const boardCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    let remainingCells = boardCells.map(cell => cell);
    const getRemainingCells = () => remainingCells;
    const updateRemainingCells = (filtering) => {
        remainingCells = remainingCells.filter(filtering);
    };

    const resetRemainingCells = () => {
        remainingCells = boardCells.map(cell => cell);
    };

    return  {
        boardCells,
        getRemainingCells,
        updateRemainingCells,
        resetRemainingCells,
    };
})();

const PlayerManager = (() => {
    const createPlayer = (name, mark) => {
        return { name, mark, selections: [], selectionMade: false, isWinner: false };
    };

    const checkWinner = (player) => {
        let playerSelections = player.selections.sort((a,b) => a - b);
    
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6] // Diagonal
        ];
    
        winningCombinations.forEach(combination => {
            if (combination.every(num => playerSelections.includes(num))) {
                player.isWinner = true;
                GameManager.endGame(player);
                return;
            }
        });
    };

    return { 
        createPlayer,
        checkWinner,
    }
})();

const UIManager = (() => {
    const createBoard = () => {
        tileContainer.innerHTML = '';
        GameBoard.boardCells.forEach(cell => {
            tileContainer.innerHTML += `
            <div class="tile">
                <span class="mark"></span>
            </div>
            `
        });
    };

    const onboardingFlow = () => {
        let playerQty;
        modeBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                playerQty = parseInt(btn.value);
                modeSelectScreen.style.display = 'none';
                playerOptionsScreen.style.display = 'flex';
            })
        })
            
        let player1;
        let player2;
        let player1Mark = "";
        let player1Name = "";
        let player2Mark = "";
        let player2Name = "";
        markSelectBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.id === 'X') {
                    player1Mark = 'X';
                } else {
                    player1Mark = 'O';
                }
            })
        })

        submitPlayer1InfoBtn.addEventListener('click', () => {
            if (player1NameInput.value === "") {
                player1NameInput.value = "Player1";
            }
            player1Name = player1NameInput.value;
            player1 = PlayerManager.createPlayer(player1Name, player1Mark);
            player1InfoScreen.style.display = 'none';
            if (playerQty === 1) {
                createCPU();
            } else if (playerQty === 2){
                createPlayer2();
            }
        })

        const createPlayer2 = () => {
            player2InfoScreen.style.display = 'grid';
            submitPlayer2InfoBtn.addEventListener('click', () => {
                if (player2NameInput.value === "") {
                    player2NameInput.value = "Player2";
                }
                player2Name = player2NameInput.value;
                player2InfoScreen.style.display = 'none';
                player2Mark = player1.mark === "X" ? "O" : "X";
                player2 = PlayerManager.createPlayer(player2Name, player2Mark);
                playerOptionsScreen.style.display = 'none';
                createBoard();
                tileContainer.style.display = 'grid';
                GameManager.playTurn(player1, player2, playerQty);
            });
        };

        const createCPU = () => {
            player2Mark = player1.mark === "X" ? "O" : "X";
            player2 = PlayerManager.createPlayer("CPU", player2Mark);
            playerOptionsScreen.style.display = 'none';
            createBoard();
            tileContainer.style.display = 'grid';
            GameManager.playTurn(player1, player2, playerQty);
        };
        return {
            playerQty,
        }
    };

    const getPlayerSelection = (currPlayer, opponent, playerQty) => {
        const tiles = document.querySelectorAll('.tile');
        const marks = document.querySelectorAll('.mark');
        
        let isClicked = false;
        tiles.forEach((tile, index) => {
            tile.addEventListener('mouseenter', () => {
                if (!isClicked && !marks[index].textContent) {
                    marks[index].textContent = `${currPlayer.mark}`;
                }
            });

            tile.addEventListener('mouseleave', () => {
                if (!isClicked && !marks[index].classList.contains('active')) {
                    marks[index].textContent = "";
                }
            });

            tile.addEventListener('click', () => {
                let remainingCells = GameBoard.getRemainingCells();
                if (!isClicked){
                    if (remainingCells.includes(index)) {
                        currPlayer.selections.push(index);
                        currPlayer.selectionMade = !currPlayer.selectionMade;
                        opponent.selectionMade = false;
                        isClicked = true;
    
                        GameBoard.updateRemainingCells(cell => !currPlayer.selections.includes(cell));
                        marks[index].textContent = `${currPlayer.mark}`;
                        marks[index].classList.add("active");
                        marks[index].classList.remove("hover");
                        
                        if (currPlayer.selections.length > 2) {
                            PlayerManager.checkWinner(currPlayer);
                        }
                        GameManager.playTurn(currPlayer, opponent, playerQty);

                    } else {
                        alert("That cell is already selected. Try again.");
                    }
                }
            });
        });
    }

    const getCpuSelection = (player1, player2) => {
        const marks = document.querySelectorAll('.mark');
        const remainingCells = GameBoard.getRemainingCells();

        let index = remainingCells[Math.floor(Math.random() * remainingCells.length)];

        player2.selections.push(index);
        player2.selectionMade = !player2.selectionMade;
        player1.selectionMade = false;

        GameBoard.updateRemainingCells(cell => !player2.selections.includes(cell));
        marks[index].textContent = `${player2.mark}`;
        marks[index].classList.add("active");

        if (player2.selections.length > 2) {
            PlayerManager.checkWinner(player2);
        }

        GameManager.playTurn(player1, player2);
    };


    return { 
        createBoard, 
        onboardingFlow,
        getPlayerSelection,
        getCpuSelection,
     };
})();

const GameManager = (function () {

    const startGame = (() => {
        UIManager.onboardingFlow();    
    })();
    
    const playTurn = (player1, player2, playerQty) => {
        if (playerQty === 2 ) {
            if (GameBoard.getRemainingCells().length === 0 && (!player1.isWinner && !player2.isWinner)) {
                GameManager.endGame(player1, player2);
            }
            
            if (!player1.selectionMade) {
                UIManager.getPlayerSelection(player1, player2, playerQty);
            } else {
                if (GameBoard.getRemainingCells().length > 0 && !player1.isWinner) {
                    UIManager.getPlayerSelection(player2, player1, playerQty);
                }
            }
        } else {
            if (GameBoard.getRemainingCells().length === 0 && (!player1.isWinner && !player2.isWinner)) {
                GameManager.endGame(player1, player2);
            }
    
            if (!player1.selectionMade) {
                UIManager.getPlayerSelection(player1, player2);
            } else {
                if (GameBoard.getRemainingCells().length > 0 && !player1.isWinner) {
                    UIManager.getCpuSelection(player1, player2);
                }
            }
        }
    };


    const endGame = (player1, player2) => {
        const gameEndElement = document.createElement('h3');
        const restartBtn = document.createElement('button');
        restartBtn.id = 'restart-btn';
        restartBtn.textContent = "Restart";

        let winner;
        if (player1.isWinner || player2.isWinner) {
            winner = player1.isWinner ? player1.name : player2.name;    
        }
        
        if (winner) {
            gameEndElement.textContent = `
            ${winner} is the winner!
            
            Restart game?
            `;    
        } else {
            gameEndElement.textContent = `The game ended in a tie.
            
            Restart game?`;
        }

        gameContainer.insertBefore(gameEndElement, tileContainer);
        gameContainer.insertBefore(restartBtn, tileContainer);

        restartBtn.addEventListener('click', () => {
            GameBoard.resetRemainingCells();
            gameEndElement.remove();
            restartBtn.remove();

            tileContainer.style.display = "none";
            
            modeSelectScreen.style.display = "flex";
            player1InfoScreen.style.display = "grid";
            player1 = {};
            player2 = {};
            UIManager.startGame;
        });
    }

    return {
        startGame,
        playTurn,
        endGame,
    }
})();
