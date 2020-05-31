import {Component, OnInit} from '@angular/core';

import {LoadingController, ModalController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {FirebaseService} from "./services/firebase.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {CourseDTO, CoursesService} from "./services/courses.service";
import {CategoryDTO, CategoryService} from "./services/category.service";
import {Observable} from "rxjs";
import {SearchModalPage} from "./search-modal/search-modal.page";
import {User} from "./models/user.model";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    isPhone = false;
    isAuthenticated = false;
    gotWritePermission = false;

    categories: Observable<CategoryDTO[]>

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private firebaseService: FirebaseService,
        private auth: AngularFireAuth,
        private loadingController: LoadingController,
        private router: Router,
        private coursesService: CoursesService,
        private categoryService: CategoryService,
        private modalController: ModalController,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

        this.auth.onAuthStateChanged(user => {
            if (user) {
                let userInformation: User;
                this.firebaseService.getUserInformation(user.uid).subscribe(user => {
                    userInformation = user
                    console.log("Current user:", user)
                    this.gotWritePermission = userInformation.status === "teacher" ? true : false;
                });

                console.log("We've got a user");
                this.isAuthenticated = true;
                this.router.navigate(['/courses']);
            } else {
                console.log("There is no  user");
                this.isAuthenticated = false;
                this.router.navigate(['/courses']);
            }
        })

        this.categories = this.categoryService.categoriesObs;
    }

    ngOnInit() {
        this.isPhone = this.platform.is("mobile");
    }

    ionViewWillEnter() {
        this.isPhone = this.platform.is("mobile");
    }

    async logout() {

        const loading = await this.loadingController.create({
            message: 'Signing out...'
        });

        loading.present();

        this.firebaseService.signout().then(() => {
            console.log("Logged out");
            this.isAuthenticated = false;
            loading.dismiss();
        }, err => {
            loading.dismiss();
            console.log("Error occurred:", err.message)
        });


    }

    onCreate() {
        let newCoueseId = 'unset';

        const newCourse: CourseDTO = {
            title: '',
            description: '',
            categories: [],
            imgUrl: '',
            creator: ''
        };

        this.coursesService.addCourse(newCourse).then(courseData => {
            console.log("Returned Course Data", courseData.id);
            newCoueseId = courseData.id;
            console.log("New Course id", newCoueseId);
        }).then(() => {
            this.router.navigateByUrl(`courses/modify/${newCoueseId}`).catch(reason => {
                console.log("Reason ", reason);
            });
        });
    }

    async onSearch() {
        const searchModal = await this.modalController.create({
            component: SearchModalPage,
            cssClass: 'search-modal'
        })

        searchModal.present();
    }


    presentCategories() {
        this.router.navigateByUrl('categories');
    }
}
