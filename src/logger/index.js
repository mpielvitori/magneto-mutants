import path from 'path';
import packageInfo from '../../package.json';
import {
    createLogger as createWinstonLogger,
    transports,
    format,
  } from 'winston';

const {combine, timestamp, label, printf} = format;
const PROJECT_DIR = path.resolve(__dirname, '..');

const customFormat = printf((info) => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

/**
 * Create custom logger
 * @param {string} fileName
 * @return {object}
*/
export function createLogger(fileName) {
    const prefix = createPrefix(fileName);
    return createWinstonLogger({
        format: combine(
            label({label: prefix}),
            timestamp(),
            customFormat,
        ),
        transports: [new transports.Console()],
    });
}

/**
 * Create logger prefix
 * @param {string} fileName
 * @return {string}
*/
function createPrefix(fileName) {
    let prefix = packageInfo.name;
    let pathDesc = path.relative(PROJECT_DIR, fileName)
        .replace('/', '.')
        .replace(/(?:index)?\.js$/, '');
    prefix += `:${pathDesc}`;

    return prefix;
}
