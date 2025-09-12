import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomertasksComponent } from './customertasks.component';

describe('CustomertasksComponent', () => {
  let component: CustomertasksComponent;
  let fixture: ComponentFixture<CustomertasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomertasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
