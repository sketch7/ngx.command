import { InjectionToken } from "@angular/core";

export interface CommandOptions {
	/**
	 * Css Class which gets added/removed on the Command element's host while Command `isExecuting$`.
	 */
	executingCssClass: string;

	/** Determines whether the disabled will be handled by the directive or not.
	 * Disable handled by directive's doesn't always play nice when used with other component/pipe/directive and they also handle disabled.
	 * This disables the handling manually and need to pass explicitly `[disabled]="!saveCmd.canExecute"`.
	 */
	handleDisabled: boolean;
}

export const COMMAND_DEFAULT_CONFIG: Readonly<CommandOptions> = Object.freeze({
	executingCssClass: "executing",
	handleDisabled: true,
});

export const COMMAND_CONFIG = new InjectionToken<CommandOptions>("command-config");
