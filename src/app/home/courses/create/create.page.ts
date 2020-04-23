import {Component, Input, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from "../courses.service";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-create',
    templateUrl: './create.page.html',
    styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
    @Input() courseId;
    isCourseCreated = false;

    newCourse: CourseDTO = {
        title: '',
        description: '',
        category: '',
        imgUrl: ''
    };

    constructor(private coursesService: CoursesService) {
    }

    ngOnInit() {
    }


    createCourseModule() {
        console.log("Creating course module...");
    }


    createCourse(courseCreationForm: NgForm) {
        if (!courseCreationForm.valid) {
            return;
        }

        this.coursesService.addCourse(courseCreationForm.value.title,
            courseCreationForm.value.description,
            courseCreationForm.value.category,
            courseCreationForm.value.imgUrl);

        this.isCourseCreated = true;
    }
}
