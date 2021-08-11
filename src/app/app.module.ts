// Module Imports
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "src/environments/environment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

// Firebase
import { AngularFireModule } from "@angular/fire";
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
  UserTrackingService,
} from "@angular/fire/analytics";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireAuthGuardModule } from "@angular/fire/auth-guard";
import { AngularFirestoreModule } from "@angular/fire/firestore";

// Material
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ColorPickerModule } from "ngx-color-picker";

// Components
import { TitlebarComponent } from "./components/titlebar/titlebar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AboutComponent } from "./pages/about/about.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { ListOverviewComponent } from "./components/list-overview/list-overview.component";
import { ListComponent } from "./pages/list/list.component";
import { LoadingOverlayComponent } from "./components/loading-overlay/loading-overlay.component";
import { ShareDialogComponent } from "./components/share-dialog/share-dialog.component";
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    TitlebarComponent,
    FooterComponent,
    AboutComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    ListOverviewComponent,
    ListComponent,
    LoadingOverlayComponent,
    ShareDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    ColorPickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthGuardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
