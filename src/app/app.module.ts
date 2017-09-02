import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionModule } from '../modules/action';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ActionModule,
  ],
  providers: [ AppModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
