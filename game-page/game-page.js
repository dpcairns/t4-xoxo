import { renderHeader } from '../header/header.js';
import { getFromLocalStorage, setInLocalStorage } from '../utils.js';
import { checkWin, getComputerMove, renderGameResult, pushNewRoundToLocalStorage, setOutcomeInteger, getUserInfo, cellLocation, cellName, populateBoardElement } from './game-page-utils.js';

renderHeader();

const userInfo = getUserInfo();

const userName = document.getElementById('user-name');
userName.textContent = `User: ${userInfo.name}`;

const difficultyElem = document.getElementById('difficulty');
difficultyElem.textContent = `Difficulty: ${userInfo.difficulty}`;

const totalWins = document.getElementById('total-wins');
const totalLosses = document.getElementById('total-losses');
const totalCats = document.getElementById('total-cats');

totalWins.textContent = localStorage.getItem('Wins');
totalLosses.textContent = localStorage.getItem('Losses');
totalCats.textContent = localStorage.getItem('Cats');

//grab user input from local storage and set player name and difficulty on page

//hide play button (CSS?)

//click handler on each cell to put X or O in cell
//if cell is occupied do not execute more logic (ie. break out of handler)
// place SVG image on board cell
// update local board with turn and player who placed piece
// check if player has won
// check if 9 moves occurred
//if win, push outcome to local storage object
//display next game option
//increment wins, losses, or cats on page
//if no win computer goes
//figure out computer next move
//play computer svg piece in cell
//update board object
//check if computer won
//check if 9 move occurred



const boardForm = document.getElementById('board-form');

const mostRecentRound = getFromLocalStorage('roundsData');
const mostRecentBoard = mostRecentRound[mostRecentRound.length - 1].board;
populateBoardElement(boardForm, mostRecentBoard);

boardForm.addEventListener('click', (e) => {

    const roundsData = getFromLocalStorage('roundsData');
    const currentBoard = roundsData[roundsData.length - 1].board;

    // Set Image to X
    const cell = e.target;

    if (cell.src || roundsData[roundsData.length - 1].outcome > -2) {
        return;
    }


    const image = document.createElement('img');
    image.setAttribute('src', '../assets/SingleX.svg');

    cell.appendChild(image);


    // Adjust Board Object in localStorage
    const cellNumber = cellLocation(cell.id);


    currentBoard[cellNumber].player = 'player';

    let numberOfTurns = getTurnNumber(currentBoard) + 1;
    currentBoard[cellNumber].turn = numberOfTurns;

    roundsData[roundsData.length - 1].board = currentBoard;
    setInLocalStorage('roundsData', roundsData);

    let winStatus = checkWin(currentBoard);

    if (winStatus === null) {
        const computersMove = getComputerMove();
        const computerCell = document.getElementById(cellName(computersMove));

        const compImage = document.createElement('img');
        compImage.setAttribute('src', '../assets/SingleO.svg');
        computerCell.appendChild(compImage);

        currentBoard[computersMove].player = 'computer';

        numberOfTurns = getTurnNumber(currentBoard) + 1;
        currentBoard[computersMove].turn = numberOfTurns;

        roundsData[roundsData.length - 1].board = currentBoard;
        setInLocalStorage('roundsData', roundsData);

        winStatus = checkWin(currentBoard);

    }

    if (winStatus) {
        renderGameResult(winStatus);
        setOutcomeInteger(winStatus);
    }

});



function getTurnNumber(boardArray) {
    let numberOfTurns = -1;

    boardArray.forEach(
        element => {
            if (element.turn > numberOfTurns) {
                numberOfTurns = element.turn;
            }
        }
    );

    return numberOfTurns;
}

const newGameButton = document.getElementsByTagName('button')[0];
const resetSeriesButton = document.getElementsByTagName('button')[1];

newGameButton.addEventListener('click', () => {
    pushNewRoundToLocalStorage();
    resetGameBoardDOM();

    const userInfo = getUserInfo();

    const userName = document.getElementById('user-name');
    userName.textContent = `User: ${userInfo.name}`;

    const difficultyElem = document.getElementById('difficulty');
    difficultyElem.textContent = `Difficulty: ${userInfo.difficulty}`;
});


resetSeriesButton.addEventListener('click', () => {

    window.location.replace('../index.html');
});



function resetGameBoardDOM() {
    for (let i = 0; i < 9; i++) {
        const location = cellName(i);
        const locationDOM = document.getElementById(location);
        const hasChild = document.getElementById(location).childElementCount;
        if (hasChild === 1) {
            locationDOM.removeChild(locationDOM.firstChild);
        }
    }
}
