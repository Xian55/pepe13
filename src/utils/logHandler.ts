import { createLogger, format, transports, config } from "winston";
const { combine, timestamp, printf } = format;

export const logHandler = createLogger({
    levels: config.npm.levels,
    level: "silly",
    transports: [new transports.Console()],
    format: combine(
        timestamp({
            format: "HH:mm:ss",
        }),
        printf(({ level, timestamp, message }) => `${level} ${[timestamp]} ${message}`)
    ),
    exitOnError: false,
});