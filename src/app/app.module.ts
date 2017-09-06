import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionModule, ActionService } from '../modules/action';
import { AppComponent } from './app.component';
import { ChartBarComponent } from './chart-bar.component';
@NgModule({
  declarations: [
    AppComponent,
    ChartBarComponent,
  ],
  imports: [
    BrowserModule,
    ActionModule,
  ],
  providers: [ ActionService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
