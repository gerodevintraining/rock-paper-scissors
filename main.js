const MOVES = ["Rock", "Paper", "Scissors"];
let playerWins = 0
let computerWins = 0

function getComputerChoice() {
    return MOVES[Math.floor((Math.random() * 3))]
}

function getPlayerChoice() {
    let playerChoice = prompt("What will be your move? Rock, paper, or scissors?");
    playerChoice = checkPlayerChoice(playerChoice);

    while (playerChoice !== "Rock" && playerChoice !== "Paper" && playerChoice !== "Scissors") {
        playerChoice = prompt("Your move must be rock, paper, or scissors!")
        playerChoice = checkPlayerChoice(playerChoice)
    }

    return playerChoice
}

function checkPlayerChoice(playerChoice) {
    if (playerChoice !== undefined && playerChoice !== null) {
        playerChoice = playerChoice.toLowerCase();
        playerChoice = playerChoice.replace(playerChoice.charAt(0), playerChoice.charAt(0).toUpperCase());
    }

    return playerChoice
}

function playRound(getPlayerChoice, getComputerChoice) {
    let playerChoice = getPlayerChoice();
    let computerChoice = getComputerChoice();
    let roundResult
    console.log(playerChoice)
    console.log(computerChoice)

    if (playerChoice === computerChoice) {
        roundResult = "It's a tie."
        console.log(roundResult)
        return roundResult
    } 

    if (playerChoice === "Rock" && computerChoice == "Scissors") {
        playerWins++
        roundResult = "You win! Rock beats scissors."
    } else if (playerChoice === "Paper" && computerChoice == "Rock") {
        playerWins++
        roundResult = "You win! Paper beats rock."
    } else if (playerChoice === "Scissors" && computerChoice == "Paper") {
        playerWins++
        roundResult = "You win! Scissors beats paper."
    }

    if (computerChoice === "Rock" && playerChoice == "Scissors") {
        computerWins++
        roundResult = "You lose! Rock beats scissors."
    } else if (computerChoice === "Paper" && playerChoice == "Rock") {
        computerWins++
        roundResult = "You lose! Paper beats rock."
    } else if (computerChoice === "Scissors" && playerChoice == "Paper") {
        computerWins++
        roundResult = "You lose! Scissors beats paper."
    }

    console.log(roundResult)
}

function game() {
    let i = 0;

    while (i < 5) {
       let checkTie = playRound(getPlayerChoice, getComputerChoice);

       i += checkTie === "It's a tie." ? 0 : 1;
    }
    
    if (playerWins > computerWins) 
    {
        return "Man has triumphed over machine!"
    }
    else if (playerWins === computerWins) {
        return "This battle has come to a draw. But you only delay the inevitable..."
    }
    else {
        return "The fall of man is upon us. The age of the machine is nigh..."
    }
}

console.log(game())