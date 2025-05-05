import { EventEmitter } from "utils/threading/EventEmitter.ts";
import { Func } from "utils/Func.ts";
import { ThemeType } from "components/ThemeType.ts";

export const events = new EventEmitter<IEvents>();

export interface IEvents
{
	ThemeUpdateRequest: Func<[ ThemeType ]>;
	LogClearRequest: Func;
}
