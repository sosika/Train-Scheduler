
//-------------------------------------------------------------
//  Next train calculation  
//-------------------------------------------------------------
// 
// nextTrain(traintime,now)

// function nextTrain(beginTime,currentTime) {
//   var a = getHours(beginTime);
//   var b = getHours(currentTime);
//   console.log(a, b);

  // if ( a > b ) {
  //   // Calculate nextTrain time
  //   // Calculate mins till
  //   // return nextTrain time
  //   // return mins till value
  // } else {
  //   // c = a + duration
  //   // b = getHours(c)
  
// }


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

    // Net arrival time
    var tFrequency = snapshot.val().freqInput;

    // Time is 3:30 AM
    var firstTime = snapshot.val().timeInput;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

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