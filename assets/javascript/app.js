
//-------------------------------------------------------------
//  Firebase setup and init
//-------------------------------------------------------------
var config = {
    apiKey: "AIzaSyC7-VZepxXPbFfgFkQtaD7PVo2PZjbUFa8",
    authDomain: "train-scheduler-f5d24.firebaseapp.com",
    databaseURL: "https://train-scheduler-f5d24.firebaseio.com",
    projectId: "train-scheduler-f5d24",
    storageBucket: "",
    messagingSenderId: "41867659619"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

//-------------------------------------------------------------
//  Click submit
//-------------------------------------------------------------

  $(".btn").on("click",function(){

  	var nameInput = $("#name-input").val().trim();
  	var destInput = $("#dest-input").val().trim();
  	var timeInput = $("#time-input").val().trim();
    var freqInput = $("#freq-input").val().trim();

  	database.ref().push({
  		nameInput: nameInput,
  		destInput: destInput,
  		timeInput: timeInput,
  		freqInput: freqInput,
  		dateAdded: firebase.database.ServerValue.TIMESTAMP
  	})
  	
  });

//-------------------------------------------------------------
//  Click event
//-------------------------------------------------------------

  database.ref().on("child_added", function(snapshot) {

//-------------------------------------------------------------
//  Calculate next train and minute till
//-------------------------------------------------------------

    // Frequency
    var tFrequency = snapshot.val().freqInput;

    // First train of a day
    var firstTime = snapshot.val().timeInput;

    // First Time 
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    var nextTrainFormatted = moment(nextTrain).format("hh:mm");

//-------------------------------------------------------------
//  Construct table insert
//-------------------------------------------------------------

    var tBody = $("tbody");
    var tRow = $("<tr>");
    var nameTd = $("<td>").text(snapshot.val().nameInput);
    var destTd = $("<td>").text(snapshot.val().destInput);
    var freqTd = $("<td>").text(snapshot.val().freqInput);
    var nextTrainTd = $("<td>").text(nextTrainFormatted);
    var tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain);

    tRow.append(nameTd, destTd, freqTd, nextTrainTd, tMinutesTillTrainTd);
    tBody.append(tRow);

    }, function (errorObject) {
  	console.log("The read failed : " + errorObject.code);
  });