import { Component, OnInit, ElementRef, ViewChild, Renderer2, inject } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPrintModule } from 'ngx-print';

import { Vector2D } from '../shared/models/vector2d';
import { Handicap } from './models/handicap';
import { Shape } from './models/shape';

type Rectangle = [Vector2D, Vector2D, Vector2D, Vector2D];
type Triangle = [Vector2D, Vector2D, Vector2D];

@Component({
  selector: 'app-dots',
  templateUrl: './dots.component.html',
  styleUrls: ['./dots.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
    TranslateModule,
    NgxPrintModule
  ]
})
export class DotsComponent implements OnInit {
  private renderer = inject(Renderer2);
  private _formBuilder = inject(FormBuilder);

  @ViewChild('drawingArea', { static: false }) drawArea!: ElementRef;

  public isGenerated: boolean = false;
  public settingsForm!: FormGroup;

  private handicaps: Array<Handicap> = [];
  private readonly shapeSize = 50;
  private readonly width = 200;
  private readonly height = 200;

  private colors = ["#262626", "#f20019", "#70fe00", "#0086fe", "#fefe00", "fed38b"];

  constructor() {
    // Init logic handled in field declarations or ngOnInit
  }

  public get settings(): { [key: string]: AbstractControl } {
    return this.settingsForm.controls;
  }

  ngOnInit() {
    this.isGenerated = false;
    this.settingsForm = this._formBuilder.group({
      numberOfExercises: [11, Validators.required],
      numberOfRectangles: ["1", Validators.compose([Validators.min(0), Validators.max(3), Validators.required])],
      numberOfTriangles: ["1", Validators.compose([Validators.min(0), Validators.max(3), Validators.required])],
      helpSize: [false, Validators.required],
      helpColor: [false, Validators.required],
      hcMissingDot: [false, Validators.required],
      hcExtraDot: [false, Validators.required],
      hcSmallerObject: [false, Validators.required],
      hcLargerObject: [false, Validators.required]
    });
  }

  public generate(): void {
    this.handicaps.length = 0;
    this.handicaps.push(Handicap.None);

    if (this.settings['hcMissingDot'].value === true)
      this.handicaps.push(Handicap.MissingDot);
    if (this.settings['hcExtraDot'].value === true)
      this.handicaps.push(Handicap.ExtraDot);
    if (this.settings['hcSmallerObject'].value === true)
      this.handicaps.push(Handicap.SmallerShape);
    if (this.settings['hcLargerObject'].value === true)
      this.handicaps.push(Handicap.LargerShape);

    //Clear Drawing Area
    Array.from(this.drawArea.nativeElement.children).forEach(child => {
      this.renderer.removeChild(this.drawArea.nativeElement, child);
    });

    for (let i = 0; i <= this.settings['numberOfExercises'].value; i++) {
      const canvas = this.renderer.createElement('canvas');
      //this.renderer.appendChild(this.drawArea.nativeElement, canvas);
      this.renderer.setProperty(canvas, "height", this.height);
      this.renderer.setProperty(canvas, "width", this.width);

      let url = i == 0 ? this.drawReference(canvas) : this.drawShapes(canvas);
      const image = this.renderer.createElement('img');
      this.renderer.setProperty(image, "src", url);
      this.renderer.setStyle(image, "border", "solid 1px grey");
      this.renderer.setStyle(image, "margin", "5px");
      this.renderer.appendChild(this.drawArea.nativeElement, image);
    }
    this.isGenerated = true;
  }

  private drawReference(canvas: HTMLCanvasElement): string {
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    for (let i = 0; i < this.settings['numberOfTriangles'].value; i++) {
      ctx.beginPath();
      ctx.moveTo(8.3 + (i * 58.3), 125);
      ctx.lineTo(8.3 + this.shapeSize + (i * 58.3), 125);
      ctx.lineTo(8.3 + (i * 58.3), 125 + this.shapeSize);
      ctx.closePath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#666666';
      ctx.stroke();
    }

    for (let i = 0; i < this.settings['numberOfRectangles'].value; i++) {
      ctx.beginPath();
      ctx.rect(8.3 + (i * 58.3), 25, 50, 50);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#666666';
      ctx.stroke();
    }

    let img = canvas.toDataURL("image/png");
    return img;
  }

  private drawShapes(canvas: HTMLCanvasElement): string {
    let pointSize = 2;
    let colornumber = 0;
    let color = this.colors[colornumber];

    let handicappedShape = Math.random() >= 0.5 ? Shape.Rectangle : Shape.Triangle; // true-> rectangle, false -> triangle
    let actualHandicap = this.getHandicap();
    let alreadyHandicapped = actualHandicap == Handicap.None;

    for (let i = 0; i < this.settings['numberOfRectangles'].value; i++) {

      let size = 50;

      // HANDICAP - SMALLER OBJECT
      if (!alreadyHandicapped && handicappedShape == Shape.Rectangle && actualHandicap == Handicap.LargerShape) {
        size = 70;
        alreadyHandicapped = true;
      }

      // HANDICAP - SMALLER OBJECT
      if (!alreadyHandicapped && handicappedShape == Shape.Rectangle && actualHandicap == Handicap.SmallerShape) {
        size = 30;
        alreadyHandicapped = true;
      }

      let rectangle = this.getRectangle(this.getRandomPoint(50, 100), size);

      // HANDICAP - MISSING DOT
      if (!alreadyHandicapped && handicappedShape == Shape.Rectangle && actualHandicap == Handicap.MissingDot) {
        rectangle.pop();
        alreadyHandicapped = true;
      }

      // HANDICAP - EXTRA DOT
      if (!alreadyHandicapped && handicappedShape == Shape.Rectangle && actualHandicap == Handicap.ExtraDot) {
        rectangle.push(this.getRandomPoint(50, 100, size));
        alreadyHandicapped = true;
      }

      rectangle.forEach(coord => {
        this.drawCoordinates(canvas, coord, pointSize, color);
      });


      if (this.settings['helpColor'].value)
        color = this.colors[++colornumber];

      if (this.settings['helpSize'].value === true)
        pointSize++;
    }

    for (let i = 0; i < this.settings['numberOfTriangles'].value; i++) {
      let size = 50;

      // HANDICAP - SMALLER OBJECT
      if (!alreadyHandicapped && handicappedShape == Shape.Triangle && actualHandicap == Handicap.LargerShape) {
        size = 60;
        alreadyHandicapped = true;
      }

      // HANDICAP - SMALLER OBJECT
      if (!alreadyHandicapped && handicappedShape == Shape.Triangle && actualHandicap == Handicap.SmallerShape) {
        size = 40;
        alreadyHandicapped = true;
      }

      let triangle = this.getTriangle(this.getRandomPoint(50, 100), size);

      // HANDICAP - MISSING DOT
      if (!alreadyHandicapped && handicappedShape == Shape.Triangle && actualHandicap == Handicap.MissingDot) {
        triangle.pop();
        alreadyHandicapped = true;
      }

      // HANDICAP - EXTRA DOT
      if (!alreadyHandicapped && handicappedShape == Shape.Triangle && actualHandicap == Handicap.ExtraDot) {
        triangle.push(this.getRandomPoint(50, 100, size));
        alreadyHandicapped = true;
      }

      triangle.forEach(coord => {
        this.drawCoordinates(canvas, coord, pointSize, color);
      });

      if (this.settings['helpColor'].value)
        color = this.colors[++colornumber];
      if (this.settings['helpSize'].value === true)
        pointSize++;
    }

    let img = canvas.toDataURL("image/png");
    return img;
  }

  private getHandicap(): Handicap {
    if (this.handicaps.length === 1)
      return Handicap.None;

    return this.handicaps[Math.floor(Math.random() * this.handicaps.length)];
  }

  private drawCoordinates(canvas: HTMLCanvasElement, coord: Vector2D, pointSize: number, color: string): void {
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.fillStyle = color; // Red color

    ctx.beginPath(); //Start path
    ctx.arc(coord.x, coord.y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.fill(); // Close the path and fill.
  }

  private getRectangle(startPoint: Vector2D, size: number): Rectangle {
    let rotateInDeg = Math.floor(Math.random() * 360);
    let center = new Vector2D(startPoint.x + size / 2, startPoint.y + size / 2);

    let r1 = new Vector2D(startPoint.x, startPoint.y);
    let r2 = new Vector2D(startPoint.x + size, startPoint.y);
    let r3 = new Vector2D(startPoint.x, startPoint.y + size);
    let r4 = new Vector2D(startPoint.x + size, startPoint.y + size);

    return [
      this.rotatePoint(center, r1, rotateInDeg),
      this.rotatePoint(center, r2, rotateInDeg),
      this.rotatePoint(center, r3, rotateInDeg),
      this.rotatePoint(center, r4, rotateInDeg)];
  }

  private getTriangle(startPoint: Vector2D, size: number): Triangle {
    let rotateInDeg = Math.floor(Math.random() * 360);
    let center = new Vector2D(startPoint.x + size / 2, startPoint.y + size / 2);

    let r1 = new Vector2D(startPoint.x, startPoint.y);
    let r2 = new Vector2D(startPoint.x + size, startPoint.y);
    let r3 = new Vector2D(startPoint.x, startPoint.y + size);

    return [
      this.rotatePoint(center, r1, rotateInDeg),
      this.rotatePoint(center, r2, rotateInDeg),
      this.rotatePoint(center, r3, rotateInDeg)];
  }

  private getRandomPoint(min: number, max: number, treshold: number = 0): Vector2D {
    return new Vector2D(this.getRndInteger(min - treshold, max - treshold), this.getRndInteger(min + treshold, max + treshold));
  }

  private rotatePoint(pivot: Vector2D, point: Vector2D, angle: number): Vector2D {
    let angleInRad = angle * Math.PI / 180;
    let x = Math.round((Math.cos(angleInRad) * (point.x - pivot.x)) - (Math.sin(angleInRad) * (point.y - pivot.y)) + pivot.x);
    let y = Math.round((Math.sin(angleInRad) * (point.x - pivot.x)) + (Math.cos(angleInRad) * (point.y - pivot.y)) + pivot.y);
    return new Vector2D(x, y);
  }

  private getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
