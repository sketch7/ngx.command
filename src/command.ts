import { Observable, combineLatest, Subscription, Subject, BehaviorSubject } from "rxjs";
import { tap, map, filter, switchMap } from "rxjs/operators";
import { ICommand } from "./command.model";


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

	/** Determines whether to auto destroy when having 0 subscribers. */
	autoDestroy = true;

	/** Determines whether the command can execute or not, as an observable. */
	readonly canExecute$: Observable<boolean>;

	private _isExecuting$ = new BehaviorSubject<boolean>(false);
	private _isExecuting = false;
	private _canExecute = true;
	private executionPipe$ = new Subject<any[] | undefined | {}>();
	private isExecuting$$: Subscription | undefined;
	private canExecute$$: Subscription | undefined;
	private executionPipe$$: Subscription | undefined;
	private subscribersCount = 0;

	/**
	 * Creates an instance of Command.
	 *
	 * @param execute Execute function to invoke - use `isAsync: true` when `Observable<any>`.
	 * @param canExecute Observable which determines whether it can execute or not.
	 * @param isAsync Indicates that the execute function is async e.g. Observable.
	 */
	constructor(
		execute: (...args: any[]) => any,
		canExecute$?: Observable<boolean>,
		isAsync?: boolean,
	) {
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
	execute(...args: any[]) {
		// console.warn("[command::execute]", args);
		this.executionPipe$.next(args);
	}

	/** Disposes all resources held by subscriptions. */
	destroy() {
		// console.warn("[command::destroy]");
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

	subscribe() {
		this.subscribersCount++;
	}

	unsubscribe() {
		this.subscribersCount--;
		// console.log("[command::unsubscribe]", { autoDestroy: this.autoDestroy, subscribersCount: this.subscribersCount });
		if (this.autoDestroy && this.subscribersCount <= 0) {
			this.destroy();
		}
	}

	private buildExecutionPipe(execute: (...args: any[]) => any, isAsync?: boolean): Observable<any> {
		let pipe$ = this.executionPipe$.pipe(
			filter(() => this._canExecute),
			tap(() => {
				// console.log("[command::excutionPipe$] do#1 - set execute", { args: x });
				this._isExecuting$.next(true);
			})
		);

		const execFn = isAsync
			? switchMap((args: any[] | undefined) => {
				if (args) {
					return execute(...args);
				}
				return execute();
			})
			: tap((args: any[] | undefined) => {
				if (args) {
					execute(...args);
					return;
				}
				execute();
			});

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
		execute: (...args: any[]) => Observable<any> | Promise<any>,
		canExecute$?: Observable<boolean>,
	) {
		super(execute, canExecute$, true);
	}
}
