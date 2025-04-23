import React from "react";

export default function Theme(args: ThemeArgs)
{
	return <div className={`theme ${args.theme}`}>
		<div className="radial"></div>
		<div className="flicker"></div>
		<div className="scanline"></div>
		<div className="scanlines"></div>
		{args.children}
	</div>
}

export enum ThemeType
{
	Dark = "dark-theme",
	Light = "light-theme",
	Onyx = "onyx-theme",
	Matrix = "matrix-theme",
}

export interface ThemeArgs
{
	children: React.ReactNode;
	theme: ThemeType;
}
