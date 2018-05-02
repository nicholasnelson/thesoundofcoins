const apiPath = "/api/**/sales/log";
const refreshTime = 15000;
const coinCount = 100;

var timer = {};

var firstRun = true;
var running = false;
var celebrating = false;
var prevSaleCount = 0;

var apiUrl = "";
var apiToken = "";

const audio = new Audio('./alert.mp3');

// function to generate coins
function startCelebration() {
  for( i = 1 ; i < coinCount; i++) {
    var dropLeft = randRange(0,$( window ).width());
    var dropTop = randRange(-20000,0);

    $('#thedogepen').append('<div class="dropcoin" id="dropcoin'+i+'"></div>');
    $('#dropcoin'+i).css('left',dropLeft);
    $('#dropcoin'+i).css('top',dropTop);
  }
  $('html').each(function(index) {
    $( this ).addClass('celebrate-bg');
  });
}

function stopCelebration() {
  $('#thedogepen').empty();
  $('.celebrate-bg').removeClass('celebrate-bg');
}

function handleUpdate(data) {
  console.log("Received update, processing...");
  const newSaleCount = data.length;
  if(firstRun) {
    firstRun = false;
    prevSaleCount = newSaleCount;
  }
  if(newSaleCount > prevSaleCount) {
    console.log("Celebrate! We made a sale! Many doges are with us!");
    startCelebration();
    audio.play();
    audio.onended = stopCelebration;
  }

}

function requestUpdate() {
  console.log("Requesting update from api...");
  $.ajax({
    crossOrigin: true,
    url: `${apiUrl}${apiPath}?token=${apiToken}`,
    type: "GET",
    success: handleUpdate
  });
}

function updateToggleStartButton(running) {
  if(running) {
    $("#toggle-start").text("Stop").removeClass("btn-success").addClass("btn-danger");
  } else {
    $("#toggle-start").text("Start").removeClass("btn-danger").addClass("btn-success");
  }
}

function toggleStart() {
  running = !running;
  console.log(`Running: ${running}`)
  if (running) {
    apiUrl = $("#pt-url").val();
    apiToken = $("#pt-api-token").val();
    $("#pt-url").attr("disabled", "disabled");
    $("#pt-api-token").attr("disabled", "disabled");
    timer = setInterval(requestUpdate, refreshTime);
  } else {
    apiUrl = $("#pt-url").removeAttr("disabled")
    apiToken = $("#pt-api-token").removeAttr("disabled")
    clearInterval(timer);
  }
  updateToggleStartButton(running);
}

// function to generate a random number range.
function randRange( minNum, maxNum) {
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

// Run once to setup button
updateToggleStartButton();
// Setup button trigger
$("#toggle-start").on("click", toggleStart);