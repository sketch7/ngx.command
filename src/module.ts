import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";

import { CommandDirective } from "./command.directive";
import { CommandRefDirective } from "./command-ref.directive";
import { CommandOptions, COMMAND_DEFAULT_CONFIG, COMMAND_CONFIG } from "./config";

/**
 * @internal
 */
export const _MODULE_CONFIG = new InjectionToken<CommandOptions | (() => CommandOptions)>(
	"_command-config"
);

@NgModule({
	declarations: [CommandDirective, CommandRefDirective],
	providers: [{ provide: COMMAND_CONFIG, useValue: COMMAND_DEFAULT_CONFIG }],
	exports: [CommandDirective, CommandRefDirective],
})
export class CommandModule {
	static forRoot(config?: CommandOptions | (() => CommandOptions)): ModuleWithProviders {
		return {
			ngModule: CommandModule,
			providers: [
				{
					provide: COMMAND_CONFIG,
					useFactory: _moduleConfigFactory,
					deps: [_MODULE_CONFIG],
				},
				{ provide: _MODULE_CONFIG, useValue: config },
			],
		};
	}
}

/**
 * @internal
 */
export function _moduleConfigFactory(config: CommandOptions | (() => CommandOptions)) {
	return typeof config === "function" ? config() : config;
}
