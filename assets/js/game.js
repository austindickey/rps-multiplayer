var player1choice = ""
var player2choice = ""
var player1wins = 0
var player1losses = 0
var player2wins = 0
var player2losses = 0
var ties = 0
var storageIndex = 0

// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyB71IwuzlxbMFR4AX3GAiUfj4UKH8_68Ew",
    authDomain: "rockpaperscissors-1994.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-1994.firebaseio.com",
    projectId: "rockpaperscissors-1994",
    storageBucket: "rockpaperscissors-1994.appspot.com",
    messagingSenderId: "275531079845",
    appId: "1:275531079845:web:fec3b13657fff4c065ed4c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
var database = firebase.database()

function gameStart() {
    $(".choices").on("click", function () {

        if (storageIndex === 0) {
            database.ref("player1").set({
                player1choice: $(this).data("value")
            });
            storageIndex++
        } else {
            database.ref("player2").set({
                player2choice: $(this).data("value")
            });
            storageIndex = 0
        }

        database.ref("player1").on("value", function(snapshot) {
            player1choice = snapshot.val().player1choice
        })

        database.ref("player2").on("value", function(snapshot) {
            player2choice = snapshot.val().player2choice
        })

        if ((player1choice === "rock" && player2choice === "scissors") || (player1choice === "paper" && player2choice === "rock") || (player1choice === "scissors" && player2choice === "paper")) {
            player1wins++
            player2losses++
            $("#player1wins").text(player1wins)
            $("#player2losses").text(player2losses)

            database.ref("player1").set({
                player1choice: ""
            })

            database.ref("player2").set({
                player2choice: ""
            })

        } else if (player1choice === player2choice) {
            ties++
            $(".ties").text(ties)

            database.ref("player1").set({
                player1choice: ""
            })

            database.ref("player2").set({
                player2choice: ""
            })

        } else if (player1choice === "" || player2choice === ""){

        } else {
            player1losses++
            player2wins++
            $("#player1losses").text(player1losses)
            $("#player2wins").text(player2wins)

            database.ref("player1").set({
                player1choice: ""
            })

            database.ref("player2").set({
                player2choice: ""
            })
        }
    })
}

function addChat() {
    $("#submitButton").on("click", function(){
        // store $("#chatInput").val() into databse under correct user and display it on the page
    })
}

gameStart()