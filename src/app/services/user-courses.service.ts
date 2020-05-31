import {Injectable} from '@angular/core';
import {FirebaseService} from "./firebase.service";
import {AngularFirestore} from "@angular/fire/firestore";
import {UserCourses} from "../models/user-courses.model";
import {map, take} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserCoursesService {

    constructor(private firebaseService: FirebaseService,
                private firestore: AngularFirestore) {
    }

    getUserCourses(userId: string) {
        return this.firestore.doc<UserCourses>(`user-courses/${userId}`)
            .snapshotChanges()
            .pipe(
                take(1),
                map(actions => {

                    const data = actions.payload.data() as UserCourses;
                    if (data) {
                        data.userId = actions.payload.id

                        return {...data}
                    } else {
                        //if there is no userCourses in the DB create one.
                        let userCourses = new UserCourses();
                        userCourses.courses = [];
                        userCourses.userId = userId;
                        this.addCourseToUserList(userCourses);

                        return userCourses;
                    }
                }));
    }

    addCourseToUserList(userCourses: UserCourses) {
        console.log("Adding userCourses:", userCourses);

        this.firestore.doc(`user-courses/${userCourses.userId}`).set({
            courses: userCourses.courses
        })
    }

    deleteCourseFromUsersList(userId: string, courseId: string) {
        this.getUserCourses(userId)
            .subscribe(userCourses => {
                const coursesWithoutGiven = userCourses.courses.filter(course => course.indexOf(courseId) !== -1)

                console.log("The courses without course to delete", coursesWithoutGiven)

                this.firestore.doc(`user-courses/${userId}`).update({
                    courses: coursesWithoutGiven
                })
            });
    }
}
