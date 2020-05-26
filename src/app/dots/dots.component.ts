import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ɵNgClassR2Impl } from '@angular/common';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dots',
  templateUrl: './dots.component.html',
  styleUrls: ['./dots.component.scss']
})
export class DotsComponent implements OnInit {

  @ViewChild('drawingArea', { static: false }) drawArea: ElementRef;

  isGenerated: boolean;
  settingsForm: FormGroup;

  private handicaps: Array<Handicaps>;
  private shapeSize = 50;
  private colors = ["#262626", "#f20019", "#70fe00", "#0086fe", "#fefe00", "fed38b"];

  constructor(private renderer: Renderer2, private _formBuilder: FormBuilder) {
    this.handicaps = new Array<Handicaps>();
  }

  public get settings(): { [key: string]: AbstractControl } {
    return this.settingsForm.controls;
  }

  generate(): void {
    this.handicaps.length = 0;
    this.handicaps.push(Handicaps.None);

    if (this.settings.hcMissingDot.value === true)
      this.handicaps.push(Handicaps.MissingDot);
    if (this.settings.hcExtraDot.value === true)
      this.handicaps.push(Handicaps.ExtraDot);
    if (this.settings.hcSmallerObject.value === true)
      this.handicaps.push(Handicaps.SmallerShape);
    if (this.settings.hcLargerObject.value === true)
      this.handicaps.push(Handicaps.LargerShape);

    Array.from(this.drawArea.nativeElement.children).forEach(child => {
      this.renderer.removeChild(this.drawArea.nativeElement, child);
    });

    for (let i = 0; i <= this.settings.numberOfExercises.value; i++) {
      const canvas = this.renderer.createElement('canvas');
      //this.renderer.appendChild(this.drawArea.nativeElement, canvas);
      this.renderer.setProperty(canvas, "height", 200);
      this.renderer.setProperty(canvas, "width", 200);

      let url = i == 0 ? this.drawReference(canvas) : this.draw(canvas);
      const image = this.renderer.createElement('img');
      this.renderer.setProperty(image, "src", url);
      this.renderer.setStyle(image, "border", "solid 1px grey");
      this.renderer.appendChild(this.drawArea.nativeElement, image);
    }
    this.isGenerated = true;
  }



  ngOnInit() {
    this.isGenerated = false;
    this.settingsForm = this._formBuilder.group({
      numberOfExercises: [5, Validators.required],
      numberOfRectangles: [1, Validators.compose([Validators.min(0), Validators.max(3), Validators.required])],
      numberOfTriangles: [1, Validators.compose([Validators.min(0), Validators.max(3), Validators.required])],
      helpSize: [false, Validators.required],
      helpColor: [false, Validators.required],
      hcMissingDot: [false, Validators.required],
      hcExtraDot: [false, Validators.required],
      hcSmallerObject: [false, Validators.required],
      hcLargerObject: [false, Validators.required]
    });
  }

  drawReference(canvas: HTMLCanvasElement): string {
    var ctx = canvas.getContext('2d');
    //
    ctx.beginPath();
    ctx.moveTo(125, 75);
    ctx.lineTo(125 + this.shapeSize, 75);
    ctx.lineTo(125, 75 + this.shapeSize);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#666666';
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(25, 75, 50, 50);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#666666';
    ctx.stroke();

    var img = canvas.toDataURL("image/png");
    return img;
  }

  draw(canvas: HTMLCanvasElement): string {
    let pointSize = 2;
    let colornumber = 0;
    let color = this.colors[colornumber];

    let handicappedShape = Math.random() >= 0.5 ? Shape.Rectangle : Shape.Triangle; // true-> rectangle, false -> triangle
    let actualHandicap = this.getHandicap();
    let alreadyHandicapped = actualHandicap == Handicaps.None;

    for (let i = 0; i < this.settings.numberOfRectangles.value; i++) {

      let size = 50;

      // HANDICAP - SMALLER OBJECT
      if (!alreadyHandicapped && handicappedShape == Shape.Rectangle && actualHandicap == Handicaps.LargerShape) {
        size = 70;
        alreadyHandicapped = true;
      }

      // HANDICAP - SMALLER OBJECT
      if (!alreadyHandicapped && handicappedShape == Shape.Rectangle && actualHandicap == Handicaps.SmallerShape) {
        size = 30;
        alreadyHandicapped = true;
      }

      let rectangle = this.getRect(this.getRndInteger(50, 100), this.getRndInteger(50, 100), size);

      // HANDICAP - MISSING DOT
      if (!alreadyHandicapped && handicappedShape == Shape.Rectangle && actualHandicap == Handicaps.MissingDot) {
        rectangle.pop();
        alreadyHandicapped = true;
      }

      // HANDICAP - EXTRA DOT
      if (!alreadyHandicapped && handicappedShape == Shape.Rectangle && actualHandicap == Handicaps.ExtraDot) {
        let randomCoord = new Coordinate(this.getRndInteger(50 - size, 100 - size), this.getRndInteger(50 + size, 100 + size));
        rectangle.push(randomCoord);
        alreadyHandicapped = true;
      }

      rectangle.forEach(coord => {
        this.drawCoordinates(canvas, coord, pointSize, color);
      });


      if (this.settings.helpColor.value)
        color = this.colors[++colornumber];

      if (this.settings.helpSize.value === true)
        pointSize++;
    }

    for (let i = 0; i < this.settings.numberOfTriangles.value; i++) {
      let size = 50;

      // HANDICAP - SMALLER OBJECT
      if (!alreadyHandicapped && handicappedShape == Shape.Triangle && actualHandicap == Handicaps.LargerShape) {
        size = 60;
        alreadyHandicapped = true;
      }

      // HANDICAP - SMALLER OBJECT
      if (!alreadyHandicapped && handicappedShape == Shape.Triangle && actualHandicap == Handicaps.SmallerShape) {
        size = 40;
        alreadyHandicapped = true;
      }

      let triangle = this.getTriangle(this.getRndInteger(50, 100), this.getRndInteger(50, 100), size);

      // HANDICAP - MISSING DOT
      if (!alreadyHandicapped && handicappedShape == Shape.Triangle && actualHandicap == Handicaps.MissingDot) {
        triangle.pop();
        alreadyHandicapped = true;
      }

      // HANDICAP - EXTRA DOT
      if (!alreadyHandicapped && handicappedShape == Shape.Triangle && actualHandicap == Handicaps.ExtraDot) {
        let randomCoord = new Coordinate(this.getRndInteger(50 - size, 100 - size), this.getRndInteger(50 + size, 100 + size));
        triangle.push(randomCoord);
        alreadyHandicapped = true;
      }

      triangle.forEach(coord => {
        this.drawCoordinates(canvas, coord, pointSize, color);
      });

      if (this.settings.helpColor.value)
        color = this.colors[++colornumber];
      if (this.settings.helpSize.value === true)
        pointSize++;
    }

    var img = canvas.toDataURL("image/png");
    return img;
  }


  getHandicap(): Handicaps {
    if (this.handicaps.length === 1)
      return Handicaps.None;

    return this.handicaps[Math.floor(Math.random() * this.handicaps.length)];
  }

  drawCoordinates(canvas: HTMLCanvasElement, coord: Coordinate, pointSize: number, color: string): void {
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = color; // Red color

    ctx.beginPath(); //Start path
    ctx.arc(coord.x, coord.y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.fill(); // Close the path and fill.
  }

  getRect(x: number, y: number, size: number): Coordinate[] {
    var coordinates = new Array<Coordinate>();
    var rotateInDeg = Math.floor(Math.random() * 360);
    var center = new Coordinate(x + size / 2, y + size / 2);

    var r1 = new Coordinate(x, y);
    var r2 = new Coordinate(x + size, y);
    var r3 = new Coordinate(x, y + size);
    var r4 = new Coordinate(x + size, y + size);
    coordinates.push(this.rotatePoint(center, r1, rotateInDeg));
    coordinates.push(this.rotatePoint(center, r2, rotateInDeg));
    coordinates.push(this.rotatePoint(center, r3, rotateInDeg));
    coordinates.push(this.rotatePoint(center, r4, rotateInDeg));

    return coordinates;
  }

  getTriangle(x: number, y: number, size: number): Coordinate[] {
    var coordinates = new Array<Coordinate>();

    var rotateInDeg = Math.floor(Math.random() * 360);
    var center = new Coordinate(x + size / 2, y + size / 2);

    var r1 = new Coordinate(x, y);
    var r2 = new Coordinate(x + size, y);
    var r3 = new Coordinate(x, y + size);

    coordinates.push(this.rotatePoint(center, r1, rotateInDeg));
    coordinates.push(this.rotatePoint(center, r2, rotateInDeg));
    coordinates.push(this.rotatePoint(center, r3, rotateInDeg));

    return coordinates;
  }

  rotatePoint(pivot: Coordinate, point: Coordinate, angle: number): Coordinate {
    var angleInRad = angle * Math.PI / 180;
    var x = Math.round((Math.cos(angleInRad) * (point.x - pivot.x)) - (Math.sin(angleInRad) * (point.y - pivot.y)) + pivot.x);
    var y = Math.round((Math.sin(angleInRad) * (point.x - pivot.x)) + (Math.cos(angleInRad) * (point.y - pivot.y)) + pivot.y);
    return new Coordinate(x, y);
  }
  getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

enum Shape {
  Rectangle,
  Triangle
}

enum Handicaps {
  None = 0,
  MissingDot = 1,
  ExtraDot = 2,
  SmallerShape = 3,
  LargerShape = 4
}

class Coordinate {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;
}
