import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
export interface ICommand {
    /**
     * Determines whether the command is currently executing.
     */
    isExecuting: boolean;
    isExecuting$?: Observable<boolean>;
    /**
     * Determines whether the command can execute or not.
     */
    canExecute: boolean;
    canExecute$?: Observable<boolean>;
    /**
     * Execute function to invoke.
     */
    execute(): void;
    /**
     * Disposes all resources held by subscriptions.
     */
    destroy(): void;
}
/**
 * Command object used to encapsulate information which is needed to perform an action.
 *
 * @export
 * @class Command
 * @implements {ICommand}
 */
export declare class Command implements ICommand {
    isExecuting: boolean;
    isExecuting$: BehaviorSubject<boolean>;
    canExecute: boolean;
    canExecute$: Observable<boolean>;
    private executionPipe$;
    private isExecuting$$;
    private canExecute$$;
    private executionPipe$$;
    /**
     * Creates an instance of Command.
     *
     * @param {(() => any)} execute Execute function to invoke - use `isAsync: true` when {Observable<any>}.
     * @param {Observable<boolean>} [canExecute] Observable which determines whether it can execute or not.
     * @param {boolean} [isAsync] Indicates that the execute function is async e.g. Observable.
     */
    constructor(execute: () => any, canExecute$?: Observable<boolean>, isAsync?: boolean);
    execute(): void;
    destroy(): void;
    private buildExecutionPipe(execute, isAsync?);
}
