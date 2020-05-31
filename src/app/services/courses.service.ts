import {Injectable} from '@angular/core';
import {Observable, pipe} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {filter, map} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {AngularFireAuth} from "@angular/fire/auth";
import {CourseModule} from "../models/course-module.model";
import {ModuleItemModel} from "../models/module-item.model";
import {CategoryDTO, CategoryService} from "./category.service";

export interface CourseDTO {
    title: string;
    description: string;
    categories: string[];
    imgUrl: string;
    creator: string;
}

export interface CourseModuleDTO {
    title: string,
    courseId: string,
    moduleNumber: number,
}

export interface ModuleItemDTO {
    title: string,
    moduleId: string,
    content: string
    itemNumber: number
}

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    courses: Observable<any>;
    coursesCollection: AngularFirestoreCollection<CourseDTO>;
    courseModulesCollection: AngularFirestoreCollection<CourseModuleDTO>;

    constructor(private httpClient: HttpClient,
                private firestore: AngularFirestore,
                private auth: AngularFireAuth,
                private categoryService: CategoryService) {
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
        if (newCourse.categories.length > 0 && newCourse.categories[0] !== '') {
            this.categoryService.verifyCategories(newCourse.categories)
        }

        return this.coursesCollection.add({
            title: newCourse.title,
            description: newCourse.description,
            categories: newCourse.categories,
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

        this.categoryService.verifyCategories(newContent.categories)

        return this.firestore.doc(`courses/${id}`).update({
            title: newContent.title,
            description: newContent.description,
            categories: newContent.categories,
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


    getCourseModule(courseId: string) {
        return this.firestore.doc<CourseModule>(`modules/${courseId}`).valueChanges();
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

    updateModule(moduleId: string, newModule: CourseModule) {
        return this.firestore.doc(`modules/${moduleId}`).update({
            title: newModule.title,
            courseId: newModule.courseId,
            moduleNumber: newModule.moduleNumber
        })
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
                    // console.log("ModuleIDs :" + moduleIds + " Deleting module with id: ", moduleIds[moduleIds.length - 1]);
                    this.deleteModuleItems(moduleIds[moduleIds.length - 1]);
                }
            })
    }

    deleteModule(id: string) {
        this.deleteModuleItems(id).then(() => {
            console.log("deleting single module with id:", id);
            return this.firestore.doc(`modules/${id}`).delete();
        });
    }


    //Course Items logic
    addCourseItem(courseItem: ModuleItemDTO) {
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
                    // console.log("Module items ", data);
                    const id = items.payload.doc.id;

                    return {id, ...data}
                }))
            )
    }

    getItem(itemId: string) {
        console.log("inside get item")
        return this.firestore.doc<ModuleItemModel>(`module-items/${itemId}`).valueChanges();
    }

    deleteModuleItem(itemId: string) {
        return this.firestore.doc(`module-items/${itemId}`).delete();
    }

    deleteModuleItems(moduleId: string) {
        return this.firestore.collection("module-items",
            ref => ref.where('moduleId', '==', moduleId))
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    return a.payload.doc.id;
                }))
            )
            .forEach(items => {
                console.log("Deleting item with id: ", items[items.length - 1]);
                this.deleteModuleItem(items[items.length - 1]);
            })
    }

    updateModuleItem(itemId: string, changedData: ModuleItemDTO) {
        return this.firestore.doc(`module-items/${itemId}`).update({
            title: changedData.title,
            moduleId: changedData.moduleId,
            content: changedData.content,
            itemNumber: changedData.itemNumber
        })
    }
}
