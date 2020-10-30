import { Observable } from "rxjs";
import { Directive, OnInit, OnDestroy, Input, ViewContainerRef } from "@angular/core";

import { ICommand, CommandCreator } from "./command.model";
import { isCommandCreator } from "./command.util";
import { Command } from "./command";

/**
 * Command creator ref, directive which allows creating Command in the template
 * and associate it to a command (in order to share executions).
 * @example
 * ### Most common usage
 * ```html
 * <div class="action button-group" #actionCmd="ssvCommandRef" [ssvCommandRef]="{execute: removeHero$, canExecute: isValid$}">
 *    <button [ssvCommand]="actionCmd.command" [ssvCommandParams]="hero">
 *      Remove
 *    </button>
 *    <button [ssvCommand]="actionCmd.command" [ssvCommandParams]="hero">
 *       Remove
 *    </button>
 * </div>
 * ```
 *
 */
@Directive({
	selector: "[ssvCommandRef]",
	exportAs: "ssvCommandRef"
})
export class CommandRefDirective implements OnInit, OnDestroy {

	@Input("ssvCommandRef") commandCreator: CommandCreator | undefined;

	get command(): ICommand { return this._command; }
	private _command!: ICommand;

	constructor(
		private viewContainer: ViewContainerRef
	) { }

	ngOnInit(): void {
		if (isCommandCreator(this.commandCreator)) {
			const isAsync = this.commandCreator.isAsync || this.commandCreator.isAsync === undefined;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const hostComponent = (this.viewContainer as any)._view.component;

			const execFn = this.commandCreator.execute.bind(hostComponent);
			this._command = new Command(execFn, this.commandCreator.canExecute as Observable<boolean> | undefined, isAsync);
		} else {
			throw new Error("ssvCommandRef: [ssvCommandRef] is not defined properly!");
		}
	}

	ngOnDestroy(): void {
		// console.log("[commandRef::destroy]");
		if (this._command) {
			this._command.destroy();
		}
	}

}
