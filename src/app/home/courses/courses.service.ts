import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Course} from '../models/course.model';
import {HttpClient} from '@angular/common/http';
import {map, take, tap} from 'rxjs/operators';

interface CoursesResponse {
    title: string;
    description: string;
    category: string;
    imgUrl: string;
}


@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private _courses = new BehaviorSubject<Course[]>([]);

    constructor(private httpClient: HttpClient) {
    }

    get courses() {
        return this._courses.asObservable();
    }

    fetchCourses() {
        return this.httpClient.get<{ [key: string]: CoursesResponse }>('https://learning-platform-deb7f.firebaseio.com/courses.json')
            .pipe(
                take(1),
                map(respData => {
                const courses = [];
                console.log(respData);
                for (const key in respData) {
                    if (respData.hasOwnProperty(key)) {
                        courses.push(new Course(
                            key,
                            respData[key].title,
                            respData[key].description,
                            respData[key].category,
                            respData[key].imgUrl
                        ));
                    }
                }
                console.log(courses);
                return courses;
            }), tap(courses => this._courses.next(courses)));
    }
}
