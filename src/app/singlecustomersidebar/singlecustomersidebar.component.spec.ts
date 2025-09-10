import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglecustomersidebarComponent } from './singlecustomersidebar.component';

describe('SinglecustomersidebarComponent', () => {
  let component: SinglecustomersidebarComponent;
  let fixture: ComponentFixture<SinglecustomersidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglecustomersidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglecustomersidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
