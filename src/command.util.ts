import { CommandDirectiveArg, ICommand } from "./command.model";
import { Command } from "./command";

/** Determines whether the arg object is of type `Command`. */
export function isCommand(arg: any): arg is ICommand {
	return arg instanceof Command;
}

export function isCommandArg(arg: any): arg is CommandDirectiveArg {
	if (arg instanceof Command) {
		return false;
	} else if (arg.execute) {
		return true;
	}
	return false;
}