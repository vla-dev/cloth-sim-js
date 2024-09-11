import { Vector as Vec2 } from "vector2d";

abstract class CanvasClickable {
  constructor() {
    window.addEventListener("mousedown", this.handleOnMouseDown.bind(this));
    window.addEventListener("mouseup", this.handleOnMouseUp.bind(this));
    window.addEventListener("mousemove", this.handleOnMouseMove.bind(this));
  }

  abstract onMouseDown(_mousePos: Vec2): any;
  abstract onMouseUp(_mousePos: Vec2): any;
  abstract onMouseMove(_mousePos: Vec2): any;

  handleOnMouseDown(_e: MouseEvent) {
    if (_e.target instanceof HTMLCanvasElement) {
      const rect = (_e.target as HTMLCanvasElement)?.getBoundingClientRect();
      this.onMouseDown(new Vec2(_e.clientX - rect.left, _e.clientY - rect.top));
    }
  }

  handleOnMouseUp(_e: MouseEvent) {
    if (_e.target instanceof HTMLCanvasElement) {
      const rect = (_e.target as HTMLCanvasElement)?.getBoundingClientRect();
      this.onMouseUp(new Vec2(_e.clientX - rect.left, _e.clientY - rect.top));
    }
  }

  handleOnMouseMove(_e: MouseEvent) {
    if (_e.target instanceof HTMLCanvasElement) {
      const rect = (_e.target as HTMLCanvasElement)?.getBoundingClientRect();
      this.onMouseMove(new Vec2(_e.clientX - rect.left, _e.clientY - rect.top));
    }
  }

  dispose() {
    window.removeEventListener("mousedown", this.handleOnMouseDown);
    window.removeEventListener("mouseup", this.handleOnMouseUp);
    window.removeEventListener("mousemove", this.handleOnMouseMove);
  }
}

export default CanvasClickable;
