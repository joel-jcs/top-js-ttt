const gameContainer = document.getElementById('game-container');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const markSelectBtn = document.querySelectorAll('.mark-select-btn');
const playerOptionsScreen = document.getElementById('player-options-screen');
const player1InfoScreen = document.getElementById('player1-info');
const player2InfoScreen = document.getElementById('player2-info');
const submitPlayer1InfoBtn = document.getElementById('submit-player1-info');
const submitPlayer2InfoBtn = document.getElementById('submit-player2-info');
const tileContainer = document.getElementById('tile-container');

const gameboard = (() => {
    const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    let remainingCells = cells.map(cell => cell);
    const getRemainingCells = () => remainingCells;
    const updateRemainingCells = (filtering) => {
        remainingCells = remainingCells.filter(filtering);
    };

    const clearBoard = () => {
        remainingCells = cells.map(cell => cell);
    };

    return  {
        cells,
        getRemainingCells,
        updateRemainingCells,
        clearBoard,
    };
})();

const players = (() => {
    
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
                gameUI.endGame(player);
                return;
            }
        });
    };

    const clearSelections = (player1, player2) => {
        player1.selections = [];
        player2.selections = [];
    }

    return { 
        createPlayer,
        checkWinner,
        clearSelections,
    }
})();

const gameUI = (() => {
    const setTileContainer = () => {
        gameboard.cells.forEach(cell => {
            tileContainer.innerHTML += `
            <div class="tile">
                <span class="mark"></span>
            </div>
            `
        });
    };

    const onboardingFlow = (() => {

        const modeSelectScreen = document.getElementById('mode-select-screen');
        const modeBtn = document.querySelectorAll('.mode-btn');
        
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
            player1 = players.createPlayer(player1Name, player1Mark);
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
                player2 = players.createPlayer(player2Name, player2Mark);
                playerOptionsScreen.style.display = 'none';
                setTileContainer();
                tileContainer.style.display = 'grid';
                gameHandler().playTurn(player1, player2, playerQty);
            });
        };

        const createCPU = () => {
            player2Mark = player1.mark === "X" ? "O" : "X";
            player2 = players.createPlayer("CPU", player2Mark);
            playerOptionsScreen.style.display = 'none';
            setTileContainer();
            tileContainer.style.display = 'grid';
            console.table(player2);
            gameHandler().playTurn(player1, player2, playerQty);
        };
        return {
            playerQty,
        }
    })();

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
                let remainingCells = gameboard.getRemainingCells();
                if (!isClicked){
                    if (remainingCells.includes(index)) {
                        currPlayer.selections.push(index);
                        currPlayer.selectionMade = !currPlayer.selectionMade;
                        opponent.selectionMade = false;
                        isClicked = true;
    
                        gameboard.updateRemainingCells(cell => !currPlayer.selections.includes(cell));
                        marks[index].textContent = `${currPlayer.mark}`;
                        marks[index].classList.add("active");
                        marks[index].classList.remove("hover");
                        
                        if (currPlayer.selections.length > 2) {
                            players.checkWinner(currPlayer);
                        }
                        gameHandler().playTurn(currPlayer, opponent, playerQty);

                    } else {
                        alert("That cell is already selected. Try again.");
                    }
                }
            });
        });
    }

    const getCpuSelection = (player1, player2) => {
        const marks = document.querySelectorAll('.mark');
        const remainingCells = gameboard.getRemainingCells();

        let index = remainingCells[Math.floor(Math.random() * remainingCells.length)];

        player2.selections.push(index);
        player2.selectionMade = !player2.selectionMade;
        player1.selectionMade = false;

        gameboard.updateRemainingCells(cell => !player2.selections.includes(cell));
        marks[index].textContent = `${player2.mark}`;
        marks[index].classList.add("active");

        if (player2.selections.length > 2) {
            players.checkWinner(player2);
        }

        gameHandler().playTurn(player1, player2);
    };


    // TODO: need to add a "Restart?" button. clicking it will restart the game and clear up all selections, reset tilecontainer, and reset remainingcells
    const endGame = (player1, player2) => {
        const gameEndElement = document.createElement('h3');

        let winner;
        if (player1.isWinner || player2.isWinner) {
            winner = player1.isWinner ? player1.name : player2.name;    
        }
        
        if (winner) {
            gameEndElement.textContent = `${winner} is the winner!`;    
        } else {
            gameEndElement.textContent = `The game ended in a tie.`;
        }
        gameContainer.innerHTML = `<h1>Tic Tac Toe</h1>`;
        gameContainer.appendChild(gameEndElement);
        gameContainer.appendChild(tileContainer);
    }

    return { 
        setTileContainer, 
        onboardingFlow,
        getPlayerSelection,
        getCpuSelection,
        endGame,
     };
})();

const gameHandler = function () {
    
    const playTurn = (player1, player2, playerQty) => {
        if (playerQty === 2 ) {
            if (gameboard.getRemainingCells().length === 0 && (!player1.isWinner && !player2.isWinner)) {
                gameUI.endGame(player1, player2);
            }
            
            if (!player1.selectionMade) {
                gameUI.getPlayerSelection(player1, player2, playerQty);
            } else {
                if (gameboard.getRemainingCells().length > 0 && !player1.isWinner) {
                    gameUI.getPlayerSelection(player2, player1, playerQty);
                }
            }
        } else {
            if (gameboard.getRemainingCells().length === 0 && (!player1.isWinner && !player2.isWinner)) {
                gameUI.endGame(player1, player2);
            }
    
            if (!player1.selectionMade) {
                gameUI.getPlayerSelection(player1, player2);
            } else {
                if (gameboard.getRemainingCells().length > 0 && !player1.isWinner) {
                    gameUI.getCpuSelection(player1, player2);
                }
            }
        }
    };


    // const playGame = (player1, player2) => {
        // const restartGame = () => {
        //     gameboard.clearBoard();
        //     player1.isWinner = false;
        //     player2.isWinner = false;
        //     player1.selections = [];
        //     player2.selections = [];
    
        //     playGame();
        // }

        // let restart = prompt("Would you like to play again? (y/n) ");
        // if (restart.toLowerCase().match(/y|yes/i)) {
        //     restartGame();
        // } else if (restart.toLowerCase().match(/n|no/i)) {
        //     alert("Thanks for playing!")
        // } else {
        //     return;
        // }
    // }
    
    return {
        playTurn, 
    }
};
