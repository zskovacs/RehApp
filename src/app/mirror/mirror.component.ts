import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Vector2D } from '../shared/models/vector2d';

@Component({
  selector: 'app-mirror',
  templateUrl: './mirror.component.html',
  styleUrls: ['./mirror.component.scss']
})

export class MirrorComponent implements OnInit {

  @ViewChild('drawingArea', { static: false }) drawArea: ElementRef;

  public isGenerated: boolean;
  public settingsForm: FormGroup;

  private readonly width = 200;
  private readonly height = 200;
  private readonly step = 20;

  constructor(private renderer: Renderer2, private _formBuilder: FormBuilder) {

  }

  public get settings(): { [key: string]: AbstractControl } {
    return this.settingsForm.controls;
  }

  ngOnInit() {
    this.settingsForm = this._formBuilder.group({
      numberOfExercises: [12, Validators.required],
      vertices: ["3", Validators.compose([Validators.min(3), Validators.max(10), Validators.required])],
      helpPoints: [false, Validators.required],
      hcNoGrid: [false, Validators.required],
      hcOblique: [false, Validators.required]
    });
  }

  public generate(): void {
    //Clear Drawing Area
    Array.from(this.drawArea.nativeElement.children).forEach(child => {
      this.renderer.removeChild(this.drawArea.nativeElement, child);
    });

    for (let i = 0; i < this.settings.numberOfExercises.value; i++) {
      const canvas = this.renderer.createElement('canvas');
      //this.renderer.appendChild(this.drawArea.nativeElement, canvas);
      this.renderer.setProperty(canvas, "height", this.height);
      this.renderer.setProperty(canvas, "width", this.width);

      let url = this.drawShapes(canvas);
      const image = this.renderer.createElement('img');
      this.renderer.setProperty(image, "src", url);
      this.renderer.setStyle(image, "border", "solid 1px grey");
      this.renderer.setStyle(image, "margin", "5px");
      this.renderer.appendChild(this.drawArea.nativeElement, image);
    }
    this.isGenerated = true;
  }

  private drawShapes(canvas: HTMLCanvasElement): string {
    if (this.settings.hcNoGrid.value === false)
      this.drawGrid(canvas);

    this.drawMirror(canvas);

    let vertices = this.getVertices();

    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    vertices.forEach(p => {
      ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    if (this.settings.helpPoints.value === true) {
      let helpingPoints = vertices.map<Vector2D>(p => {
        p.x = this.width - p.x;
        return p;
      });
      helpingPoints.forEach(p => {
        this.drawCoordinates(canvas, p, 2, '#000000')
      });
    }

    let img = canvas.toDataURL("image/png");
    return img;
  }

  private getYPositions(): Array<number> {
    let positions = Array.from({ length: 9 }, (v, k) => k * this.step).map(x => x + this.step); // 20-180
    let vertices = this.settings.vertices.value;

    let result = new Array(vertices),
      len = positions.length,
      taken = new Array(len);
    if (vertices > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (vertices--) {
      let x = Math.floor(Math.random() * len);
      result[vertices] = positions[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result.sort((a, b) => a - b);

  }
  private getXPosition(lastPos: number): number {
    let pos = this.getRndInteger(0, 5) * this.step;
    if (lastPos == pos)
      return this.getXPosition(pos);

    return pos;
  }

  private getVertices(): Array<Vector2D> {
    let points = Array<Vector2D>();

    let posY = this.getYPositions();
    points.push(new Vector2D(this.width / 2, posY[0]));
    
    for (let i = 1; i < posY.length; i++) {
      let last = points[points.length - 1];

       let posX = this.getXPosition(last.x);

      if (this.settings.hcOblique.value === false || Math.random() >= 0.3) {
        let connectPoint = new Vector2D(posX, last.y);
        points.push(connectPoint);
      }

      let nextPoint = new Vector2D(posX, posY[i]);
      points.push(nextPoint);
    }

    let finalPoint = new Vector2D(this.width / 2, points[points.length - 1].y);
    points.push(finalPoint);

    return points;
  }


  private drawMirror(canvas: HTMLCanvasElement): void {
    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#f20019';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();
  }

  private drawGrid(canvas: HTMLCanvasElement): void {
    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#d4d4d4';
    ctx.beginPath();
    for (let x = 0; x <= this.width; x += 20) {
      for (let y = 0; y <= this.height; y += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
        ctx.stroke();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }
    }
  }

  private drawCoordinates(canvas: HTMLCanvasElement, coord: Vector2D, pointSize: number, color: string): void {
    let ctx = canvas.getContext("2d");

    ctx.fillStyle = color; // Red color

    ctx.beginPath(); //Start path
    ctx.arc(coord.x, coord.y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.fill(); // Close the path and fill.
  }

  private getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
