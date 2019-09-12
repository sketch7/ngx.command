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
import { isCommand, isCommandCreator } from "./command.util";
import { CommandCreator, ICommand } from "./command.model";

/**
 * Controls the state of a component in sync with `Command`.
 *
 * ### Most common usage
 * ```html
 * <button [ssvCommand]="saveCmd">Save</button>
 * ```
 *
 *
 * ### Usage with options
 * ```html
 * <button [ssvCommand]="saveCmd" [ssvCommandOptions]="{executingCssClass: 'in-progress'}">Save</button>
 * ```
 *
 *
 * ### Usage with params
 * This is useful for collections (loops) or using multiple actions with different args.
 * *NOTE: This will share the `isExecuting` when used with multiple controls.*
 *
 * #### With single param
 *
 * ```html
 * <button [ssvCommand]="saveCmd" [ssvCommandParams]="{id: 1}">Save</button>
 * ```
 * *NOTE: if you have only 1 argument as an array, it should be enclosed within an array e.g. `[['apple', 'banana']]`,
 * else it will spread and you will `arg1: "apple", arg2: "banana"`*
 *
  * #### With multi params
 * ```html
 * <button [ssvCommand]="saveCmd" [ssvCommandParams]="[{id: 1}, 'hello', hero]">Save</button>
 * ```
 *
 * ### Usage with Command Creator
 * This is useful for collections (loops) or using multiple actions with different args, whilst not sharing `isExecuting`.
 *
 *
 * ```html
 * <button [ssvCommand]="{execute: removeHero$, canExecute: isValid$, params: [hero, 1337, 'xx']}">Save</button>
 * ```
 *
 */
@Directive({
	selector: "[ssvCommand], [command]", // todo: @deprecated - remove `[command]` after next major
	exportAs: "ssvCommand"
})
export class CommandDirective implements OnInit, OnDestroy {

	@Input("ssvCommand") commandOrCreator: ICommand | CommandCreator | undefined;

	/** @deprecated Use `commandInput` instead. */
	@Input("command")
	get _commandOrCreator() { return this.commandOrCreator; }
	set _commandOrCreator(value: ICommand | CommandCreator | undefined) {
		this.commandOrCreator = value;
	}
	@Input("ssvCommandOptions")
	get commandOptions() { return this._commandOptions; }
	set commandOptions(value: CommandOptions) {
		if (value === this._commandOptions) {
			return;
		}
		this._commandOptions = {
			...COMMAND_DEFAULT_CONFIG, // todo: merge config in module
			...this.config,
			...value,
		};
	}
	private _commandOptions: CommandOptions = {
		...COMMAND_DEFAULT_CONFIG,
		...this.config,
	};
	/** @deprecated Use `commandOptions` instead. */
	@Input("commandOptions")
	get __commandOptions() { return this.commandOptions; }
	set __commandOptions(value: CommandOptions) {
		this.commandOptions = value;
	}

	@Input("ssvCommandParams") commandParams: any | any[];
	/** @deprecated Use `commandParams` instead. */
	@Input("commandParams")
	get _commandParams() { return this.commandParams; }
	set _commandParams(value: any | any[]) {
		this.commandParams = value;
	}
	@HostBinding("disabled") isDisabled: boolean | undefined;

	get command(): ICommand { return this._command; }
	private _command!: ICommand;
	private data$$ = Subscription.EMPTY;

	constructor(
		@Inject(COMMAND_CONFIG) private config: CommandOptions,
		private renderer: Renderer2,
		private element: ElementRef,
		private cdr: ChangeDetectorRef,
		private viewContainer: ViewContainerRef
	) { }

	ngOnInit() {
		// console.log("[ssvCommand::init]");
		if (!this.commandOrCreator) {
			throw new Error("ssvCommand: [ssvCommand] should be defined!");
		} else if (isCommand(this.commandOrCreator)) {
			this._command = this.commandOrCreator;
		} else if (isCommandCreator(this.commandOrCreator)) {
			const isAsync = this.commandOrCreator.isAsync || this.commandOrCreator.isAsync === undefined;
			const hostComponent = (this.viewContainer as any)._view.component;

			const execFn = this.commandOrCreator.execute.bind(hostComponent);
			this.commandParams = this.commandParams || this.commandOrCreator.params;

			const canExec = this.commandOrCreator.canExecute instanceof Function
				? this.commandOrCreator.canExecute.bind(hostComponent, this.commandParams)()
				: this.commandOrCreator.canExecute;

			// console.log("[ssvCommand::init] command creator", {
			// 	firstParam: this.commandParams ? this.commandParams[0] : null,
			// 	params: this.commandParams
			// });
			this._command = new Command(execFn, canExec, isAsync);
		} else {
			throw new Error("ssvCommand: [ssvCommand] is not defined properly!");
		}

		this._command.subscribe();
		const canExecute$ = this._command.canExecute$.pipe(
			tap(x => {
				// console.log("[ssvCommand::canExecute$]", x);
				this.isDisabled = !x;
				this.cdr.markForCheck();
			})
		);

		let isExecuting$: Observable<boolean>;
		if (this._command.isExecuting$) {
			isExecuting$ = this._command.isExecuting$.pipe(
				tap(x => {
					// console.log("[ssvCommand::isExecuting$]", x);
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
		// console.log("[ssvCommand::onClick]", this.commandParams);
		if (Array.isArray(this.commandParams)) {
			this._command.execute(...this.commandParams);
		} else {
			this._command.execute(this.commandParams);
		}
	}

	ngOnDestroy() {
		// console.log("[ssvCommand::destroy]");
		if (this._command) {
			this._command.unsubscribe();
		}
		this.data$$.unsubscribe();
	}
}

