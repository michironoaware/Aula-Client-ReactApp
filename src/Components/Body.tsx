import React from "react";

export interface BodyArgs
{
	children?: React.ReactNode;
}

export default function Body(args: BodyArgs)
{
	return <div className="body">{args.children}</div>
}
