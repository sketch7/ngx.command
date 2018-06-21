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
} from "@angular/core";
import { Subscription, Observable, EMPTY } from "rxjs";
import { tap, merge } from "rxjs/operators";

import { CommandOptions, COMMAND_CONFIG, COMMAND_DEFAULT_CONFIG } from "./config";
import { ICommand } from "./command";

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
	@Input() command!: ICommand;
	@Input() commandOptions!: CommandOptions;
	@HostBinding("disabled") isDisabled: boolean | undefined;

	private data$$!: Subscription;

	constructor(
		@Inject(COMMAND_CONFIG) private config: CommandOptions,
		private renderer: Renderer2,
		private element: ElementRef
	) {}

	ngOnInit() {
		// console.log("[commandDirective::init]");
		this.commandOptions = {
			...COMMAND_DEFAULT_CONFIG,
			...this.config,
			...this.commandOptions,
		};

		if (!this.command) {
			throw new Error("[commandDirective] [command] should be defined!");
		}

		const canExecute$ = this.command.canExecute$.pipe(
			tap(x => {
				// console.log("[commandDirective::canExecute$]", x);
				this.isDisabled = !x;
			})
		);

		let isExecuting$: Observable<boolean>;
		if (this.command.isExecuting$) {
			isExecuting$ = this.command.isExecuting$.pipe(
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
		this.command.execute();
	}

	ngOnDestroy() {
		// console.log("[commandDirective::destroy]");
		this.command.destroy();
		this.data$$.unsubscribe();
	}
}
