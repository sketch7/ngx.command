import { NgModule, ModuleWithProviders } from "@angular/core";

import { CommandDirective } from "./command.directive";
import { CommandOptions, COMMAND_DEFAULT_CONFIG, COMMAND_CONFIG } from "./config";

@NgModule({
	declarations: [
		CommandDirective
	],
	providers: [
		{ provide: COMMAND_CONFIG, useValue: COMMAND_DEFAULT_CONFIG }
	],
	exports: [
		CommandDirective
	]
})
export class CommandModule {

	static forRoot(config: CommandOptions): ModuleWithProviders {
		const mergedConfig = Object.assign({}, COMMAND_DEFAULT_CONFIG, config);
		return {
			ngModule: CommandModule,
			providers: [
				{ provide: COMMAND_CONFIG, useValue: mergedConfig }
			]
		};
	}

}