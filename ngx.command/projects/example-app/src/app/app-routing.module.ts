import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ExampleCommandComponent } from "./command/example-command.component";

const routes: Routes = [
	{ path: "", component: ExampleCommandComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
