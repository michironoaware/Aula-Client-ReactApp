import React from "react";
import { ThemeType } from "./ThemeType.tsx";

export default function Theme(args: ThemeArgs)
{
	const flickerClass = args.theme === "light-theme" ? "light-flicker" : "flicker";
	
	const effects  = args.withEffects
		? <div>
			<div className="radial"></div>
			<div className={flickerClass}></div>
			<div className="scanline"></div>
			<div className="scanlines"></div>
		</div>
		: undefined;

	return <div className={`theme ${args.theme}`}>
		{effects}
		{args.children}
	</div>
}

export interface ThemeArgs
{
	children: React.ReactNode;
	theme: ThemeType;
	withEffects: boolean;
}
