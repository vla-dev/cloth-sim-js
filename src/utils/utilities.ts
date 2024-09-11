import { Vector as Vec2 } from "vector2d";
import Stick from "../shapes/Stick";

export const getMousePositionOnElement = (
  element: HTMLElement,
  e: MouseEvent
): Vec2 => {
  const rect = element?.getBoundingClientRect() || {
    left: 0,
    top: 0,
  };

  return new Vec2(e.clientX - rect.left, e.clientY - rect.top);
};

export const segmentsIntersect = (
  a1: Vec2,
  a2: Vec2,
  b1: Vec2,
  b2: Vec2
): boolean => {
  const d = (b2.x - b1.x) * (a1.y - a2.y) - (a1.x - a2.x) * (b2.y - b1.y);
  if (d === 0) return false;

  const t = ((b1.y - b2.y) * (a1.x - b1.x) + (b2.x - b1.x) * (a1.y - b1.y)) / d;
  const u = ((a1.y - a2.y) * (a1.x - b1.x) + (a2.x - a1.x) * (a1.y - b1.y)) / d;

  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

export const cut = (start: Vec2, end: Vec2, sticks: Stick[]): void => {
  sticks.forEach((stick) => {
    if (
      segmentsIntersect(
        start,
        end,
        stick.pointA.position,
        stick.pointB.position
      )
    ) {
      stick.dead = true;
    }
  });
};
