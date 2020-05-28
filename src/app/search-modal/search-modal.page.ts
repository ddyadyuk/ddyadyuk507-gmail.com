import {Component, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from "../services/courses.service";
import {ModalController} from "@ionic/angular";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {IonicSelectableComponent} from "ionic-selectable";
import {Course} from "../models/course.model";

@Component({
    selector: 'app-search-modal',
    templateUrl: './search-modal.page.html',
    styleUrls: ['./search-modal.page.scss'],
})
export class SearchModalPage implements OnInit {

    courses: Course[];
    previewCourses: CourseDTO[];
    selectedCourse: Course;

    coursesSub: Subscription;
    previewSub: Subscription;

    constructor(private coursesService: CoursesService,
                private modalController: ModalController,
                private router: Router) {
    }

    ngOnInit() {
        this.previewSub = this.coursesService.courses.subscribe(courses => {
            this.previewCourses = courses;
        })
    }

    ionViewOnWillLeave() {
        this.previewSub.unsubscribe();
        this.coursesSub.unsubscribe();
    }

    cancel() {
        console.log("Dismissing modal")
        this.modalController.dismiss();
    }

    onCourseSelect(courseId: string) {
        console.log("Selected CourseId: ", courseId);
        this.router.navigateByUrl(`/courses/${courseId}`)
    }

    filterCourses(courses: CourseDTO[], text: string) {

        const filteredCourses = courses.filter(course => {
            console.log("Filtering by text: ", text)
            return (course.title.toLowerCase().indexOf(text) !== -1 ||
                course.categories.indexOf(text) !== -1);
        });

        console.log("Filtered Courses: ", filteredCourses)
        return filteredCourses;
    }

    searchCourse(event: { component: IonicSelectableComponent; text: string }) {
        let text = event.text.trim().toLowerCase();
        event.component.startSearch();

        // Close any running subscription.
        if (this.coursesSub) {
            this.coursesSub.unsubscribe();
        }

        if (!text) {
            // Close any running subscription.
            if (this.coursesSub) {
                this.coursesSub.unsubscribe();
            }

            event.component.items = [];
            event.component.endSearch();
            return;
        }

        this.coursesSub = this.coursesService.courses.subscribe(courses => {

            console.log("Courses in Search modal: ", courses);

            event.component.items =
                this.filterCourses(courses, text);

            event.component.endSearch();
        })
    }

    onItemSelected(event: { component: IonicSelectableComponent; item: Course }) {
        console.log("selected course:", event.item);
        if (event.item) {
            this.redirectToCourse(event.item);
        }
    }

    redirectToCourse(course: Course) {
        setTimeout(() => this.cancel(), 300)
        if (course) {
            this.router.navigateByUrl(`courses/${course.id}`);
        }
    }
}
