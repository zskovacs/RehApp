import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DotsComponent } from './dots/dots.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxPrintModule} from 'ngx-print';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonToggleModule } from  '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MirrorComponent } from './mirror/mirror.component';

@NgModule({
  declarations: [
    AppComponent,
    DotsComponent,
    MirrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule, 
    MatSidenavModule, 
    MatListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    NgxPrintModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
