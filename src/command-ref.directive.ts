import { Observable } from "rxjs";
import { Directive, OnInit, OnDestroy, Input } from "@angular/core";

import { ICommand, CommandCreator } from "./command.model";
import { isCommandCreator } from "./command.util";
import { Command } from "./command";

const NAME_CAMEL = "ssvCommandRef";

/**
 * Command creator ref, directive which allows creating Command in the template
 * and associate it to a command (in order to share executions).
 * @example
 * ### Most common usage
 * ```html
 * <div #actionCmd="ssvCommandRef" [ssvCommandRef]="{host: this, execute: removeHero$, canExecute: isValid$}">
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
	selector: `[${NAME_CAMEL}]`,
	exportAs: NAME_CAMEL
})
export class CommandRefDirective implements OnInit, OnDestroy {

	@Input(NAME_CAMEL) commandCreator: CommandCreator | undefined;

	get command(): ICommand { return this._command; }
	private _command!: ICommand;

	ngOnInit(): void {
		if (isCommandCreator(this.commandCreator)) {
			const isAsync = this.commandCreator.isAsync || this.commandCreator.isAsync === undefined;

			const execFn = this.commandCreator.execute.bind(this.commandCreator.host);
			this._command = new Command(execFn, this.commandCreator.canExecute as Observable<boolean> | undefined, isAsync);
		} else {
			throw new Error(`${NAME_CAMEL}: [${NAME_CAMEL}] is not defined properly!`);
		}
	}

	ngOnDestroy(): void {
		// console.log("[commandRef::destroy]");
		if (this._command) {
			this._command.destroy();
		}
	}

}
