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

	/** Determine whether to set a `delay(1)` when setting the disabled. Which might be needed when working with external
	 * components/directives (such as material button)
	 */
	hasDisabledDelay: boolean;
}

export const COMMAND_DEFAULT_CONFIG = Object.freeze({
	executingCssClass: "executing",
	handleDisabled: true,
	hasDisabledDelay: false,
} as CommandOptions);

export const COMMAND_CONFIG = new InjectionToken<CommandOptions>("command-config");
