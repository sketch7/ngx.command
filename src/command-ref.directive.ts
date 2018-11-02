import { Directive, OnInit, OnDestroy, Input, ViewContainerRef } from "@angular/core";

import { ICommand, CommandCreator } from "./command.model";
import { isCommandCreator } from "./command.util";
import { Command } from "./command";

/**
 * Command creator ref, directive which allows creating Command in the template
 * and associate it to a command (in order to share executions).
 *
 * ### Most common usage
 * ```html
 * <div class="action button-group" #actionCmd="ssvCommandRef" [ssvCommandRef]="{execute: removeHero$, canExecute: isValid$}">
* 	<button [command]="actionCmd.command" [commandParams]="hero">
		Remove
	</button>
	<button [command]="actionCmd.command" [commandParams]="hero">
		Remove
	</button>
 * </div>
 * ```
 *
 */
@Directive({
	selector: "[ssvCommandRef]",
	exportAs: "ssvCommandRef"
})
export class CommandRefDirective implements OnInit, OnDestroy {
	@Input("ssvCommandRef") commandInput!: ICommand | CommandCreator | undefined;

	command: Readonly<ICommand>;

	constructor(
		private viewContainer: ViewContainerRef
	) { }

	ngOnInit() {
		if (isCommandCreator(this.commandInput)) {
			const isAsync = this.commandInput.isAsync || this.commandInput.isAsync === undefined;
			const hostComponent = (this.viewContainer as any)._view.component;

			const execFn = this.commandInput.execute.bind(hostComponent);
			this.command = new Command(execFn, this.commandInput.canExecute, isAsync);
		} else {
			throw new Error("[ssvCommandRef] is not defined properly!");
		}
	}

	ngOnDestroy() {
		// console.log("[commandRef::destroy]");
		if (this.command) {
			this.command.destroy();
		}
	}
}