import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerssidebarComponent } from './customerssidebar.component';

describe('CustomerssidebarComponent', () => {
  let component: CustomerssidebarComponent;
  let fixture: ComponentFixture<CustomerssidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerssidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerssidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
