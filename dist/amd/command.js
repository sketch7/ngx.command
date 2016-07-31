define(["require", "exports", "rxjs/Observable", "rxjs/Subject", "rxjs/BehaviorSubject"], function (require, exports, Observable_1, Subject_1, BehaviorSubject_1) {
    "use strict";
    /**
     * Command object used to encapsulate information which is needed to perform an action.
     *
     * @export
     * @class Command
     * @implements {ICommand}
     */
    var Command = (function () {
        /**
         * Creates an instance of Command.
         *
         * @param {(() => any)} execute Execute function to invoke - use `isAsync: true` when {Observable<any>}.
         * @param {Observable<boolean>} [canExecute] Observable which determines whether it can execute or not.
         * @param {boolean} [isAsync] Indicates that the execute function is async e.g. Observable.
         */
        function Command(execute, canExecute$, isAsync) {
            var _this = this;
            this.isExecuting = false;
            this.isExecuting$ = new BehaviorSubject_1.BehaviorSubject(false);
            this.canExecute = true;
            this.executionPipe$ = new Subject_1.Subject();
            if (canExecute$) {
                this.canExecute$ = Observable_1.Observable.combineLatest(this.isExecuting$, canExecute$, function (isExecuting, canExecuteResult) {
                    // console.log("[command::combineLatest$] update!", { isExecuting, canExecuteResult });
                    _this.isExecuting = isExecuting;
                    _this.canExecute = !isExecuting && canExecuteResult;
                    return _this.canExecute;
                });
                this.canExecute$$ = this.canExecute$.subscribe();
            }
            else {
                this.canExecute$ = this.isExecuting$.map(function (x) {
                    var canExecute = !x;
                    _this.canExecute = canExecute;
                    return canExecute;
                });
                this.isExecuting$$ = this.isExecuting$
                    .do(function (x) { return _this.isExecuting = x; })
                    .subscribe();
            }
            this.buildExecutionPipe(execute, isAsync);
        }
        Command.prototype.execute = function () {
            this.executionPipe$.next({});
        };
        Command.prototype.destroy = function () {
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
        };
        Command.prototype.buildExecutionPipe = function (execute, isAsync) {
            var _this = this;
            var pipe$ = this.executionPipe$
                .filter(function () { return _this.canExecute; })
                .do(function () {
                // console.log("[command::excutionPipe$] do#1 - set execute");
                _this.isExecuting$.next(true);
            });
            pipe$ = isAsync
                ? pipe$.switchMap(function () { return execute(); })
                : pipe$.do(function () { return execute(); });
            pipe$ = pipe$
                .do(function () {
                // console.log("[command::excutionPipe$] do#2 - set idle");
                _this.isExecuting$.next(false);
            }, function () {
                // console.log("[command::excutionPipe$] do#2 error - set idle");
                _this.isExecuting$.next(false);
            });
            this.executionPipe$$ = pipe$.subscribe();
        };
        return Command;
    }());
    exports.Command = Command;
});

//# sourceMappingURL=command.js.map
