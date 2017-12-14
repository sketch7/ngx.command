import { Observable } from "rxjs/Observable";
import { combineLatest } from "rxjs/observable/combineLatest";
import { Subscription } from "rxjs/Subscription";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { tap, map, filter, switchMap } from "rxjs/operators";

export interface ICommand {
	/** Determines whether the command is currently executing. */
	isExecuting: boolean;
	isExecuting$?: Observable<boolean>;
	/** Determines whether the command can execute or not. */
	canExecute: boolean;
	canExecute$?: Observable<boolean>;
	/** Execute function to invoke. */
	execute(): void;
	/** Disposes all resources held by subscriptions. */
	destroy(): void;
}


/**
 * Command object used to encapsulate information which is needed to perform an action.
 */
export class Command implements ICommand {

	isExecuting = false;
	isExecuting$ = new BehaviorSubject<boolean>(false);
	canExecute = true;
	canExecute$: Observable<boolean>;

	private executionPipe$ = new Subject<{}>();
	private isExecuting$$: Subscription;
	private canExecute$$: Subscription;
	private executionPipe$$: Subscription;

	/**
	 * Creates an instance of Command.
	 *
	 * @param execute Execute function to invoke - use `isAsync: true` when {Observable<any>}.
	 * @param canExecute Observable which determines whether it can execute or not.
	 * @param isAsync Indicates that the execute function is async e.g. Observable.
	 */
	constructor(
		execute: () => any,
		canExecute$?: Observable<boolean>,
		isAsync?: boolean
	) {
		if (canExecute$) {
			this.canExecute$ = combineLatest(
				this.isExecuting$,
				canExecute$
				, (isExecuting, canExecuteResult) => {
					// console.log("[command::combineLatest$] update!", { isExecuting, canExecuteResult });
					this.isExecuting = isExecuting;
					this.canExecute = !isExecuting && canExecuteResult;
					return this.canExecute;
				});
			this.canExecute$$ = this.canExecute$.subscribe();
		} else {
			this.canExecute$ = this.isExecuting$.pipe(
				map(x => {
					const canExecute = !x;
					this.canExecute = canExecute;
					return canExecute;
				})
			);
			this.isExecuting$$ = this.isExecuting$.pipe(
				tap(x => this.isExecuting = x)
			).subscribe();
		}
		this.buildExecutionPipe(execute, isAsync);
	}

	execute() {
		this.executionPipe$.next({});
	}

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
		if (this.isExecuting$) {
			this.isExecuting$.complete();
		}
	}

	private buildExecutionPipe(execute: () => any, isAsync?: boolean) {
		let pipe$ = this.executionPipe$.pipe(
			filter(() => this.canExecute),
			tap(() => {
				// console.log("[command::excutionPipe$] do#1 - set execute");
				this.isExecuting$.next(true);
			})
		);

		const execFn = isAsync
			? switchMap(execute)
			: tap(execute);

		pipe$ = pipe$.pipe(
			execFn,
			tap(() => {
				// console.log("[command::excutionPipe$] do#2 - set idle");
				this.isExecuting$.next(false);
			}, () => {
				// console.log("[command::excutionPipe$] do#2 error - set idle");
				this.isExecuting$.next(false);
			})
		);
		this.executionPipe$$ = pipe$.subscribe();
	}

}