import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglecontactsidebarComponent } from './singlecontactsidebar.component';

describe('SinglecontactsidebarComponent', () => {
  let component: SinglecontactsidebarComponent;
  let fixture: ComponentFixture<SinglecontactsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglecontactsidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglecontactsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
