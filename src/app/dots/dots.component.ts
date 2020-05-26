import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ɵNgClassR2Impl } from '@angular/common';

@Component({
  selector: 'app-dots',
  templateUrl: './dots.component.html',
  styleUrls: ['./dots.component.scss']
})
export class DotsComponent implements OnInit {

  @ViewChild('drawingArea', { static: false }) drawArea: ElementRef;

  settings: Settings;
  constructor(private renderer: Renderer2) {
    this.settings = new Settings();
    this.settings.numberOfRectangle = 1;
    this.settings.numberOfTriangle = 1;
    this.settings.helpSize = true;
    this.settings.helpColor = true;
  }

  ngAfterViewInit() {

  }

  generate(): void {
    for (let i = 0; i < 5; i++) {
      const canvas = this.renderer.createElement('canvas');
      //this.renderer.appendChild(this.drawArea.nativeElement, canvas);
      this.renderer.setProperty(canvas, "height", 200);
      this.renderer.setProperty(canvas, "width", 200);
      
      let url = this.draw(canvas);
      const image = this.renderer.createElement('img');
      this.renderer.setProperty(image, "src", url);
      this.renderer.appendChild(this.drawArea.nativeElement, image);
    }
  }

  ngOnInit() {
    // var canvas = (<HTMLCanvasElement>document.getElementById("canvas"));
    // this.draw(canvas);
  }

  draw(canvas: HTMLCanvasElement): string {
    let pointSize = 2;
    let color = "#ff2626";

    for (let i = 0; i < this.settings.numberOfRectangle; i++) {
      let rectangle = this.getRect(this.getRndInteger(50, 100), this.getRndInteger(50, 100), 50);
      rectangle.forEach(coord => {
        this.drawCoordinates(canvas, coord, pointSize, color);
      });

      if (this.settings.helpColor)
        color = '#' + Math.random().toString(16).substr(2, 6);

      if (this.settings.helpSize === true)
        pointSize++;
    }

    for (let i = 0; i < this.settings.numberOfTriangle; i++) {
      let triangle = this.getTriangle(this.getRndInteger(50, 100), this.getRndInteger(50, 100), 50);
      triangle.forEach(coord => {
        this.drawCoordinates(canvas, coord, pointSize, color);
      });

      if (this.settings.helpColor)
        color = '#' + Math.random().toString(16).substr(2, 6);
      if (this.settings.helpSize === true)
        pointSize++;
    }

    var img = canvas.toDataURL("image/png");
    return img;
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

class Settings {
  numberOfTriangle: number;
  numberOfRectangle: number;

  helpSize: boolean;
  helpColor: boolean;
}

class Coordinate {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;
}
