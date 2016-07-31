import { OnInit, OnDestroy, Renderer, ElementRef } from "@angular/core";
import { ICommand } from "./command";
export interface CommandOptions {
    executingCssClass: string;
}
export declare class CommandConfig implements CommandOptions {
    executingCssClass: string;
    constructor();
}
export declare const COMMAND_DEFAULT_CONFIG: CommandConfig;
/**
 *
 * ### Example with options
 * ```html
 * <button [command]="saveCmd" [commandOptions]="{executingCssClass: 'in-progress'}">Save</button>
 * ```
 * @export
 * @class CommandDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export declare class CommandDirective implements OnInit, OnDestroy {
    private renderer;
    private element;
    command: ICommand;
    commandOptions: CommandOptions;
    isDisabled: boolean;
    private canExecute$$;
    private isExecuting$$;
    constructor(config: CommandConfig, renderer: Renderer, element: ElementRef);
    ngOnInit(): void;
    onClick(): void;
    ngOnDestroy(): void;
}
