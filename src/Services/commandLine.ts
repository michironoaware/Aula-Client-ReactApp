import { CommandLine } from "../Commands";
import { loggers } from "./loggers.ts";
import { SetAddress } from "./Commands/SetAddress.ts";
import { Help } from "./Commands/Help.ts";
import { SetTheme } from "./Commands/SetTheme.ts";
import { LogIn } from "./Commands/LogIn.ts";
import { Cls } from "./Commands/Cls.ts";
import { SetLogLevel } from "./Commands/SetLogLevel.ts";
import { Register } from "./Commands/Register.ts";

export const commandLine = new CommandLine(loggers);
commandLine.addCommand(new Help());
commandLine.addCommand(new SetTheme());
commandLine.addCommand(new SetLogLevel());
commandLine.addCommand(new Cls());
commandLine.addCommand(new SetAddress());
commandLine.addCommand(new Register());
commandLine.addCommand(new LogIn());
