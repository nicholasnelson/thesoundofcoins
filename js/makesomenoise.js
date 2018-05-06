const apiPath = "/api/**/sales/log";
const refreshTime = 15000;
const coinCount = 100;

var timer = {};

var firstRun = true;
var running = false;
var testing = false;
var celebrating = false;
var prevSaleCount = 0;

var apiUrl = "";
var apiToken = "";

const audio = new Audio('./sound/alert.mp3');

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
  audio.play();
  audio.onended = stopCelebration;
}

function stopCelebration() {
  // Remove falling coins
  $('#thedogepen').empty();
  // Remove celebration background
  $('.celebrate-bg').removeClass('celebrate-bg');
  // Reset testing
  $("#toggle-test").text("Test").removeClass("btn-danger").addClass("btn-success");
  testing = false;
  // Stop music (if it's still running)
  audio.pause();
  audio.currentTime = 0;
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
  }
  prevSaleCount = newSaleCount;
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

function toggleStart() {
  running = !running;
  if (running) {
    apiUrl = $("#pt-url").val();
    apiToken = $("#pt-api-token").val();
    // Disable buttons and input
    $("#pt-url, #pt-api-token, #pt-api-token, #toggle-test").attr("disabled", "disabled");
    timer = setInterval(requestUpdate, refreshTime);
    $("#toggle-start").text("Stop").removeClass("btn-success").addClass("btn-danger");
  } else {
    apiUrl = $("#pt-url").removeAttr("disabled")
    apiToken = $("#pt-api-token").removeAttr("disabled")
    $("#toggle-test").removeAttr("disabled");
    clearInterval(timer);
    $("#toggle-start").text("Start").removeClass("btn-danger").addClass("btn-success");
  }
}

function toggleTest() {
  testing = !testing;
  if(testing) {
    console.log(`Starting celebration test.`);
    startCelebration()
    $("#toggle-test").text("Stop Test").removeClass("btn-success").addClass("btn-danger");
  } else {
    stopCelebration();
    $("#toggle-test").text("Test").removeClass("btn-danger").addClass("btn-success");
  }
}

// function to generate a random number range.
function randRange( minNum, maxNum) {
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

// Setup button trigger
$("#toggle-start").on("click", toggleStart);
$("#toggle-test").on("click", toggleTest);