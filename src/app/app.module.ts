import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionModule, ActionService } from '../modules/action';
import { AppComponent } from './app.component';
import { ChartBarComponent } from './chart-bar/chart-bar.component';
import { ChartBarItemComponent } from './chart-bar/chart-bar-item.component';
import { ChartPieComponent } from './chart-pie/chart-pie.component';
import { ChartPie2Component } from './chart-pie2/chart-pie2.component';
import { ChartPieItemComponent } from './chart-pie/chart-pie-item.component';
import { ChartLineComponent } from './chart-line/chart-line.component';
import { DiagramPipelineComponent } from './diagram-pipeline/diagram-pipeline.component';
import { NodeComponent } from './diagram-pipeline/node/node.component';
import { LinkComponent } from './diagram-pipeline/link/link.component';
import { NgxUIModule } from '@swimlane/ngx-ui';

@NgModule({
  declarations: [
    AppComponent,
    ChartBarComponent,
    ChartBarItemComponent,
    ChartPieComponent,
    ChartPie2Component,
    ChartPieItemComponent,
    ChartLineComponent,
    DiagramPipelineComponent,
    NodeComponent,
    LinkComponent,
  ],
  imports: [
    BrowserModule,
    ActionModule,
    NgxUIModule,
  ],
  providers: [ ActionService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
