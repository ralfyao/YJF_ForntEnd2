import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShutdownsettingComponent } from './shutdownsetting.component';

describe('ShutdownsettingComponent', () => {
  let component: ShutdownsettingComponent;
  let fixture: ComponentFixture<ShutdownsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShutdownsettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShutdownsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
