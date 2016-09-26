import { OpaqueToken } from "@angular/core";

export interface CommandOptions {
	/**
	 * Css Class which gets added/removed on the Command element's host while Command isExecuting$.
	 *
	 * @type {string}
	 */
	executingCssClass: string;
}

export const COMMAND_DEFAULT_CONFIG: CommandOptions = {
	executingCssClass: "executing",
};

export const COMMAND_CONFIG = new OpaqueToken("Command Config");