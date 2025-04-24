import { LogLevel } from "./LogLevel.ts";

export interface ILogger
{
	log(logLevel: LogLevel, message: string): void;
}
