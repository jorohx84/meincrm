import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomercreationComponent } from './customercreation.component';

describe('CustomercreationComponent', () => {
  let component: CustomercreationComponent;
  let fixture: ComponentFixture<CustomercreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomercreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomercreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
