// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyB71IwuzlxbMFR4AX3GAiUfj4UKH8_68Ew",
    authDomain: "rockpaperscissors-1994.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-1994.firebaseio.com",
    projectId: "rockpaperscissors-1994",
    storageBucket: "rockpaperscissors-1994.appspot.com",
    messagingSenderId: "275531079845",
    appId: "1:275531079845:web:fec3b13657fff4c065ed4c"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
var database = firebase.database()

// Database Storage Paths
var chatData = database.ref("/chat")
var playersRef = database.ref("players")
var currentTurnRef = database.ref("turn")

// Initializing Base Variables
var username = "Guest"
var currentPlayers = null
var currentTurn = null
var playerNum = false
var playerOneExists = false
var playerTwoExists = false
var playerOneData = null
var playerTwoData = null

// Create User
$("#start").click(function() {
    if ($("#username").val() !== "") {
        username = $("#username").val()
        joinGame()
    }
})

// Pressing enter works the same as clicking submit button
$("#username").keypress(function(event) {
    if (event.which === 13 && $("#username").val() !== "") {
        username = $("#username").val()
        joinGame()
    }
})

// Join Game Function
function joinGame() {

    var chatDataDisc = database.ref("/chat/" + Date.now())

    if (currentPlayers < 2) {
        if (playerOneExists) {
            playerNum = 2
        } else {
            playerNum = 1
            $("#turn").text("Waiting for another player to join.")
            $("#choiceOptions").hide()
        }
  
        playerRef = database.ref("/players/" + playerNum)
    
        playerRef.set({
            name: username,
            wins: 0,
            losses: 0,
            ties: 0,
            choice: null
        })

        playerRef.onDisconnect().remove()
        currentTurnRef.onDisconnect().remove()
        chatData.onDisconnect().remove()
    
        chatDataDisc.onDisconnect().set({
            name: username,
            time: firebase.database.ServerValue.TIMESTAMP,
            message: " has disconnected.",
            idNum: 0
        })
    
        $("#swap-zone").empty()
    
        $("#swap-zone").append($("<h4>").html("Welcome " + username + "!<br>You are Player " + playerNum))
    } else {
    alert("Sorry, the game is currently full. Please try again later.")
    }
}

// Chat Functionality
$("#submitButton").click(function() {
    if ($("#chatInput").val() !== "") {
        var message = $("#chatInput").val()
  
        chatData.push({
            name: username,
            message: message,
            time: firebase.database.ServerValue.TIMESTAMP,
            idNum: playerNum
        })
    
        $("#chatInput").val("")
    }
})

// Choice Listener
$(".choices").on("click", function() {
    var clickChoice = $(this).data("value")
    playerRef.child("choice").set(clickChoice)
    $("#player" + playerNum + "chosen").text(clickChoice)

    currentTurnRef.transaction(function(turn) {
        return turn + 1
    })
})
  
// Chat updater - ordered by time
chatData.orderByChild("time").on("child_added", function (snapshot) {
    var newP = $("<p>")
    newP.addClass("message")
    newP.text(snapshot.val().name + ": " + snapshot.val().message)
    $("#chatContent").append(newP)
})

// Tracks changes in player objects
playersRef.on("value", function (snapshot) {
    currentPlayers = snapshot.numChildren()

    playerOneExists = snapshot.child("1").exists()
    playerTwoExists = snapshot.child("2").exists()

    playerOneData = snapshot.child("1").val()
    playerTwoData = snapshot.child("2").val()
    
    if (playerOneExists) {
        $("#player1wins").text(playerOneData.wins)
        $("#player1losses").text(playerOneData.losses)
        $("#player1ties").text(playerOneData.ties)
    } else {
        $("#player1wins").text("0")
        $("#player1losses").text("0")
        $("#player1ties").text("0")
    }

    if (playerTwoExists) {
        $("#player2wins").text(playerTwoData.wins)
        $("#player2losses").text(playerTwoData.losses)
        $("#player2ties").text(playerTwoData.ties)
    } else {
        $("#player2wins").text("0")
        $("#player2losses").text("0")
        $("#player2ties").text("0")
    }
})

// Detects changes in current turn key
currentTurnRef.on("value", function (snapshot) {
    currentTurn = snapshot.val()

    if (playerNum) {
        if (currentTurn === 1) {
            if (currentTurn === playerNum) {
                $("#turn").text("It's Your Turn!")
                $("#choiceOptions").show()
            } else {
                $("#turn").text("Waiting for " + playerOneData.name + " to choose.")
                $("#choiceOptions").hide()
            }
        } else if (currentTurn === 2) {
            if (currentTurn === playerNum) {
                $("#turn").text("It's Your Turn!")
                $("#choiceOptions").show()
            } else {
                $("#turn").text("Waiting for " + playerTwoData.name + " to choose.")
                $("#choiceOptions").hide()
            }
        } else if (currentTurn === 3) {
            $("#choiceOptions").hide()
            gameLogic(playerOneData.choice, playerTwoData.choice)

            $("#player1-chosen").text(playerOneData.choice)
            $("#player2-chosen").text(playerTwoData.choice)

            //  reset after timeout
            var moveOn = function () {
                $("#player1-chosen").empty()
                $("#player2-chosen").empty()
                $("#turn").empty()

                if (playerOneExists && playerTwoExists) {
                    currentTurnRef.set(1)
                }
            }

            setTimeout(moveOn, 3000)
        }
    }
})

// If there are 2 players, the game will start
playersRef.on("child_added", function (snapshot) {
    if (currentPlayers === 1) {
        currentTurnRef.set(1)
    }
})

// Determine the outcome
function gameLogic(player1choice, player2choice) {
    var playerOneWon = function () {
        $("#turn").text(playerOneData.name + " Wins!")
        var newWin = playerOneData.wins + 1
            var newLoss = playerTwoData.losses + 1
        if (playerNum === 1) {
            playersRef
                .child("1")
                .child("wins")
                .set(newWin)
            playersRef
                .child("2")
                .child("losses")
                .set(newLoss)
        }
    }

    var playerTwoWon = function () {
        $("#turn").text(playerTwoData.name + " Wins!")
        var newWin = playerTwoData.wins + 1
        var newLoss = playerOneData.losses + 1
        if (playerNum === 2) {
            playersRef
                .child("2")
                .child("wins")
                .set(newWin)
            playersRef
                .child("1")
                .child("losses")
                .set(newLoss)
        }
    }

    var tie = function () {
        $("#turn").text("Tie Game!")
        var play1Tie = playerOneData.ties + 1
        var play2Tie = playerTwoData.ties + 1
        playersRef
            .child("1")
            .child("ties")
            .set(play1Tie)
        playersRef
            .child("2")
            .child("ties")
            .set(play2Tie)
    }

    if (player1choice === "Rock" && player2choice === "Rock") {
        tie()
    } else if (player1choice === "Paper" && player2choice === "Paper") {
        tie()
    } else if (player1choice === "Scissors" && player2choice === "Scissors") {
        tie()
    } else if (player1choice === "Rock" && player2choice === "Paper") {
        playerTwoWon()
    } else if (player1choice === "Rock" && player2choice === "Scissors") {
        playerOneWon()
    } else if (player1choice === "Paper" && player2choice === "Rock") {
        playerOneWon()
    } else if (player1choice === "Paper" && player2choice === "Scissors") {
        playerTwoWon()
    } else if (player1choice === "Scissors" && player2choice === "Rock") {
        playerTwoWon()
    } else if (player1choice === "Scissors" && player2choice === "Paper") {
        playerOneWon()
    }
}