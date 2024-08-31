const fs = require('fs');
function logToFile(message) {
  const logStream = fs.createWriteStream('logs.txt', { flags: 'a' });
  logStream.write(`${message}\n`);
  logStream.end();
}
const logger = {
  error: (message) => logToFile(`${message}`),
};

module.exports = logger;