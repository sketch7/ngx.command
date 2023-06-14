import { BehaviorSubject, EMPTY } from "rxjs";

import { Command } from "./command";

describe("CommandSpecs", () => {
	let SUT: Command;
	let executeFn: jest.Mock<void, unknown[], unknown> ;
	// let executeSpyFn: jest.SpyInstance<void, unknown[], unknown>;

	beforeEach(() => {
		executeFn = jest.fn();
		// executeSpyFn = executeFn;
	});

	describe("given a command without canExecute$ param", () => {
		beforeEach(() => {
			SUT = new Command(executeFn);
			// executeSpyFn = jest.spyOn(SUT, "execute");
		});

		describe("when command is initialized", () => {
			it("should have canExecute set to true", () => {
				expect(SUT.canExecute).toBe(true);
			});

			it("should have canExecute$ set to true", done => {
				SUT.canExecute$.subscribe(x => {
					expect(x).toBe(true);
					done();
				});
			});
		});

		describe("when execute is invoked", () => {
			beforeEach(() => {
				SUT.execute();
			});

			it("should have isExecuting set to false after execute finishes", () => {
				expect(SUT.isExecuting).toBe(false);
			});

			it("should have canExecute set to true after execute finishes", () => {
				expect(SUT.canExecute).toBe(true);
			});

			it("should invoke execute function", () => {
				expect(executeFn).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("given execute is invoked", () => {
		describe("when canExecute is true", () => {
			beforeEach(() => {
				const isInitialValid = true;
				SUT = new Command(executeFn, new BehaviorSubject<boolean>(isInitialValid));
			});

			it("should invoke execute function passed", () => {
				SUT.execute();
				expect(executeFn).toHaveBeenCalledTimes(1);
			});
		});

		describe("when observable completes", () => {
			beforeEach(() => {
				const isInitialValid = true;
				executeFn = jest.fn().mockImplementation(() => EMPTY);
				SUT = new Command(executeFn, new BehaviorSubject<boolean>(isInitialValid));
			});

			it("should invoke multiple times", () => {
				SUT.execute();
				SUT.execute();
				expect(SUT.isExecuting).toBeFalsy();
				expect(executeFn).toHaveBeenCalledTimes(2);
			});
		});

		describe("when an error is thrown", () => {
			const _errorFn = console.error;
			beforeAll(() => {
				console.error = jest.fn();
			});

			beforeEach(() => {
				const isInitialValid = true;
				executeFn = jest.fn().mockImplementation(() => {
					throw new Error("Execution failed!");
				});
				SUT = new Command(executeFn, new BehaviorSubject<boolean>(isInitialValid));
			});

			it("should invoke multiple times", () => {
				SUT.execute();
				SUT.execute();
				expect(SUT.isExecuting).toBeFalsy();
				expect(executeFn).toHaveBeenCalledTimes(2);
			});

			afterAll(() => {
				console.error = _errorFn;
			});
		});

		describe("when args are passed", () => {
			beforeEach(() => {
				const isInitialValid = true;
				SUT = new Command(executeFn, new BehaviorSubject<boolean>(isInitialValid));
			});

			it("and has 1 param should receive 1 arg", () => {
				const args = { name: "rexxar" };
				SUT.execute(args);
				expect(executeFn).toHaveBeenCalledTimes(1);
				expect(executeFn).toHaveBeenCalledWith(args);
			});

			it("and is array param should not spread", () => {
				const hero = { name: "rexxar" };
				const args = [hero, "yello"];
				SUT.execute(args);
				expect(executeFn).toHaveBeenCalledTimes(1);
				expect(executeFn).toHaveBeenCalledWith([hero, "yello"]);
			});

			it("and multi args are pass should receive all", () => {
				const hero = { name: "rexxar" };
				SUT.execute(hero, "yello");
				expect(executeFn).toHaveBeenCalledTimes(1);
				expect(executeFn).toHaveBeenCalledWith(hero, "yello");
			});
		});

		describe("when canExecute is false", () => {
			beforeEach(() => {
				const isInitialValid = false;
				SUT = new Command(executeFn, new BehaviorSubject<boolean>(isInitialValid));
			});

			it("should not execute the provided execute function", () => {
				SUT.execute();
				expect(executeFn).not.toHaveBeenCalled();
			});
		});
	});

	describe("given canExecute with an initial value of true", () => {
		let canExecute$: BehaviorSubject<boolean>;

		beforeEach(() => {
			const isInitialValid = true;
			canExecute$ = new BehaviorSubject<boolean>(isInitialValid);
			SUT = new Command(executeFn, canExecute$);
		});

		it("should have canExecute set to true", () => {
			expect(SUT.canExecute).toBe(true);
		});

		it("should have canExecute$ set to true", done => {
			SUT.canExecute$.subscribe(x => {
				expect(x).toBe(true);
				done();
			});
		});

		describe("when the canExecute observable changes", () => {
			beforeEach(() => {
				canExecute$.next(false);
			});

			it("should update canExecute", () => {
				expect(SUT.canExecute).toBe(false);
			});

			it("should update canExecute$", done => {
				SUT.canExecute$.subscribe(x => {
					expect(x).toBe(false);
					done();
				});
			});
		});
	});

	describe("given canExecute with an initial value of false", () => {
		beforeEach(() => {
			const isInitialValid = false;
			SUT = new Command(executeFn, new BehaviorSubject<boolean>(isInitialValid));
		});

		it("should have canExecute set to false", () => {
			expect(SUT.canExecute).toBe(false);
		});

		it("should have canExecute$ set to false", done => {
			SUT.canExecute$.subscribe(x => {
				expect(x).toBe(false);
				done();
			});
		});
	});

	describe("given destroy is invoked", () => {
		beforeEach(() => {
			const isInitialValid = false;
			SUT = new Command(executeFn, new BehaviorSubject<boolean>(isInitialValid));
		});

		it("should destroy successfully", () => {
			SUT.destroy();
		});
	});
});
