$(document).ready(function () {
    $("#output").append('hihihi<br/>');  
  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    $("#output").append(message + '<br/>');
  }
});
