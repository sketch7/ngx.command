import {
	Directive,
	OnInit,
	OnDestroy,
	Input,
	HostBinding,
	HostListener,
	ElementRef,
	Inject,
	Renderer2,
	ChangeDetectorRef,
	ViewContainerRef,
} from "@angular/core";
import { Subscription, Observable, EMPTY } from "rxjs";
import { tap, merge } from "rxjs/operators";

import { CommandOptions, COMMAND_CONFIG, COMMAND_DEFAULT_CONFIG } from "./config";
import { Command } from "./command";
import { isCommand, isCommandArg } from "./command.util";
import { CommandDirectiveArg, ICommand } from "./command.model";

/**
 *
 * ### Example with options
 * ```html
 * <button [command]="saveCmd" [commandOptions]="{executingCssClass: 'in-progress'}">Save</button>
 * ```
 */
@Directive({
	selector: "[command]",
})
export class CommandDirective implements OnInit, OnDestroy {
	@Input() command!: ICommand | CommandDirectiveArg | undefined;
	@Input() commandOptions!: CommandOptions;
	@Input() commandParams: any;
	@HostBinding("disabled") isDisabled: boolean | undefined;

	private data$$!: Subscription;
	private _command: ICommand;

	constructor(
		@Inject(COMMAND_CONFIG) private config: CommandOptions,
		private renderer: Renderer2,
		private element: ElementRef,
		private cdr: ChangeDetectorRef,
		private viewContainer: ViewContainerRef
	) { }

	ngOnInit() {
		// console.log("[commandDirective::init]");
		this.commandOptions = {
			...COMMAND_DEFAULT_CONFIG,
			...this.config,
			...this.commandOptions,
		};

		if (!this.command) {
			throw new Error("[commandDirective] [command] should be defined!");
		} else if (isCommand(this.command)) {
			this._command = this.command;
		} else if (isCommandArg(this.command)) {
			const isAsync = this.command.isAsync || this.command.isAsync === undefined;
			const hostComponent = (this.viewContainer as any)._view.component;

			const execFn = this.command.params
			? this.command.execute.bind(hostComponent,  ...this.command.params)
			: this.command.execute.bind(hostComponent);
			this._command = new Command(execFn, this.command.canExecute, isAsync);
		} else {
			throw new Error("[commandDirective] [command] is not defined properly!");
		}

		const canExecute$ = this._command.canExecute$.pipe(
			tap(x => {
				// console.log("[commandDirective::canExecute$]", x);
				this.isDisabled = !x;
				this.cdr.markForCheck();
			})
		);

		let isExecuting$: Observable<boolean>;
		if (this._command.isExecuting$) {
			isExecuting$ = this._command.isExecuting$.pipe(
				tap(x => {
					// console.log("[commandDirective::isExecuting$]", x);
					if (x) {
						this.renderer.addClass(
							this.element.nativeElement,
							this.commandOptions.executingCssClass
						);
					} else {
						this.renderer.removeClass(
							this.element.nativeElement,
							this.commandOptions.executingCssClass
						);
					}
				})
			);
		} else {
			isExecuting$ = EMPTY;
		}
		this.data$$ = canExecute$.pipe(merge(isExecuting$)).subscribe();
	}

	@HostListener("click")
	onClick() {
		// console.log("[commandDirective::onClick]");
		this._command.execute();
	}

	ngOnDestroy() {
		// console.log("[commandDirective::destroy]");
		this._command.destroy();
		this.data$$.unsubscribe();
	}
}