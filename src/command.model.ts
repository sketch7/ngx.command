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

	/** Determines whether to auto destroy when having 0 subscribers (defaults to `true`). */
	autoDestroy: boolean;

	/** Execute function to invoke. */
	execute(...args: unknown[]): void;

	/** Disposes all resources held by subscriptions. */
	destroy(): void;

	/** Subscribe listener, in order to handle auto disposing. */
	subscribe(): void;

	/** Unsubscribe listener, in order to handle auto disposing. */
	unsubscribe(): void;
}

export interface CommandCreator {
	execute: (...args: any[]) => Observable<unknown> | Promise<unknown> | void;
	// eslint-disable-next-line @typescript-eslint/ban-types
	canExecute?: Observable<boolean> | Function;
	params?: unknown | unknown[];
	isAsync?: boolean;
	host: unknown;
}
