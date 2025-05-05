import { LogLevel } from "utils/logging/LogLevel.ts";

export interface ILogger
{
	log(logLevel: LogLevel, message: string, id?: string): void;
}
