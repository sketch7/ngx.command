import { OnInit, OnDestroy, Renderer, ElementRef } from "@angular/core";
import { CommandOptions } from "./config";
import { ICommand } from "./command";
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
    private config;
    private renderer;
    private element;
    command: ICommand;
    commandOptions: CommandOptions;
    isDisabled: boolean;
    private canExecute$$;
    private isExecuting$$;
    constructor(config: CommandOptions, renderer: Renderer, element: ElementRef);
    ngOnInit(): void;
    onClick(): void;
    ngOnDestroy(): void;
}
