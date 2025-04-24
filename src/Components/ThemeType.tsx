import { InvalidOperationError } from "aula.js";

export enum ThemeType
{
	Vintage = 0,
	Light = 1,
	Onyx = 2,
	Matrix = 3,
}

export function ThemeTypeToDomClass(theme: ThemeType)
{
	switch (theme)
	{
		case ThemeType.Vintage: return "vintage-theme";
		case ThemeType.Light: return "light-theme";
		case ThemeType.Onyx: return "onyx-theme";
		case ThemeType.Matrix: return "matrix-theme";
		default: throw new InvalidOperationError(`Unknown theme type: ${theme}`);
	}
}
