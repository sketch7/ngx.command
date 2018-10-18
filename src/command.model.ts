import { Observable } from "rxjs";

export interface ICommand {
	/** Determines whether the command is currently executing, as a snapshot value. */
	readonly isExecuting: boolean;
	/** Determines whether the command is currently executing, as an observable. */
	readonly isExecuting$: Observable<boolean>;
	/** Determines whether the command can execute or not, as a snapshot value. */
	readonly canExecute: boolean;
	/** Determines whether the command can execute or not, as an observable. */
	readonly canExecute$: Observable<boolean>;

	/** Execute function to invoke. */
	execute(...args: any[]): void;
	/** Disposes all resources held by subscriptions. */
	destroy(): void;
}

export interface CommandDirectiveArg {
	execute: (...args: any[]) => Observable<any> | Promise<any> | void;
	canExecute?: Observable<boolean>;
	params: any | any[];
	isAsync?: boolean;
}
