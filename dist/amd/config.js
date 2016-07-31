define(["require", "exports"], function (require, exports) {
    "use strict";
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
    var CommandConfig = (function () {
        function CommandConfig() {
            Object.assign(this, {
                executingCssClass: "executing"
            });
        }
        return CommandConfig;
    }());
    exports.CommandConfig = CommandConfig;
    exports.COMMAND_DEFAULT_CONFIG = new CommandConfig();
});

//# sourceMappingURL=config.js.map
