const fork = require('child_process').fork;
const execSync = require('child_process').execSync;

function Runner(samplePath, params, ws) {
    this.samplePath = samplePath;
    this.ws = ws;
    this.params = params;
}

Runner.prototype.run = function () {
    this.ws.send(execSync('npm install'));
    this.ps = fork(this.samplePath, this.params, {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
    this.ws.on('message', function (message) {
        console.log('receive ' + message);
        this.ps.stdin.write(message + '\n');
    }.bind(this));

    this.ps.stdout.on('data', function (data) {
        console.log(data.toString().trim());
        this.ws.send(data.toString().trim());
    }.bind(this));

    this.ps.stderr.on('data', function (data) {
        console.log('ERROR: ' + data.toString().trim());
        this.ws.send('ERROR: ' + data.toString().trim());
    }.bind(this));
}

Runner.prototype.dispose = function () {
    this.ps.kill('SIGINT');
}

module.exports = Runner;