import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Course} from '../models/course.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {CourseItem} from "../models/course-item.model";
import {AngularFirestore} from "@angular/fire/firestore";

export interface CourseDTO {
    title: string;
    description: string;
    category: string;
    imgUrl: string;
    creator: any;
}

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private _courses = new BehaviorSubject<Course[]>([]);
    private _course_items = new BehaviorSubject<CourseItem[]>([]);

    constructor(private httpClient: HttpClient,
                private firestore: AngularFirestore) {
    }

    get courses() {
        return this._courses.asObservable();
    }

    get courseItems() {


        return this._course_items.asObservable();
    }


    //Course logic
    addCourse(title: string,
              description: string,
              category: string,
              imgUrl: string,
              creatorId: any) {

        return this.firestore.collection("courses").add({
            title: title,
            description: description,
            category: category,
            imgUrl: imgUrl,
            creatorId: creatorId
        })
    }

    fetchCourses() {
        return this.firestore.collection("courses")
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;

                    return {id, ...data};
                }))
            );
    }

    getCourse(id: string) {
        return this.firestore.doc(`courses/${id}`).valueChanges();
    }

    deleteCourse(id: string) {
        return this.firestore.doc(`courses/${id}`).delete();
    }

    updateCourse(id: string, newContent: CourseDTO) {
        return this.firestore.doc(`courses/${id}`).update({
            title: newContent.title,
            description: newContent.description,
            category: newContent.category,
            imgUrl: newContent.imgUrl
        })
    }

    //Course item logic

    addCourseItem(courseId: string, content: string) {
        let generatedId;

        const newCourseItem = new CourseItem(
            Math.random().toString(),
            content,
            courseId);

        return this.httpClient
            .post<{ name: string }>('https://learning-platform-deb7f.firebaseio.com/course-items.json',
                {...newCourseItem, id: null})
            .pipe(
                switchMap(responseData => {
                    generatedId = responseData.name;

                    return this.courseItems;
                }),
                take(1),
                tap(courseItems => {
                    this._course_items.next(courseItems.concat(newCourseItem))
                })
            )
    }

    findCourseItemsByCourseId(courseId: string) {
        return this.httpClient.get(`https://learning-platform-deb7f.firebaseio.com/course-items/${courseId}.json`)
            .pipe(take(1),
                tap(responseData => {
                    console.log(responseData);
                }))
    }
}
