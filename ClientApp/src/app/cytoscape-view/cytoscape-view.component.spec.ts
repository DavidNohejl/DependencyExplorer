import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoscapeViewComponent } from './cytoscape-view.component';

describe('CytoscapeViewComponent', () => {
  let component: CytoscapeViewComponent;
  let fixture: ComponentFixture<CytoscapeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoscapeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoscapeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
