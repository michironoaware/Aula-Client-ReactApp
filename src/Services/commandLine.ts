import { CommandLine } from "../Commands";
import { loggers } from "./loggers.ts";
import { SetAddress } from "./Commands/SetAddress.ts";
import { Help } from "./Commands/Help.ts";
import { SetTheme } from "./Commands/SetTheme.ts";

export const commandLine = new CommandLine(loggers);
commandLine.addCommand(new Help());
commandLine.addCommand(new SetTheme());
commandLine.addCommand(new SetAddress());
