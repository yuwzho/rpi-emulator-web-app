const fork = require('child_process').fork;
const execSync = require('child_process').execSync;

function Runner(params, ws) {
    this.ws = ws;
    this.params = params;
}

Runner.prototype.run = function() {
    params = this.params;
    ws = this.ws;
    process.chdir('sample');

    execSync('npm install');
    ps = fork('main.js', params, {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });
    ws.on('message', (message) => {
        console.log('receive ' + message);
        ps.stdin.write(message + '\n');
    });

    ps.stdout.on('data', (data) => {
        console.log('MESSAGE: ' + data.toString());
        ws.send('MESSAGE: ' + data.toString());
    });

    ps.stderr.on('data', (data) => {
        console.log('ERROR: ' + data.toString());
        ws.send('ERROR: ' + data.toString());
    });
    this.ps = ps;
}

Runner.prototype.dispose = function() {
    this.ps.kill('SIGINT');
}

module.exports = Runner;