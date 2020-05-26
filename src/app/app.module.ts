import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DotsComponent } from './dots/dots.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxPrintModule} from 'ngx-print';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule } from  '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DotsComponent
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
    NgxPrintModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
