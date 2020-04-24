import {Component, OnInit} from '@angular/core';

import {LoadingController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {FirebaseService} from "./services/firebase.service";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    isPhone = false;
    isAuthenticated = false;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private firebaseService: FirebaseService,
        private auth: AngularFireAuth,
        private loadingController: LoadingController
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        this.auth.onAuthStateChanged(user => {
            if (user) {
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;

            }
        });
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
}
