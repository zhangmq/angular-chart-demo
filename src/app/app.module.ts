import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionModule, ActionService } from '../modules/action';
import { AppComponent } from './app.component';
import { ChartBarComponent } from './chart-bar.component';
import { ChartBarItemComponent } from './chart-bar-item.component';
import { KeysPipe } from './keys.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ChartBarComponent,
    ChartBarItemComponent,
    KeysPipe,
  ],
  imports: [
    BrowserModule,
    ActionModule,
  ],
  providers: [ ActionService, KeysPipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
