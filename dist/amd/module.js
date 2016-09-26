var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@angular/core", "./command.directive", "./config"], function (require, exports, core_1, command_directive_1, config_1) {
    "use strict";
    var CommandModule = (function () {
        function CommandModule() {
        }
        CommandModule.forRoot = function (config) {
            var mergedConfig = Object.assign({}, config_1.COMMAND_DEFAULT_CONFIG, config);
            return {
                ngModule: CommandModule,
                providers: [
                    { provide: config_1.COMMAND_CONFIG, useValue: mergedConfig }
                ]
            };
        };
        CommandModule = __decorate([
            core_1.NgModule({
                declarations: [
                    command_directive_1.CommandDirective
                ],
                providers: [
                    { provide: config_1.COMMAND_CONFIG, useValue: config_1.COMMAND_DEFAULT_CONFIG }
                ],
                exports: [
                    command_directive_1.CommandDirective
                ]
            }), 
            __metadata('design:paramtypes', [])
        ], CommandModule);
        return CommandModule;
    }());
    exports.CommandModule = CommandModule;
});

//# sourceMappingURL=module.js.map
