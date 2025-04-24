import { EventEmitter } from "../Common/Threading";
import { Func } from "../Common";
import { ThemeType } from "../Components/ThemeType.tsx";

export const events = new EventEmitter<IEvents>();

export interface IEvents
{
	ThemeUpdateRequest: Func<[ ThemeType ]>;
}
