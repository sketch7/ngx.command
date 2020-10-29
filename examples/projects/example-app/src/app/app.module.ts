import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { SsvCommandModule } from "@ssv/ngx.command";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ExampleCommandComponent } from "./command/example-command.component";

const materialModules = [
	MatButtonModule,
	MatProgressSpinnerModule,
	MatIconModule,
	MatCardModule,
];

@NgModule({
	declarations: [
		AppComponent,
		ExampleCommandComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,

		SsvCommandModule.forRoot({
			executingCssClass: "is-busy"
		}),
		materialModules,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
