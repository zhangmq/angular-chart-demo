import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionModule, ActionService } from '../modules/action';
import { AppComponent } from './app.component';
import { ChartBarComponent } from './chart-bar/chart-bar.component';
import { ChartBarItemComponent } from './chart-bar/chart-bar-item.component';
import { ChartPieComponent } from './chart-pie/chart-pie.component';
import { ChartPieItemComponent } from './chart-pie/chart-pie-item.component';
import { ChartLineComponent } from './chart-line/chart-line.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartBarComponent,
    ChartBarItemComponent,
    ChartPieComponent,
    ChartPieItemComponent,
    ChartLineComponent,
  ],
  imports: [
    BrowserModule,
    ActionModule,
  ],
  providers: [ ActionService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
