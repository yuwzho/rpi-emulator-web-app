const fs = require('fs');
const path = require('path');

const Client = require('azure-iot-device').Client;
const ConnectionString = require('azure-iot-device').ConnectionString;
const Message = require('azure-iot-device').Message;
const Protocol = require('azure-iot-device-mqtt').Mqtt;

var messageId = 0;
var client;
function sendMessage() {
  messageId++;
  var content = '{"messageId":' + messageId  + '}';
    var message = new Message(content);
    console.log('Sending message: ' + content);
    client.sendEvent(message, (err) => {
      if (err) {
        console.error('Failed to send message to Azure IoT Hub');
      } else {
        blinkLED();
        console.log('Message sent to Azure IoT Hub');
      }
  });
}

function blinkLED() {
  console.log('blink');
}

(function (connectionString) {
  client = Client.fromConnectionString(connectionString, Protocol);

  client.open((err) => {
    if (err) {
      console.error('[IoT hub Client] Connect error: ' + err.message);
      return;
    }
    setInterval(sendMessage, 2000);
  });
})(process.argv[2]);