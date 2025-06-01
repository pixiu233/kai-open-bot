const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class Logger {
    constructor() {
        this.logPath = app ? path.join(app.getPath('userData'), 'logs') : path.join(__dirname, '../../logs');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath, { recursive: true });
        }
    }

    getLogFile() {
        const date = new Date().toISOString().split('T')[0];
        return path.join(this.logPath, `${date}.log`);
    }

    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message}\n`;
    }

    log(level, message) {
        const formattedMessage = this.formatMessage(level, message);
        fs.appendFileSync(this.getLogFile(), formattedMessage, 'utf8');
        
        // 同时输出到控制台
        switch (level) {
            case 'ERROR':
                console.error(message);
                break;
            case 'WARN':
                console.warn(message);
                break;
            default:
                console.log(message);
        }
    }

    info(message) {
        this.log('INFO', message);
    }

    warn(message) {
        this.log('WARN', message);
    }

    error(message) {
        this.log('ERROR', message);
    }
}

module.exports = new Logger(); 