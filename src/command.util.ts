import { AbstractControl, AbstractControlDirective } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, distinctUntilChanged, startWith, delay } from "rxjs/operators";

import { CommandCreator, ICommand } from "./command.model";
import { Command } from "./command";

/** Determines whether the arg object is of type `Command`. */
export function isCommand(arg: unknown): arg is ICommand {
	return arg instanceof Command;
}

/** Determines whether the arg object is of type `CommandCreator`. */
export function isCommandCreator(arg: unknown): arg is CommandCreator {
	if (arg instanceof Command) {
		return false;
	} else if (isAssumedType<CommandCreator>(arg) && arg.execute && arg.host) {
		return true;
	}
	return false;
}

export interface CanExecuteFormOptions {
	/** Determines whether to check for validity. (defaults: true) */
	validity?: boolean;

	/** Determines whether to check whether UI has been touched. (defaults: true) */
	dirty?: boolean;
}

/** Get form is valid as an observable. */
export function canExecuteFromNgForm(
	form: AbstractControl | AbstractControlDirective,
	options?: CanExecuteFormOptions
): Observable<boolean> {
	const opts: CanExecuteFormOptions = { validity: true, dirty: true, ...options };

	return form.statusChanges
		? form.statusChanges.pipe(
			delay(0),
			startWith(form.valid),
			map(() => !!(!opts.validity || form.valid) && !!(!opts.dirty || form.dirty)),
			distinctUntilChanged(),
		)
		: of(true);
}

function isAssumedType<T = Record<string, unknown>>(x: unknown): x is Partial<T> {
	return x !== null && typeof x === "object";
}
