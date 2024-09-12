const gameboard = (() => {
    const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
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

const gameUI = (() => {
    const gameContainer = document.getElementById('game-container');
    const tileContainer = document.getElementById('tile-container');
    
    const setTileContainer = () => {
        gameboard.cells.forEach(cell => {
            tileContainer.innerHTML += `
            <div class="tile">
                <span class="mark"></span>
            </div>
            `
        });
    };

    return { setTileContainer };
})();

const players = (() => {
    const getPlayerQty = () => {
        const playerQty = prompt("Type the number of players (1 or 2): ");
        if ((parseInt(playerQty) !== 1 && parseInt(playerQty) !== 2)) {
            alert("You can only choose 1 or 2 players. Try again.");
            getPlayerQty();
        } else {
            return playerQty;
        }
    };

    const createPlayer = (name, mark) => {
        return { name, mark, selections: [], selectionMade:false, isWinner: false };
    };

    const setPlayers = (playerQty) => {
        // let player1Name = prompt("Enter the name of the first player (Player 1): ");
        // let player1Mark = prompt("Choose a mark (X or O): ");

        // testing
        let player1Name = "Joel";
        let player1Mark = "x";

        let player1 = createPlayer(player1Name, player1Mark.toUpperCase());

        //player 2 set to CPU if the user selected 1 player. If 2 players, gets name from player2;
        let player2Mark = player1.mark === "X" ? "O" : "X";
        // let player2 = playerQty < 2 ? createPlayer("CPU", player2Mark) : createPlayer(prompt("Enter the name of the second player (Player 2): "), player2Mark);
        let player2 = playerQty < 2 ? createPlayer("CPU", player2Mark) : createPlayer("Player2", player2Mark);

        return { player1, player2 };
    };

    const getPlayerSelection = (currPlayer, opponent) => {
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
                if (!isClicked){
                    if (gameboard.getRemainingCells().includes(index+1)) {
                        currPlayer.selections.push(index+1);
                        currPlayer.selectionMade = !currPlayer.selectionMade;
                        opponent.selectionMade = false;
                        isClicked = true;
    
                        gameboard.updateRemainingCells(cell => !currPlayer.selections.includes(cell));
                        marks[index].textContent = `${currPlayer.mark}`;
                        marks[index].classList.add("active");
                        marks[index].classList.remove("hover");
                        
                        console.log(currPlayer.selections);
                        playGame.playTurn();
    
                    } else {
                        alert("That cell is already selected. Try again.");
                    }
                }
            });
        });
    }

    const getCpuSelection = () => {
        const remainingCells = gameboard.getRemainingCells();
        let index = Math.floor(Math.random() * remainingCells.length);
        return remainingCells[index];
    };

    const checkWinner = (player) => {
        let playerSelections = player.selections.sort((a,b) => a - b);
        console.log(playerSelections);
    
        const winningCombinations = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9], // Horizontal
            [1, 4, 7], [2, 5, 8], [3, 6, 9], // Vertical
            [1, 5, 9], [3, 5, 7] // Diagonal
        ];
    
        winningCombinations.forEach(combination => {
            if (combination.every(num => playerSelections.includes(num))) {
                player.isWinner = true;
                alert(`${player.name} won the game!`);
                return;
            }
        });
    };

    const clearSelections = (player1, player2) => {
        player1.selections = [];
        player2.selections = [];
    }

    return { 
        getPlayerQty,
        createPlayer,
        setPlayers,
        getPlayerSelection,
        getCpuSelection,
        checkWinner,
        clearSelections,
    }
})();


const playGame = (function () {
    // let playerQty = players.getPlayerQty();
    
    // testing
    let playerQty = 2;
    let { player1, player2 } = players.setPlayers(playerQty);
    console.log(player1, player2);

    gameUI.setTileContainer();
    
    const playTurn = () => {
        if (!player1.selectionMade) {
            console.log("player1 selecting...")
            players.getPlayerSelection(player1, player2);
        } else {
            console.log("player2 selecting...")
            players.getPlayerSelection(player2, player1);
        }
    };

    playTurn()

    const playGame = () => {
        // while (gameboard.getRemainingCells().length > 0) {
        //     if (player1.isWinner || player2.isWinner) {
        //         console.table(player1.selections);
        //         console.table(player2.selections);
        //         break;
        //     }
    
            playTurn(player1);
            // if (player1.selections.length > 2) {
            //     players.checkWinner(player1);
            // }
            if (gameboard.getRemainingCells().length > 0 && !player1.isWinner) {
                playTurn(player2);
                if (player2.selections.length > 2) {
                    players.checkWinner(player2);
                }
            }
        // }

        // if (!player1.isWinner && !player2.isWinner) {
        //     alert("The game ended in a tie.");
        // }

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
    }
    
    // playGame();

    return {
        playTurn,
    }
})();
