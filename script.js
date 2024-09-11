const gameboard = (() => {
    const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    let remainingCells = cells.map(cell => cell);
    const getRemainingCells = () => remainingCells;
    const updateRemainingCells = (filtering) => {
        remainingCells = remainingCells.filter(filtering);
    };

    let boardState = cells.map(cell => cell);
    const getBoardState = () => boardState;
    const updateBoardState = (playerSelections, playerMark) => {
        boardState.map((cell, index) => boardState[index] = playerSelections.includes(cell) ? playerMark : cell);
    };

    const clearBoard = () => {
        remainingCells = cells.map(cell => cell);
        boardState = cells.map(cell => cell);
    };

    return  {
        cells,
        getRemainingCells,
        updateRemainingCells,
        getBoardState,
        updateBoardState,
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
        })
    }

    const selectTile = () => {
        const tiles = document.querySelectorAll('.tile');
        const marks = document.querySelectorAll('.mark');

        tiles.forEach((tile, index) => {
            
                tile.addEventListener('mouseenter', () => {
                    if (!marks[index].textContent) {
                        marks[index].textContent = "X";
                    }
                });
    
                tile.addEventListener('mouseleave', () => {
                    if (!isClicked) {
                        marks[index].textContent = "";
                    }
                });
            
            
            let isClicked = false;
            tile.addEventListener('click', () => {
                marks[index].textContent = "X";
                marks[index].classList.add("active");
                marks[index].classList.remove("hover");
                isClicked = true;
            });
        });
    }

    return { setTileContainer, selectTile };
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
        return { name, mark, selections: [], isWinner: false };
    };

    const setPlayers = (playerQty) => {
        let player1Name = prompt("Enter the name of the first player (Player 1): ");
        let player1Mark = prompt("Choose a mark (X or O): ");
        let player1 = createPlayer(player1Name, player1Mark.toLowerCase());

        //player 2 set to CPU if the user selected 1 player. If 2 players, gets name from player2;
        let player2Mark = player1.mark === "x" ? "o" : "x";
        let player2 = playerQty < 2 ? createPlayer("CPU", player2Mark) : createPlayer(prompt("Enter the name of the second player (Player 2): "), player2Mark);

        return { player1, player2 };
    };

    const getPlayerSelection = (player) => {
        let selection = 0;
        const boardState = gameboard.getBoardState();
        let row1 = boardState.slice(0, 3);
        let row2 = boardState.slice(3, 6);
        let row3 = boardState.slice(6, 9);
        
        const selectionPrompt = () => {
            selection = prompt(`
                It's ${player.name}'s turn to play. 
                
                Type in the number that corresponds to the cell you want to mark: 
                ${row1}
                ${row2}
                ${row3}
            `);
                
            if (!parseInt(selection) || parseInt(selection) < 1 || parseInt(selection) > 9) {
                alert("Please type a number");
                selectionPrompt();
            }

            if (!gameboard.getRemainingCells().includes(parseInt(selection))) {
                alert("That cell has already been marked. Please type the number of a cell that hasn't been marked");
                selectionPrompt();
            }
            return selection;
        }
        return selectionPrompt();
    };

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

    const clearSelections = () => {
        player1.selections = [];
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
    // let { player1, player2 } = players.setPlayers(playerQty);
    // console.log(player1, player2);

    gameUI.setTileContainer();
    gameUI.selectTile();

    const playTurn = (player) => {
        if (playerQty < 2) {
            player.selections.push(player === player1 ? parseInt(players.getPlayerSelection(player)) : players.getCpuSelection());
        } else {
            player.selections.push(parseInt(players.getPlayerSelection(player)));
        }
        gameboard.updateRemainingCells(cell => !player.selections.includes(cell));
        gameboard.updateBoardState(player.selections, player.mark);
    }

    const playGame = () => {
        while (gameboard.getRemainingCells().length > 0) {
            if (player1.isWinner || player2.isWinner) {
                console.table(player1.selections);
                console.table(player2.selections);
                break;
            }
    
            playTurn(player1);
            if (player1.selections.length > 2) {
                players.checkWinner(player1);
            }
            if (gameboard.getRemainingCells().length > 0 && !player1.isWinner) {
                playTurn(player2);
                if (player2.selections.length > 2) {
                    players.checkWinner(player2);
                }
            }
        }

        if (!player1.isWinner && !player2.isWinner) {
            alert("The game ended in a tie.");
        }

        const restartGame = () => {
            gameboard.clearBoard();
            player1.isWinner = false;
            player2.isWinner = false;
            player1.selections = [];
            player2.selections = [];
    
            playGame();
        }

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
})();