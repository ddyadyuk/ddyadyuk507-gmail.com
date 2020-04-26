import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor(private  angularFireAuth: AngularFireAuth,
                private firestore: AngularFirestore) {
    }

    signup(email, password) {
        return this.angularFireAuth
            .createUserWithEmailAndPassword(email, password)
            .then(data => {
                return this.firestore.doc(`users/${data.user.uid}`).set({
                    email: email,
                    display_name: email,
                    status: 'teacher'
                })
            });
    }

    signin(email, password) {
        return this.angularFireAuth.signInWithEmailAndPassword(email, password);
    }

    signout() {
        return this.angularFireAuth.signOut();
    }

    getUserInformation() {
        let uid = null;

        this.angularFireAuth.currentUser.then(userData => {
            uid = userData.uid;
        });

        return this.firestore.doc(`users/${uid}`).valueChanges();
    }

    upadateUserName(name) {
        let uid = null;

        this.angularFireAuth.currentUser.then(userData => {
            uid = userData.uid;
        });

        return this.firestore.doc(`users/${uid}`).update({
            display_name: name
        });
    }

    upadateUserStatus(status) {
        let uid = null;

        this.angularFireAuth.currentUser.then(userData => {
            uid = userData.uid;
        });

        return this.firestore.doc(`users/${uid}`).update({
            status: status
        });
    }

}
