import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/auth";
import {FirebaseService} from "../services/firebase.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public loginForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private angularFireAuth: AngularFireAuth,
                private firebaseService: FirebaseService,
                private loadingController: LoadingController,
                private alertController: AlertController,
                private router: Router) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['ddyadyuk507@gmail.com', Validators.compose([Validators.email, Validators.required])],
            password: ['123456', Validators.compose([Validators.minLength(6), Validators.required])]
        })
    }

    async signupUser() {
        const loading = await this.loadingController.create({
            message: 'Please wait...'
        });

        loading.present();

        this.firebaseService.signup(this.loginForm.value.email, this.loginForm.value.password)
            .then(data => {
                    this.router.navigateByUrl('/courses');
                    loading.dismiss();
                },
                err => {
                    loading.dismiss();
                    this.showBasicAlert('Error', err.message);
                });
    }

    async loginUser() {
        const loading = await this.loadingController.create({
            message: 'Please wait...'
        });

        loading.present();

        this.firebaseService.signin(this.loginForm.value.email, this.loginForm.value.password)
            .then(data => {
                    console.log("User's data", data);
                    this.router.navigateByUrl('/courses');
                    loading.dismiss();
                },
                err => {
                    loading.dismiss();
                    this.showBasicAlert('Error', err.message);
                });
    }

    forgetPassword() {
        this.angularFireAuth
            .sendPasswordResetEmail(this.loginForm.value.email)
            .then(() => {
                    this.showBasicAlert('Success', 'Please check your email now.');
                },
                error => {
                    this.showBasicAlert('Error', error.message);
                });
    }

    async showBasicAlert(title, text) {
        const alert = await this.alertController.create({
            header: title,
            message: text,
            buttons: ['OK']
        });

        alert.present();
    }
}
