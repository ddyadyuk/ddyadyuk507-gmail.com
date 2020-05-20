import {Component, OnInit} from '@angular/core';
import {CourseDTO, CoursesService} from '../services/courses.service';
import {Platform} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {Category} from "../models/category.model";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-courses',
    templateUrl: './courses.page.html',
    styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

    allCourses: CourseDTO[];
    filteredCourses: CourseDTO[];

    isLoading = false;
    isPhone = false;

    currentCategoryToFilter: string;

    arSub: Subscription;

    constructor(
        private coursesService: CoursesService,
        private platform: Platform,
        private  router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.isLoading = false;
    }

    ionViewWillEnter() {
        this.arSub = this.activatedRoute
            .queryParams
            .subscribe(params => {
                // Defaults to 0 if no query param provided.
                this.currentCategoryToFilter = params['categoryName'];
            });

        this.isPhone = this.platform.is("mobile");
        this.isLoading = true;
        this.isLoading = false;
        this.coursesService.getCourses().subscribe(courses => {

                this.allCourses = courses;
                if (this.currentCategoryToFilter) {
                    this.filteredCourses = this.allCourses
                        .filter(courses => courses.categories.includes(this.currentCategoryToFilter))
                    console.log("Filtered Courses: ", this.filteredCourses);
                }
                console.log("All Courses: ", this.allCourses);
            }
        );


    }

    openCourse(id) {
        this.router.navigateByUrl(`courses/${id}`);
    }

    ionViewWillLeave() {
        this.arSub.unsubscribe();
        this.currentCategoryToFilter = '';
    }
}
