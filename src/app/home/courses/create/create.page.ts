import {Component, Input, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from "../../../services/courses.service";
import {NgForm} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/auth";

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
        imgUrl: '',
        creator: null
    };

    constructor(private coursesService: CoursesService,
                private auth: AngularFireAuth) {
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

        let uid = null;

        this.auth.currentUser.then(userData => {
            uid = userData.uid;
        });

        this.coursesService.addCourse(courseCreationForm.value.title,
            courseCreationForm.value.description,
            courseCreationForm.value.category,
            courseCreationForm.value.imgUrl,
            uid
        ).then(respData => {
            console.log("Creation resp: ", respData);
        });


        this.isCourseCreated = true;
    }
}
