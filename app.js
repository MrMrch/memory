const cardBackDeck = []

cardBackOptions.forEach((cardName) => {
    const card = {
        name: cardName,
        img: `images/${cardName}.png`,
    }

    cardBackDeck.push(card);
});

console.log('print cardBackDeck:')
console.log(cardBackDeck)


const gridDisplay = document.querySelector('#grid')
const resultDisplay = document.querySelector('#result')
let cardsChosen = []
let cardsChosenIds = []
let cardsWon = []
let handicap = 0
let difficulty = 12
let currentDeck = []

let AllPairsOfCards = []

/* var storedSelectedCardBackIndex = 0
 *//* let selectedback = 0
 */
 function loadSelectedCardBack() {
    let storedSelectedCardBackIndex = localStorage.getItem("selectedCardBackIndex");
    if (storedSelectedCardBackIndex) {
        storedSelectedCardBackIndex = parseInt(storedSelectedCardBackIndex);
    } else {
        storedSelectedCardBackIndex = 0; // Set to 0 when there is no value in local storage
    }
    const cardBackIndex = storedSelectedCardBackIndex ? parseInt(storedSelectedCardBackIndex) : 0;
    const cardBackName = cardBackOptions[cardBackIndex];

    // Apply the card back to each card's cardback element
    const cardBackElements = document.querySelectorAll(".card .cardback");
    cardBackElements.forEach((cardBackElement) => {
        cardBackElement.setAttribute("src", `images/${cardBackName}.png`);
    });
    return storedSelectedCardBackIndex;
}


function getQueryParam(name) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(name);
}


function changecardback() {
    console.log("launching the function:");
    console.log(storedSelectedCardBackIndex);
    gridDisplay.innerHTML = "";
    storedSelectedCardBackIndex += 1;
    if (storedSelectedCardBackIndex >= cardBackDeck.length) {
        console.log("inside if statement:");
        console.log(storedSelectedCardBackIndex);

        storedSelectedCardBackIndex = 0;
    }

    // Update the local storage with the new selected card back index
    localStorage.setItem("selectedCardBackIndex", storedSelectedCardBackIndex);

    console.log("after function:");
    console.log(storedSelectedCardBackIndex);
    createBoard(difficulty, storedSelectedCardBackIndex);
    console.log("after createboard:");
    console.log(storedSelectedCardBackIndex);
}

function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    } 
}

function createUniqueDeck(uniqueCards){
    shuffleArray(uniqueCards)
    uniqueCards.forEach((cardName) => {
        const card = {
            name: cardName,
            img: `images/${cardName}.png`,
            flipped: false
        }
    
        AllPairsOfCards.push(card);
        AllPairsOfCards.push({ ...card }); // Create a copy of the card
          
    })    
}

function resetGameState(){
    cardsChosen = []
    cardsChosenIds = []
    cardsWon = []
    handicap = 0
    optionOneId = ''
    optionTwoId = ''
    resultDisplay.innerHTML = ''
    currentDeck = []
    AllPairsOfCards = []
}
/* 
console.log('cutting to difficulty level:')
console.log(AllPairsOfCards.slice(0, difficulty))
 */

/* function setGridSize(difficulty) {
    const gridDisplay = document.querySelector("#grid");
    const numCards = difficulty * 2;
    const numRows = Math.ceil(Math.sqrt(numCards));
    const numCols = Math.ceil(numCards / numRows);
    gridDisplay.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;
    gridDisplay.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
  } */

function getOptimalGridSize(totalCards) {
    let numRows = 1;
    let numCols = totalCards;
    let minDifference = totalCards;
  
    for (let i = 1; i <= Math.sqrt(totalCards); i++) {
      if (totalCards % i === 0) {
        let potentialCols = totalCards / i;
        let difference = Math.abs(potentialCols - i);
  
        if (difference < minDifference) {
          minDifference = difference;
          numRows = i;
          numCols = potentialCols;
        }
      }
    }
  
    return { numRows, numCols };
  }
    
  
    

  function createBoard(difficulty, storedSelectedCardBackIndex) {
    createUniqueDeck(uniqueCards);
    currentDeck = AllPairsOfCards.slice(0, difficulty);
    shuffleArray(currentDeck);

    const { numRows, numCols } = getOptimalGridSize(difficulty);

    gridDisplay.style.gridTemplateRows = `repeat(${numRows}, 200px)`;
    gridDisplay.style.gridTemplateColumns = `repeat(${numCols}, 200px)`;

    let cardIndex = 0;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (cardIndex < currentDeck.length) {
                const cardContainer = document.createElement("div");
                cardContainer.classList.add("card-container");

                const card = document.createElement("div");
                card.setAttribute("data-id", cardIndex);
                card.classList.add("card");
                card.addEventListener("click", flipCard);
                card.dataset.row = i;
                card.dataset.col = j;

                const cardBack = document.createElement("img");
                cardBack.setAttribute("src", cardBackDeck[storedSelectedCardBackIndex].img);
                cardBack.classList.add("cardback");

                const cardFront = document.createElement("img");
                cardFront.setAttribute("src", currentDeck[cardIndex].img);
                cardFront.classList.add("cardfront");

                card.appendChild(cardBack);
                card.appendChild(cardFront);
                cardContainer.appendChild(card);
                gridDisplay.appendChild(cardContainer);

                cardIndex++;
            }
        }
    }
}


function checkMatch() {
    const cards = document.querySelectorAll(".card");
    let optionOneId = cardsChosenIds[0];
    let optionTwoId = cardsChosenIds[1];

    if (optionOneId == optionTwoId) {
        cards[optionOneId].classList.toggle("flipped");
        cards[optionTwoId].classList.toggle("flipped");
        currentDeck[optionOneId].flipped = false;
        currentDeck[optionTwoId].flipped = false;
        customAlert("You have clicked the same image!");
    } else if (cardsChosen[0] == cardsChosen[1]) {
        customAlert("You found a match!");
        cards[optionOneId].classList.add("matched");
        cards[optionTwoId].classList.add("matched");
        cards[optionOneId].removeEventListener("click", flipCard);
        cards[optionTwoId].removeEventListener("click", flipCard);
        cardsWon.push(cardsChosen);
    } else {
        cards[optionOneId].classList.toggle("flipped");
        cards[optionTwoId].classList.toggle("flipped");
        currentDeck[optionOneId].flipped = false;
        currentDeck[optionTwoId].flipped = false;

        handicap -= 0.25;

        resultDisplay.innerHTML = cardsWon.length + handicap;
        if (cardsWon.length + handicap < -1) {
            showGameOverScreen("You lose!");
        }

        customAlert("sorry try again!\nScore:" + resultDisplay.textContent);
    }
    resultDisplay.innerHTML = cardsWon.length + handicap;
    cardsChosen = [];
    cardsChosenIds = [];

    // Check for winning condition after the cards have been matched
// ...
if (cardsWon.length == currentDeck.length / 2) {
    resultDisplay.innerHTML = "Congratulations you found them all";
    showGameOverScreen("You won!", cardsWon.length + handicap);
  } else if (cardsWon.length + handicap < -1) {
    showGameOverScreen("You lose!");
    flipRemainingCards();
  }
  // ...
  }

function flipRemainingCards() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {
        card.classList.add("flipped");
        card.removeEventListener("click", flipCard);
      }
    });
  }

  
function flipCard(){
    const cardId = this.getAttribute('data-id')

    if (currentDeck[cardId].flipped){
        return;
    }

    cardsChosen.push(currentDeck[cardId].name)
    cardsChosenIds.push(cardId)
    console.log(cardsChosen)
    console.log(cardsChosenIds)

    this.classList.toggle('flipped'); // Add this line here
    currentDeck[cardId].flipped = true;

    if (cardsChosen.length === 2) {
        disableAllCards();
        setTimeout(() => {
            checkMatch();
            enableAllCards();
        }, 500);
    }
    

    if (cardsWon.length == currentDeck.length/2) {
        resultDisplay.innerHTML = "Congratulations you found them all";
        showGameOverScreen("You won!");
    }
    
}

function customAlert(msg, duration = 3000) {
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.textContent = msg;
  
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
      alertBox.style.opacity = 1;
    }, 10);
  
    setTimeout(() => {
      alertBox.style.opacity = 0;
      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 300);
    }, duration);
  
    // Make the alert go away by clicking anywhere
    document.addEventListener('click', function removeAlertOnClick() {
      alertBox.style.opacity = 0;
      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 300);
      // Remove the event listener after the alert is closed
      document.removeEventListener('click', removeAlertOnClick);
    });
  }
  
function hideCustomAlert() {
    const customAlert = document.getElementById("custom-alert");
    customAlert.style.display = "none";
}

function disableAllCards() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.removeEventListener("click", flipCard);
    });
}

function enableAllCards() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {
            card.addEventListener("click", flipCard);
        }
    });
}


function showGameOverScreen(message, score) {
    const overlay = document.getElementById("overlay");
    const gameOverMessage = document.getElementById("game-over-message");
    const restartButton = document.getElementById("restart-button");
  
    if (message === "You won!") {
      gameOverMessage.innerHTML = `${message} Score: ${score}!`;
    } else {
      gameOverMessage.innerHTML = message;
    }
  
    overlay.style.display = "block";
  
    restartButton.addEventListener("click", () => {
      overlay.style.display = "none";
      changeDifficulty(difficulty);
    });
  }
  

document.getElementById('easy').addEventListener('click', () => changeDifficulty(12));
document.getElementById('medium').addEventListener('click', () => changeDifficulty(18));
document.getElementById('hard').addEventListener('click', () => changeDifficulty(28));

document.getElementById('change-back').addEventListener('click', () => changecardback(difficulty));
document.querySelector("#select-card-back").addEventListener("click", () => {
    window.location.href = "select-card-back.html";
});


function changeDifficulty(newDifficulty) {
    difficulty = newDifficulty
    gridDisplay.innerHTML = '';
    resetGameState();
    createBoard(difficulty, storedSelectedCardBackIndex);

}

storedSelectedCardBackIndex = loadSelectedCardBack();
const urlCardBackIndex = getQueryParam("cardBackIndex");
if (urlCardBackIndex !== null) {
    storedSelectedCardBackIndex = parseInt(urlCardBackIndex);
}
createBoard(difficulty, storedSelectedCardBackIndex);

/* 
console.log("AllPairsOfCards after for loop:")
console.log(AllPairsOfCards.slice()); */
 
console.log("printing the current data id:")
console.log(storedSelectedCardBackIndex);
