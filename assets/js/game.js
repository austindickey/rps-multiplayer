var player1choice
var player2choice
var player1wins = 0
var player1losses = 0
var player2wins = 0
var player2losses = 0
var ties = 0

// insert firebase

function gameStart() {
    $(".choices").on("click", function () {
        player1choice = "rock" // insert database value for player 1
        player2choice = "scissors" // insert database value for player 2

        if ((player1choice === "rock" && player2choice === "scissors") || (player1choice === "paper" && player2choice === "rock") || (player1choice === "scissors" && player2choice === "paper")) {
            player1wins++
            player2losses++
            $("#player1wins").text(player1wins)
            $("#player2losses").text(player2losses)
        } else if (player1choice === player2choice) {
            ties++
            $(".ties").text(ties)
        } else {
            player1losses++
            player2wins++
            $("#player1losses").text(player1losses)
            $("#player2wins").text(player2wins)
        }
    })
}

gameStart()