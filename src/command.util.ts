import { CommandCreator, ICommand } from "./command.model";
import { Command } from "./command";

/** Determines whether the arg object is of type `Command`. */
export function isCommand(arg: any): arg is ICommand {
	return arg instanceof Command;
}

/** Determines whether the arg object is of type `CommandCreator`. */
export function isCommandCreator(arg: any): arg is CommandCreator {
	if (arg instanceof Command) {
		return false;
	} else if (arg.execute) {
		return true;
	}
	return false;
}