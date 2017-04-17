$(document).ready(function () {
    $("#output").append('hihihi<br/>');  
  var ws = new WebSocket('ws://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + JSON.stringify(message.data));
    $("#output").append(message.data.replace(/\n/g, '<br/>') + '<br/>');
  }
});
