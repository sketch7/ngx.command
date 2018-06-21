import { BehaviorSubject } from "rxjs";

import { Command } from "./index";

describe("CommandSpecs", () => {
	let SUT: Command;
	let executeSpyFn: jasmine.Spy;

	beforeEach(() => {
		executeSpyFn = jasmine.createSpy("execute").and.callThrough();
	});

	describe("given a command without canExecute$ param", () => {
		beforeEach(() => {
			SUT = new Command(executeSpyFn);
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
				expect(executeSpyFn).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe("given execute is invoked", () => {
		describe("when canExecute is true", () => {
			beforeEach(() => {
				const isInitialValid = true;
				SUT = new Command(executeSpyFn, new BehaviorSubject<boolean>(isInitialValid));
			});

			it("should invoke execute function passed", () => {
				SUT.execute();
				expect(executeSpyFn).toHaveBeenCalledTimes(1);
			});
		});

		describe("when canExecute is false", () => {
			beforeEach(() => {
				const isInitialValid = false;
				SUT = new Command(executeSpyFn, new BehaviorSubject<boolean>(isInitialValid));
			});

			it("should not execute the provided execute function", () => {
				SUT.execute();
				expect(executeSpyFn).not.toHaveBeenCalled();
			});
		});
	});

	describe("given canExecute with an initial value of true", () => {
		let canExecute$: BehaviorSubject<boolean>;

		beforeEach(() => {
			const isInitialValid = true;
			canExecute$ = new BehaviorSubject<boolean>(isInitialValid);
			SUT = new Command(executeSpyFn, canExecute$);
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
			SUT = new Command(executeSpyFn, new BehaviorSubject<boolean>(isInitialValid));
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
			SUT = new Command(executeSpyFn, new BehaviorSubject<boolean>(isInitialValid));
		});

		it("should destroy successfully", () => {
			SUT.destroy();
		});
	});
});
