import { Observable } from "rxjs/Observable";
import { combineLatest } from "rxjs/observable/combineLatest";
import { Subscription } from "rxjs/Subscription";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { tap, map, filter, switchMap } from "rxjs/operators";

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
	execute(): void;
	/** Disposes all resources held by subscriptions. */
	destroy(): void;
}

/**
 * Command object used to encapsulate information which is needed to perform an action.
 */
export class Command implements ICommand {
	/** Determines whether the command is currently executing, as a snapshot value. */
	get isExecuting(): boolean {
		return this._isExecuting;
	}

	/** Determines whether the command can execute or not, as a snapshot value. */
	get canExecute(): boolean {
		return this._canExecute;
	}

	/** Determines whether the command is currently executing, as an observable. */
	get isExecuting$(): Observable<boolean> {
		return this._isExecuting$.asObservable();
	}

	/** Determines whether the command can execute or not, as an observable. */
	readonly canExecute$: Observable<boolean>;

	private _isExecuting$ = new BehaviorSubject<boolean>(false);
	private _isExecuting = false;
	private _canExecute = true;
	private executionPipe$ = new Subject<{}>();
	private isExecuting$$: Subscription;
	private canExecute$$: Subscription;
	private executionPipe$$: Subscription;

	/**
	 * Creates an instance of Command.
	 *
	 * @param execute Execute function to invoke - use `isAsync: true` when `Observable<any>`.
	 * @param canExecute Observable which determines whether it can execute or not.
	 * @param isAsync Indicates that the execute function is async e.g. Observable.
	 */
	constructor(execute: () => any, canExecute$?: Observable<boolean>, isAsync?: boolean) {
		if (canExecute$) {
			this.canExecute$ = combineLatest(
				this._isExecuting$,
				canExecute$,
				(isExecuting, canExecuteResult) => {
					// console.log("[command::combineLatest$] update!", { isExecuting, canExecuteResult });
					this._isExecuting = isExecuting;
					this._canExecute = !isExecuting && canExecuteResult;
					return this._canExecute;
				}
			);
			this.canExecute$$ = this.canExecute$.subscribe();
		} else {
			this.canExecute$ = this._isExecuting$.pipe(
				map(x => {
					const canExecute = !x;
					this._canExecute = canExecute;
					return canExecute;
				})
			);
			this.isExecuting$$ = this._isExecuting$
				.pipe(tap(x => (this._isExecuting = x)))
				.subscribe();
		}
		this.executionPipe$$ = this.buildExecutionPipe(execute, isAsync).subscribe();
	}

	/** Execute function to invoke. */
	execute() {
		this.executionPipe$.next({});
	}

	/** Disposes all resources held by subscriptions. */
	destroy() {
		if (this.executionPipe$$) {
			this.executionPipe$$.unsubscribe();
		}
		if (this.canExecute$$) {
			this.canExecute$$.unsubscribe();
		}
		if (this.isExecuting$$) {
			this.isExecuting$$.unsubscribe();
		}
	}

	private buildExecutionPipe(execute: () => any, isAsync?: boolean): Observable<{}> {
		let pipe$ = this.executionPipe$.pipe(
			filter(() => this._canExecute),
			tap(() => {
				// console.log("[command::excutionPipe$] do#1 - set execute");
				this._isExecuting$.next(true);
			})
		);

		const execFn = isAsync ? switchMap(execute) : tap(execute);

		pipe$ = pipe$.pipe(
			execFn,
			tap(
				() => {
					// console.log("[command::excutionPipe$] do#2 - set idle");
					this._isExecuting$.next(false);
				},
				() => {
					// console.log("[command::excutionPipe$] do#2 error - set idle");
					this._isExecuting$.next(false);
				}
			)
		);
		return pipe$;
	}
}

/**
 * Async Command object used to encapsulate information which is needed to perform an action,
 * which takes an execute function as Observable/Promise.
 */
export class CommandAsync extends Command {
	constructor(
		execute: () => Observable<any> | Promise<any>,
		canExecute$?: Observable<boolean>
	) {
		super(execute, canExecute$, true);
	}
}
