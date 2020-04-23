import {Component, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from "../courses.service";
import {ActivatedRoute} from "@angular/router";
import {Platform} from "@ionic/angular";

@Component({
    selector: 'app-course-content',
    templateUrl: './course-content.page.html',
    styleUrls: ['./course-content.page.scss'],
})
export class CourseContentPage implements OnInit {

    course: CourseDTO = {
        title: '',
        category: '',
        imgUrl: '',
        description: ''
    };
    courseId: string;

    isPhone = false;

    constructor(private coursesService: CoursesService,
                private activatedRoute: ActivatedRoute,
                private platform: Platform) {
    }

    ngOnInit() {
        this.courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
        this.isPhone = this.platform.is("mobile");

        if (this.courseId) {
            this.coursesService.getCourse(this.courseId).subscribe(course => {
                this.course.title = course['title'];
                this.course.category = course['category'];
                this.course.imgUrl = course['imgUrl'];
                this.course.description = course['description'];
            })
        }
    }


}
