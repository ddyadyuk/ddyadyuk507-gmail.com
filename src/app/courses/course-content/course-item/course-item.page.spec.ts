import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CourseItemPage } from './course-item.page';

describe('CourseItemPage', () => {
  let component: CourseItemPage;
  let fixture: ComponentFixture<CourseItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
