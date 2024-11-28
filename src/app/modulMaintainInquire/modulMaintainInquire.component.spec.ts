/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModulMaintainInquireComponent } from './modulMaintainInquire.component';

describe('ModulMaintainInquireComponent', () => {
  let component: ModulMaintainInquireComponent;
  let fixture: ComponentFixture<ModulMaintainInquireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulMaintainInquireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulMaintainInquireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
