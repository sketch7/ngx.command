var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "@angular/core", "./config"], function (require, exports, core_1, config_1) {
    "use strict";
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
    var CommandDirective = (function () {
        function CommandDirective(config, renderer, element) {
            this.config = config;
            this.renderer = renderer;
            this.element = element;
        }
        CommandDirective.prototype.ngOnInit = function () {
            var _this = this;
            // console.log("[commandDirective::init]");
            this.commandOptions = Object.assign({}, this.config, this.commandOptions);
            if (!this.command) {
                throw new Error("[commandDirective] command should be defined!");
            }
            this.canExecute$$ = this.command.canExecute$
                .do(function (x) {
                // console.log("[commandDirective::canExecute$]", x);
                _this.isDisabled = !x;
            }).subscribe();
            this.isExecuting$$ = this.command.isExecuting$
                .do(function (x) {
                // console.log("[commandDirective::isExecuting$]", x);
                _this.renderer.setElementClass(_this.element.nativeElement, _this.commandOptions.executingCssClass, x);
            }).subscribe();
        };
        CommandDirective.prototype.onClick = function () {
            // console.log("[commandDirective::onClick]");
            this.command.execute();
        };
        CommandDirective.prototype.ngOnDestroy = function () {
            // console.log("[commandDirective::destroy]");
            this.command.destroy();
            this.canExecute$$.unsubscribe();
            this.isExecuting$$.unsubscribe();
        };
        __decorate([
            core_1.Input(), 
            __metadata('design:type', Object)
        ], CommandDirective.prototype, "command", void 0);
        __decorate([
            core_1.Input(), 
            __metadata('design:type', Object)
        ], CommandDirective.prototype, "commandOptions", void 0);
        __decorate([
            core_1.HostBinding("disabled"), 
            __metadata('design:type', Boolean)
        ], CommandDirective.prototype, "isDisabled", void 0);
        __decorate([
            core_1.HostListener("click"), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], CommandDirective.prototype, "onClick", null);
        CommandDirective = __decorate([
            core_1.Directive({
                selector: "[command]",
            }),
            __param(0, core_1.Inject(config_1.COMMAND_CONFIG)), 
            __metadata('design:paramtypes', [Object, core_1.Renderer, core_1.ElementRef])
        ], CommandDirective);
        return CommandDirective;
    }());
    exports.CommandDirective = CommandDirective;
});

//# sourceMappingURL=command.directive.js.map
