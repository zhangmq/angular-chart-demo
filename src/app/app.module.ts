import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionModule, ActionService } from '../modules/action';
import { AppComponent } from './app.component';
import { ChartBarComponent } from './chart-bar/chart-bar.component';
import { ChartBarItemComponent } from './chart-bar/chart-bar-item.component';
import { KeysPipe } from './keys.pipe';
import { ChartPieComponent } from './chart-pie/chart-pie.component';
import { ChartPieItemComponent } from './chart-pie/chart-pie-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartBarComponent,
    ChartBarItemComponent,
    KeysPipe,
    ChartPieComponent,
    ChartPieItemComponent,
  ],
  imports: [
    BrowserModule,
    ActionModule,
  ],
  providers: [ ActionService, KeysPipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
