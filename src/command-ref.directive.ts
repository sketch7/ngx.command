import { Directive, OnInit, OnDestroy, Input, ViewContainerRef } from "@angular/core";

import { ICommand, CommandDirectiveArg } from "./command.model";
import { isCommandArg } from "./command.util";
import { Command } from "./command";

@Directive({
	selector: "[ssvCommandRef]",
	exportAs: "ssvCommandRef"
})
export class CommandRefDirective implements OnInit, OnDestroy {
	@Input("ssvCommandRef") commandInput!: ICommand | CommandDirectiveArg | undefined;

	command: Readonly<ICommand>;

	constructor(
		private viewContainer: ViewContainerRef
	) { }

	ngOnInit() {
		if (isCommandArg(this.commandInput)) {
			const isAsync = this.commandInput.isAsync || this.commandInput.isAsync === undefined;
			const hostComponent = (this.viewContainer as any)._view.component;

			const execFn = this.commandInput.execute.bind(hostComponent);
			this.command = new Command(execFn, this.commandInput.canExecute, isAsync);
		} else {
			throw new Error("[commandRef] [command] is not defined properly!");
		}
	}

	ngOnDestroy() {
		// console.log("[commandRef::destroy]");
		this.command.destroy();
	}
}