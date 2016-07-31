export interface CommandOptions {

	/**
	 * Css Class which gets added/removed on the Command element's host while Command isExecuting$.
	 *
	 * @type {string}
	 */
	executingCssClass: string;
}

/**
 * Command Config used to configure globally the Command.
 *
 * ### Example
 * ```ts
 * import {CommandConfig, CommandOptions} from "@ssv/ng2-command";
 *
 * { provide: CommandConfig, useValue: { executingCssClass: "is-busy" } as CommandOptions }
 * ```
 * @export
 * @class CommandConfig
 * @implements {CommandOptions}
 */
export class CommandConfig implements CommandOptions {

	executingCssClass: string;

	constructor() {
		Object.assign(this, {
			executingCssClass: "executing"
		} as CommandOptions);
	}
}
export const COMMAND_DEFAULT_CONFIG = new CommandConfig();