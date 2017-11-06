import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramPipelineComponent } from './diagram-pipeline.component';

describe('DiagramPipelineComponent', () => {
  let component: DiagramPipelineComponent;
  let fixture: ComponentFixture<DiagramPipelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramPipelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramPipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
