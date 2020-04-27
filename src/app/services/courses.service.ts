import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {CourseModule} from "../models/course-module.model";
import {ModuleItemModel} from "../models/module-item.model";

export interface CourseDTO {
    title: string;
    description: string;
    category: string;
    imgUrl: string;
    creator: string;
}

export interface CourseModuleDTO {
    title: string,
    courseId: string,
    moduleNumber: number,
}


export interface CourseItemDTO {
    title: string,
    moduleId: string,
    content: string
    itemNumber: number
}
@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    courses: Observable<CourseDTO[]>;
    coursesCollection: AngularFirestoreCollection<CourseDTO>;
    courseModulesCollection: AngularFirestoreCollection<CourseModuleDTO>;

    constructor(private httpClient: HttpClient,
                private firestore: AngularFirestore,
                private auth: AngularFireAuth) {
        //courses setup
        this.coursesCollection = this.firestore.collection<CourseDTO>('courses');
        this.courses = this.coursesCollection.snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as CourseDTO;
                    const id = a.payload.doc.id;

                    return {id, ...data};
                }))
            );

        //courseModules setup
        this.courseModulesCollection = this.firestore.collection<CourseModuleDTO>('modules');
    }

    //Course logic
    addCourse(newCourse: CourseDTO) {

        return this.coursesCollection.add({
            title: newCourse.title,
            description: newCourse.description,
            category: newCourse.category,
            imgUrl: newCourse.imgUrl,
            creator: newCourse.creator
        });
    }

    getCourses() {
        return this.courses;
    }

    getCourse(id: string) {
        return this.firestore.doc<CourseDTO>(`courses/${id}`).valueChanges();
    }

    deleteCourse(id: string) {
        return this.firestore.doc(`courses/${id}`).delete();
    }

    updateCourse(id: string, newContent: CourseDTO) {
        return this.firestore.doc(`courses/${id}`).update({
            title: newContent.title,
            description: newContent.description,
            category: newContent.category,
            imgUrl: newContent.imgUrl,
            creator: newContent.creator
        })
    }

    //Course item logic
    addModule(courseModule: CourseModuleDTO) {
        return this.courseModulesCollection.add({
            title: courseModule.title,
            courseId: courseModule.courseId,
            moduleNumber: courseModule.moduleNumber,
        });
    }

    getCourseModules(courseId) {
        return this
            .firestore.collection('modules',
                ref => ref
                    .where('courseId', "==", courseId)
                    .orderBy('moduleNumber')
            )
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(module => {
                    const data = module.payload.doc.data() as CourseModule;
                    data.open = false;
                    const id = module.payload.doc.id;
                    return {id, ...data}
                }))
            )
    }

    deleteCourseModules(courseId) {
        this.firestore
            .collection('modules', ref => ref.where('courseId', "==", courseId))
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(module => {

                    return module.payload.doc.id;
                })))
            .forEach(moduleIds => {
                if (moduleIds.length > 0) {
                    console.log("ModuleIDs :" + moduleIds + " Deleting module with id: ", moduleIds[moduleIds.length - 1]);

                    this.firestore.doc(`modules/${moduleIds[moduleIds.length - 1]}`).delete();
                }
            })
    }

    deleteModule(id: string) {
        console.log("deleting single module with id:", id);
        return this.firestore.doc(`modules/${id}`).delete();
    }


    //Course Items logic

    addCourseItem(courseItem: CourseItemDTO) {
        return this.firestore.collection("module-items").add({
            moduleId: courseItem.moduleId,
            content: courseItem.content,
            itemNumber: courseItem.itemNumber,
            title: courseItem.title
        })
    }

    getModuleItems(moduleId: string) {
        return this
            .firestore
            .collection("module-items", ref => ref
                .where('moduleId', '==', moduleId)
                .orderBy('itemNumber')).snapshotChanges()
            .pipe(
                map(actions => actions.map(items => {
                    const data = items.payload.doc.data() as ModuleItemModel;
                    data.open = false;
                    console.log("Module items ", data);
                    const id = items.payload.doc.id;

                    return {id, ...data}
                }))
            )
    }
}
