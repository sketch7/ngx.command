import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommandModule } from "@ssv/ngx.command";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CommandComponent } from "./command/command.component";

@NgModule({
  declarations: [
    AppComponent,
    CommandComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    CommandModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
