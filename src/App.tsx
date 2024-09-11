import { useEffect, useRef, useState } from "react";
import { Vector as Vec2 } from "vector2d";
import { cut, getMousePositionOnElement } from "./utils/utilities";
import { Point, Stick } from "./shapes";
import { SOLVE_ITERATIONS } from "./utils/constants";
import RopeSimulation from "./components/RopeSimulation";
import ClothSimulation from "./components/ClothSimulation";
import "./App.css";
import Instructions from "./components/Instructions";
import Footer from "./components/Footer";

export const enum Simulation {
  ROPE = 1,
  CLOTH
}

interface State {
  points: Point[];
  sticks: Stick[];
  isSimulating: boolean;
  isLockingPoint: boolean;
  isCutting: boolean;
  runningSimulation: Simulation | null;
  selectedPoint: Point | null;
  selectedStick: Stick | null;
}

const App = () => {
  const [state, setState] = useState<State>({
    points: [],
    sticks: [],
    isSimulating: false,
    isLockingPoint: false,
    isCutting: false,
    runningSimulation: null,
    selectedPoint: null,
    selectedStick: null,
  });

  const mousePosition = useRef<Vec2>(new Vec2(0, 0));
  const cutPositionOld = useRef<Vec2>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousTimeRef = useRef<number>(0);

  const onMouseDown = (e: any) => {
    if (!canvasRef.current) return;
    const { x, y } = getMousePositionOnElement(canvasRef.current, e);

    if (!state.runningSimulation) {
      const clickedPointIndex = state.points.findIndex((point) => {
        const dx = x - point.position.x;
        const dy = y - point.position.y;

        return Math.sqrt(dx * dx + dy * dy) <= point.radius;
      });

      if (clickedPointIndex > -1) {
        const clickedPoint = state.points[clickedPointIndex];

        setState((prevState) => ({
          ...prevState,
          selectedPoint: clickedPoint,
        }));

        if (!state.selectedStick) {
          const stick = new Stick(clickedPoint, new Point(new Vec2(x, y)));
          stick.setColor("#fff");
          stick.setThickness(2);

          setState((prevState) => ({
            ...prevState,
            selectedStick: stick,
          }));
        }
      }
    }
  };

  const onMouseUp = (e: any) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (state.runningSimulation) return;

    if (state.selectedPoint) {
      const anotherClickedPointIndex = state.points.findIndex((point) => {
        const dx = x - point.position.x;
        const dy = y - point.position.y;
        return Math.sqrt(dx * dx + dy * dy) <= point.radius;
      });

      if (anotherClickedPointIndex > -1) {
        const anotherClickedPoint = state.points[anotherClickedPointIndex];

        if (state.selectedStick) {
          state.selectedStick.pointB = anotherClickedPoint;

          const stick = new Stick(state.selectedPoint, anotherClickedPoint);
          stick.setColor("#fff");
          stick.setThickness(2);

          setState((prevState) => ({
            ...prevState,
            sticks: [...prevState.sticks, stick],
            selectedStick: null,
          }));
        }

        setState((prevState) => ({
          ...prevState,
          selectedPoint: null,
        }));
      } else {
        const newPoint = new Point(new Vec2(x, y), state.isLockingPoint);
        setState((prevState) => ({
          ...prevState,
          points: [...prevState.points, newPoint],
        }));

        const stick = new Stick(newPoint, state.selectedPoint);
        stick.setColor("#fff");
        stick.setThickness(2);

        setState((prevState) => ({
          ...prevState,
          sticks: [...prevState.sticks, stick],
          selectedStick: null,
          selectedPoint: null,
        }));
      }
    } else {
      const newPoint = new Point(new Vec2(x, y), state.isLockingPoint);

      setState((prevState) => ({
        ...prevState,
        points: [...prevState.points, newPoint],
      }));
    }
  };

  const onMouseMove = (e: any) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    mousePosition.current = new Vec2(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    if (state.isSimulating && state.isCutting) {
      if (cutPositionOld.current) {
        cut(cutPositionOld.current, mousePosition.current, state.sticks);
      }
      cutPositionOld.current = mousePosition.current;
    }
  };

  const handleChangeSimulation = (
    runningSimulation: Simulation,
    points: Point[],
    sticks: Stick[]
  ) => {
    reset();
    setState((prevState) => ({
      ...prevState,
      runningSimulation,
      isSimulating: true,
      points,
      sticks,
    }));
  };

  const handleOnKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Control" || event.key === "Meta") {
      setState((prevState) => ({
        ...prevState,
        isLockingPoint: false,
      }));
    } else if (event.key === "c" || event.key === "C") {
      setState((prevState) => ({
        ...prevState,
        isCutting: false,
      }));
    }
  };

  const handleOnKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Control" || event.key === "Meta") {
      setState((prevState) => ({
        ...prevState,
        isLockingPoint: true,
      }));
    } else if (event.key === "c" || event.key === "C") {
      setState((prevState) => {
        if (!prevState.isCutting && prevState.isSimulating) {
          cutPositionOld.current = mousePosition.current;
        }

        return {
          ...prevState,
          isCutting: true,
        };
      });
    }
  };

  const toggleSimulation = () => {
    setState((prevState) => ({
      ...prevState,
      isSimulating: !prevState.isSimulating,
    }));
  };

  const reset = () => {
    setState((prevState) => {
      prevState.points.forEach((p) => p.dispose());

      return {
        ...prevState,
        points: [],
        sticks: [],
        runningSimulation: null,
      };
    });
  };

  const update = (_dt: number) => {
    if (!state.isSimulating) return;

    for (let i = 0; i < SOLVE_ITERATIONS; i++) {
      state.sticks.forEach((stick) => stick.update(_dt));
    }

    state.points.forEach((p) => p.update(_dt));
  };

  const render = (_dt: number, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    state.sticks.forEach((stick) => stick.draw(ctx));
    state.points.forEach((p) => p.draw(ctx));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context)
      throw new Error("Could not initialize the drawing context");

    window.addEventListener("keyup", handleOnKeyUp, false);
    window.addEventListener("keydown", handleOnKeyDown, false);

    let animationFrameId: number;

    const _RAF = (elapsedTime: number = 0) => {
      if (previousTimeRef.current) {
        const dt = elapsedTime - previousTimeRef.current;

        update(dt);
        render(dt, context);
      }

      previousTimeRef.current = elapsedTime;
      animationFrameId = window.requestAnimationFrame(_RAF);
    };

    _RAF();

    return () => {
      window.removeEventListener("keyup", handleOnKeyUp, false);
      window.removeEventListener("keydown", handleOnKeyDown, false);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [render]);

  return (
    <div className="app-wrapper">
      <h2>Web Physics Simulation - <a href="https://en.wikipedia.org/wiki/Verlet_integration" target="_blank">Verlet Integration</a></h2>

      <div className="actions">
        <RopeSimulation
          isRunning={state.runningSimulation === Simulation.ROPE}
          onChange={handleChangeSimulation}
        />
        <ClothSimulation
          isRunning={state.runningSimulation === Simulation.CLOTH}
          onChange={handleChangeSimulation}
        />
        <button onClick={toggleSimulation}>
          Simulation: {state.isSimulating ? "ON" : "OFF"}
        </button>
        <button onClick={reset}>Reset</button>
      </div>

      <canvas
        className={`canvas ${state.isCutting ? "is-cutting" : ""}`}
        ref={canvasRef}
        width={1200}
        height={800}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      ></canvas>
      <Instructions />
      <Footer />
    </div>
  );
};

export default App;
