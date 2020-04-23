import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CourseContentPage } from './course-content.page';

describe('CourseContentPage', () => {
  let component: CourseContentPage;
  let fixture: ComponentFixture<CourseContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseContentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
