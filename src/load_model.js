const { spawn } = require('child_process');

const pythonProcess = spawn('python', ['load_model.py']);

pythonProcess.stdout.on('data', (data) => {
    console.log(data);
});
pythonProcess.stderr.removeAllListeners('data', (data) => {
    console.log('stderr : ${data}');
});
pythonProcess.on('close', (code) => {
    console.log('child process exited with code' + code);
});