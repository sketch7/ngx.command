import "rxjs/Rx";

import { Command, ICommand } from "./index";

describe("CommandSpecs", () => {
	let SUT: Command;

	xdescribe("given a non async execute function", () => {
		xdescribe("and execute is invoked", () => {
			xit("should have isExecuting set to true", () => {

			});

			xdescribe("when execute has finished", () => {
				xit("should have isExecuting set to false", () => {

				});
			});
		});
	});

	xdescribe("given canExecute observable is provided", () => {
		xdescribe("when the initial value is false", () => {
			xit("should have canExecute set to false", () => {

			});
		});

		xdescribe("when the initial value is true", () => {
			xit("should have canExecute set to true", () => {

			});
		});

		xdescribe("when the value changes", () => {
			xit("should update canExecute", () => {

			});
		});

		xdescribe("and the value is false", () => {
			xdescribe("when execute is invoked", () => {
				xit("should not execute the provided execute function", () => {

				});
			});
		});

		xdescribe("when canExecute is true", () => {
			xdescribe("and execute is invoked", () => {
				xit("should have canExecute set to false", () => {

				});

				xit("should have isExecuting set to true", () => {

				});
			});

			xdescribe("when execute is finished", () => {
				xit("should have canExecute set to true", () => {

				});

				xit("should have isExecuting set to false", () => {

				});
			});
		});
	});

	xdescribe("given destroy is invoked", () => {
		xit("should destroy successfully", () => {

		});
	});

});