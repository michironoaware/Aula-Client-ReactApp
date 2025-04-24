import { CommandLine } from "../Commands";
import { loggers } from "./loggers.ts";
import { SetAddress } from "./Commands/SetAddress.ts";

export const commandLine = new CommandLine(loggers);
commandLine.addCommand(new SetAddress());
