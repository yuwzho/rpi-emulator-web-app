$(document).ready(function () {
  var ws;
  function runSample() {
    if (ws) {
      ws.close();
    }
    // clear the console field
    $('#output').empty();

    // post the connection string and code body
    $.ajax({
      type: 'POST',
      url: '/api/setup',
      data: JSON.stringify({
        connstr: $('#connstr').val()
      }),
      contentType: 'application/json',
      success: function (data) {
        var obj = JSON.parse(data);
        // connect a WebSocket with the guid
        var sss = (window.location.protocol.indexOf('s') > 0 ? 's' : '');
        ws = new WebSocket('ws' + sss + '://' + location.host + '?uid=' + obj.uid);
        ws.onopen = function () {
          console.log('Successfully connect WebSocket');
        }
        ws.onmessage = function (message) {
          console.log('receive message' + JSON.stringify(message.data));
          $("#output").append(message.data.replace(/\n/g, '<br/>') + '<br/>');
        }
      }
    });
  }

  $('#run').click(runSample);
});
