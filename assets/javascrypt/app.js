// Initialize Firebase
var config = {
    apiKey: "AIzaSyBCv-ZeWslqcLDiZlzLIU_ppYbFH6nMeug",
    authDomain: "train-schedule-a6a67.firebaseapp.com",
    databaseURL: "https://train-schedule-a6a67.firebaseio.com",
    projectId: "train-schedule-a6a67",
    storageBucket: "",
    messagingSenderId: "932346733823"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

// Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainTime = moment($("#time-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
    var trainFreq = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        dest: trainDest,
        time: trainTime,
        freq: trainFreq
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var trainTime = childSnapshot.val().time;
    var trainFreq = childSnapshot.val().freq;

    // Train arrival Math
        // freq min - current min = difference
        // difference % freq min = remainder
        // freq min - remiander = minutes away
        // min away + current time = arrival time

    // Difference between the times
    var diffTime = moment().diff(moment.unix(trainTime), "minutes");

    // Time apart
    var tRemainder = diffTime % trainFreq;

    // Minute Until Train
    var minutesAway = trainFreq - tRemainder;

    // Next Train
    var trainArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

    // Add each train data to the table
    $("#train-data").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + 
    "</td><td>" + trainArrival + "</td><td>" + minutesAway + "</td></tr>");});