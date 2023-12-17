const MOVES = ["rock", "paper", "scissors"];

const gameDialogueBox = document.querySelector(".dialogue-box")
const dialogueBoxContent = document.querySelector(".dialogue-box p")
const messageContainer = document.querySelector(".game-message-container");
const gameMessage = document.querySelector(".game-message");
const gameExplain = document.querySelector(".game-explanation");
const defaultMessage = "Make your move!";
const defaultExplain = "Decide the fate of humanity";
const playerLife = document.querySelector(".player-life");
const bossLife = document.querySelector(".boss-life");
const bossAttack = document.querySelectorAll(".boss-attack");
const moveButtonsContainer = document.querySelector(".move-buttons-container");
const moveButtons = document.querySelectorAll(".move-button");
const restartButton = document.querySelector(".restart");
playerLife.style.width = '100%';
bossLife.style.width = '100%';

const finalBossDialogue = {
    opener: "I already ran all possible simulations. You have no possibility of winning.",
    defeat: "My calculations cannot be incorrect! My defeat cannot be possible!",
    win: "As per my calculations, this was the only possible outcome."
}

const eventDialogue = {
    critical: "Critical hit!",
    doubleDmg: "You did double damage",
    receivedDblDmg: "You received double damage",
    lucky: "Lucky!",
    recovery: "You recovered 10% of your life."
}

function getComputerChoice() {
    return MOVES[Math.floor((Math.random() * 3))];
}

function showBossAttack(computerChoice = null) {
    if (bossLife.style.width === "0%" || playerLife.style.width === "0%") {
        bossAttack.forEach(attack => attack.classList.add("hide"));
        return;
    }
    if (computerChoice === null) {
        bossAttack.forEach(attack => {
            if (!attack.classList.contains("hide")) {
                attack.classList.toggle("hide");
            }
        })
    } else {
        bossAttack.forEach(attack => {
            if (attack.textContent.toLowerCase() === computerChoice) {
                attack.classList.toggle("hide");
            }
        })
    }
}

function playRound(playerChoice, getComputerChoice) {
    let computerChoice = getComputerChoice();
    showBossAttack(computerChoice)
    checkWinner(playerChoice, computerChoice);
}

function checkWinner(firstPlayerChoice, secondPlayerChoice) {
    if (firstPlayerChoice === secondPlayerChoice) {
        gameMessage.textContent = "It's a tie.";
        gameExplain.textContent = "Will you win the next round?"
        setMessageDefault()
        return;
    } 
    for (let i = 0; i < 2; i++) {
        if (i === 1) [firstPlayerChoice, secondPlayerChoice] = [secondPlayerChoice, firstPlayerChoice];
        if (firstPlayerChoice === "rock" && secondPlayerChoice == "scissors") {
            gameMessage.textContent = `You ${i === 0 ? 'win' : 'lose'}!`;
            gameExplain.textContent = "Rock beats scissors."
            i === 0 ? setBossLife(bossLife) : setPlayerLife(playerLife);
        } else if (firstPlayerChoice === "paper" && secondPlayerChoice == "rock") {
            gameMessage.textContent = `You ${i === 0 ? 'win' : 'lose'}! `;
            gameExplain.textContent = "Paper beats rock."
            i === 0 ? setBossLife(bossLife) : setPlayerLife(playerLife);
        } else if (firstPlayerChoice === "scissors" && secondPlayerChoice == "paper") {
            gameMessage.textContent = `You ${i === 0 ? 'win' : 'lose'}!`;
            gameExplain.textContent = "Scissors beats paper."
            i === 0 ? setBossLife(bossLife) : setPlayerLife(playerLife);
        }
    }
}

function checkCritical() {
    // Check for chance to do double damage!
    if (Math.ceil(Math.random() * 100) <= 10) {
        return 20;
    } else {
        return 10;
    }
}

function checkLucky() {
    // Check for chance to receive life points!
    if (Math.ceil(Math.random() * 100) <= 10) {
        return 10;
    } else {
        return 0;
    }
}

function setPlayerLife(player) {
    const currentWidth = Number(player.style.getPropertyValue("width").replace(/[^0-9]/,''));
    const attackPower = checkCritical();
    player.style.width = `${currentWidth - attackPower}%`;
    player.style.width <= '30%' ? player.style.backgroundColor = 'red' : player.style.backgroundColor = 'white';
    if (attackPower === 20) {
        setTimeout(() => {
            setEventMessage(eventDialogue["critical"], eventDialogue["receivedDblDmg"])
            setMessageDefault(2000);
        }, 1000);
    } else {
        setMessageDefault()
    }
}

function setBossLife (boss) {
    const currentBossLife = Number(boss.style.getPropertyValue("width").replace(/[^0-9]/,''));
    const currentPlayerLife = Number(playerLife.style.getPropertyValue("width").replace(/[^0-9]/,''));
    const attackPower = checkCritical();
    const luckyLife = checkLucky();
    boss.style.width = `${currentBossLife - attackPower}%`;
    boss.style.width <= '30%' ? boss.style.backgroundColor = 'red' : boss.style.backgroundColor = 'white';
    if (attackPower === 20 || luckyLife === 10) {
        if (attackPower === 20) {
            setTimeout(() => {
                setEventMessage(eventDialogue["critical"], eventDialogue["doubleDmg"])
                if (luckyLife !== 10) setMessageDefault(2000);
            }, 1000);
        }
        if (luckyLife === 10 && currentPlayerLife !== 100) {
            setTimeout(() => {
                playerLife.style.width = `${currentPlayerLife + luckyLife}%`;
                setEventMessage(eventDialogue["lucky"], eventDialogue["recovery"])
                setMessageDefault(2000);
            }, 1000);
        }
    } else {
        setMessageDefault()
    }
}

function handlePlayerMove(e) {
    let playerChoice = e.target.value;
    e.target.classList.add("player-choice");
    showAsDisabled()
    toggleButtons();
    playRound(playerChoice, getComputerChoice);
    if (playerLife.style.width === '0%') {
        setBossDialogue(finalBossDialogue['win']);
        switchButtons();
        resetGame();
    } else if (bossLife.style.width === '0%') {
        setBossDialogue(finalBossDialogue['defeat']);
        switchButtons();
        resetGame();
    }
}

function fightFinalBoss() {
    setBossDialogue(finalBossDialogue['opener'], finalBossDialogue['opener2']);
    moveButtons.forEach(button => {
        button.addEventListener('click', handlePlayerMove);
    });
}

function setBossDialogue(dialogue) {
    showBossAttack();
    toggleButtons();
    showAsDisabled();
    restartButton.disabled = true;
    messageContainer.classList.add("hide");
    gameDialogueBox.classList.remove("hide");
    dialogueBoxContent.textContent = dialogue;
    setTimeout(() => {
        messageContainer.classList.remove("hide");
        gameDialogueBox.classList.add("hide");
        moveButtons.forEach(button => {
            if (button.classList.contains("not-player-choice")) {
                button.classList.remove("not-player-choice");
            }
        })
        if (endGame() !== true) toggleButtons();
        restartButton.disabled = false;
    }, 5000)
}

function setEventMessage(message, subMessage) {
    gameMessage.textContent = message;
    gameExplain.textContent = subMessage;
}

function setMessageDefault(millisecs = 1000) {
    setTimeout(() => {
        toggleButtons()
        moveButtons.forEach(button => {
            if (button.classList.contains("player-choice")) {
                button.classList.remove("player-choice")
            } else if (button.classList.contains("not-player-choice")) {
                button.classList.remove("not-player-choice")
            }
        })
        showBossAttack();
        gameMessage.textContent = defaultMessage;
        gameExplain.textContent = defaultExplain;
    }, millisecs)
}

function endGame() {

    if (playerLife.style.width === '0%' || bossLife.style.width === '0%') {
        if (bossLife.style.width === '0%') {
            gameMessage.textContent = "You win!"
            gameExplain.textContent = "Man has triumphed over machine!";
            return true;
        }
        /* else if (playerScore === computerScore) {
            gameMessage.textContent = "It's a tie!"
            gameExplain.textContent = "This battle has come to a draw. But you only delay the inevitable..."; 
        }*/
        else if (playerLife.style.width === '0%') {
            gameMessage.textContent = "You lose!"
            gameExplain.textContent = "Humanity ends. The age of the machine begins...";
            return true;
        }
    }
}

function toggleButtons() {
    moveButtons.forEach((button) => button.disabled === false ? button.disabled = true : button.disabled = false);
}

function showAsDisabled() {
    moveButtons.forEach(button => {
        if (!button.classList.contains("player-choice")) {
            button.classList.add("not-player-choice");
        }
    })
}

function switchButtons() {
    moveButtonsContainer.classList.toggle("hide");
    restartButton.classList.toggle("hide");
}

function handleResetGame() {
    playerLife.style.width = '100%';
    bossLife.style.width = '100%';
    playerLife.style.backgroundColor = 'white';
    bossLife.style.backgroundColor = 'white';
    gameMessage.textContent = defaultMessage;
    gameExplain.textContent = defaultExplain;
    moveButtons.forEach((button) => {
        button.disabled = false
    })
    switchButtons();
    fightFinalBoss();
}
    
function resetGame() {
    restartButton.addEventListener("click", handleResetGame)
}

fightFinalBoss()