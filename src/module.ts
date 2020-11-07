import { NgModule, ModuleWithProviders, InjectionToken, Optional } from "@angular/core";

import { CommandDirective } from "./command.directive";
import { CommandRefDirective } from "./command-ref.directive";
import { CommandOptions, COMMAND_DEFAULT_CONFIG, COMMAND_CONFIG } from "./config";

/** @internal */
export const MODULE_CONFIG_DATA = new InjectionToken<CommandOptions>("@ssv/ngx.command/configData");

const components = [
	CommandDirective,
	CommandRefDirective
];

@NgModule({
	declarations: components,
	providers: [
		{ provide: COMMAND_CONFIG, useFactory: _moduleConfigFactory, deps: [[MODULE_CONFIG_DATA, new Optional()]] },
	],
	exports: [...components],
})
export class SsvCommandModule {

	static forRoot(config?: Partial<CommandOptions> | (() => Partial<CommandOptions>)): ModuleWithProviders<SsvCommandModule> {
		return {
			ngModule: SsvCommandModule,
			providers: [
				{ provide: MODULE_CONFIG_DATA, useValue: config },
			],
		};
	}

}

/** @internal */
export function _moduleConfigFactory(config: CommandOptions | (() => CommandOptions)): CommandOptions {
	const cfg = typeof config === "function" ? config() : config;
	return cfg
		? {
			...COMMAND_DEFAULT_CONFIG,
			...cfg,
		}
		: COMMAND_DEFAULT_CONFIG;
}
