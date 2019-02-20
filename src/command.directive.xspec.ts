// import {Observable} from "rxjs/Observable";
// import {inject, addProviders, async} from "@angular/core/testing";
// import {TestComponentBuilder, ComponentFixture} from "@angular/compiler/testing";
// import {Component, provide} from "@angular/core";

// import {Command, ICommand, CommandDirective} from "./index";

// @Component({
// 	template: `<button class="btn" [ssvCommand]="saveCmd" >Save</button>`,
// 	directives: [
// 		CommandDirective
// 	]
// })
// class TestContainer {
// 	saveCmd = new Command(() => Observable.of("yey").delay(2000), null, true);
// }

// @Component({
// 	template: `<button class="btn" [ssvCommand]="emptyCmd" >Save</button>`,
// 	directives: [
// 		CommandDirective
// 	]
// })
// class NullCommandTestContainer {

// }

// describe("CommandDirectiveSpecs", () => {

// 	let testComponentBuilder: TestComponentBuilder;

// 	beforeEach(inject([
// 		TestComponentBuilder
// 	], (
// 		_testComponentBuilder: TestComponentBuilder
// 	) => {
// 			testComponentBuilder = _testComponentBuilder;
// 		})
// 	);

// 	describe("given an undefined command", () => {
// 		xit("should throw error", async(() => {
// 			testComponentBuilder
// 				.createAsync(NullCommandTestContainer)
// 				.then((fixture: ComponentFixture<NullCommandTestContainer>) => {
// 					expect(() => {
// 						fixture.detectChanges();
// 					}).toThrowError("[commandDirective] command should be defined!");
// 				});

// 		}));
// 	});

// 	describe("given command isExecuting is set to true", () => {
// 		xit("should have element disabled", async(() => {
// 			testComponentBuilder
// 				.createAsync(TestContainer)
// 				.then((fixture: ComponentFixture<TestContainer>) => {
// 					fixture.detectChanges();
// 					let container = fixture.componentInstance as TestContainer;
// 					let element = fixture.debugElement.nativeElement.querySelector("button");
// 					element.click();
// 					fixture.detectChanges();
// 					expect(element).toBeDisabled();
// 				});
// 		}));

// 		xit("should have executingCssClass added", () => {

// 		});

// 		xdescribe("when isExecuting has been finished", () => {
// 			xit("should have element enabled", () => {

// 			});

// 			xit("should have executingCssClass removed", () => {

// 			});
// 		});
// 	});

// 	xdescribe("given command canExecute is set to true", () => {
// 		xit("should have element enabled", () => {

// 		});
// 	});

// 	xdescribe("given command canExecute is set to false", () => {
// 		xit("should have element disabled", () => {

// 		});
// 	});

// 	xdescribe("given commandOptions are provided", () => {
// 		xdescribe("when isExecuting is set true", () => {
// 			xit("should have executingCssClass added with the provided option", () => {

// 			});
// 		});

// 	});


// });