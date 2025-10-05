import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'ai-ticket-assistant', 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const logFile = path.join(logsDir, 'backend.log');

function writeLog(level, msg) {
  const timestamp = new Date().toISOString();
  const line = `${timestamp} [${level.toUpperCase()}] ${msg}\n`;
  fs.appendFileSync(logFile, line);
}

export default {
  info: (msg) => {
    console.log(msg);
    writeLog('info', msg);
  },
  error: (msg) => {
    console.error(msg);
    writeLog('error', msg);
  },
  warn: (msg) => {
    console.warn(msg);
    writeLog('warn', msg);
  },
};
