import { LogLevel } from ".";

export interface ILogger
{
	log(logLevel: LogLevel, message: string, id?: string): void;
}
