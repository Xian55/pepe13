import { createLogger, format, transports, config } from "winston";
const { combine, timestamp, colorize, printf } = format;

export const logHandler = createLogger({
    levels: config.npm.levels,
    level: "silly",
    transports: [new transports.Console()],
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        colorize(),
        printf(({ level, timestamp, message }) => `${level}: ${[timestamp]}: ${message}`)
    ),
    exitOnError: false,
});