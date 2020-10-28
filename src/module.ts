import { NgModule, ModuleWithProviders, InjectionToken } from "@angular/core";

import { CommandDirective } from "./command.directive";
import { CommandRefDirective } from "./command-ref.directive";
import { CommandOptions, COMMAND_DEFAULT_CONFIG, COMMAND_CONFIG } from "./config";

/** @internal */
export const _MODULE_CONFIG = new InjectionToken<CommandOptions>("_command-config");

@NgModule({
	declarations: [CommandDirective, CommandRefDirective],
	providers: [{ provide: COMMAND_CONFIG, useValue: COMMAND_DEFAULT_CONFIG }],
	exports: [CommandDirective, CommandRefDirective],
})
export class SsvCommandModule {

	static forRoot(config?: CommandOptions | (() => CommandOptions)): ModuleWithProviders<SsvCommandModule> {
		return {
			ngModule: SsvCommandModule,
			providers: [
				{
					provide: COMMAND_CONFIG,
					useFactory: moduleConfigFactory,
					deps: [_MODULE_CONFIG],
				},
				{ provide: _MODULE_CONFIG, useValue: config },
			],
		};
	}

}

/** @internal */
export function moduleConfigFactory(config: CommandOptions | (() => CommandOptions)): CommandOptions {
	const cfg = typeof config === "function" ? config() : config;
	return cfg
		? {
			...COMMAND_DEFAULT_CONFIG,
			...cfg,
		}
		: COMMAND_DEFAULT_CONFIG;
}
