import { ReactNode } from "react";

export default function LogList(args: LogListArgs)
{
	return <div className="loglist">
		{args.children}
	</div>
}

export interface LogListArgs
{
	children?: ReactNode
}
