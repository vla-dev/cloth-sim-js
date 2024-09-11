import { Vector as Vec2 } from "vector2d";
import { Point, Stick } from "../shapes";
import { Simulation } from "../App";
import { Fragment, useState } from "react";
import ConfigBox from "./ConfigBox";

interface IRopeSimulationProps {
  isRunning: boolean;
  onChange: (simulation: Simulation, points: Point[], sticks: Stick[]) => void;
}

const initialConfig = {
  segments: 150,
  segmentLength: 2,
  pointsRadius: 0,
  position: new Vec2(600, 10),
  startLocked: true,
  endLocked: false,
};

const RopeSimulation = ({ isRunning, onChange }: IRopeSimulationProps) => {
  const [config, setConfig] = useState(initialConfig);

  const handleChangeConfig = (e: any) => {
    const { name, type, checked, value } = e.target;

    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangePosition = (e: any) => {
    const { name, value } = e.target;

    setConfig((prevConfig) => {
      const newPos = new Vec2(
        name === "x" ? Number(value) : prevConfig.position.x,
        name === "y" ? Number(value) : prevConfig.position.y
      );

      return {
        ...prevConfig,
        position: newPos,
      };
    });
  };

  const reset = () => setConfig(initialConfig);

  const draw = () => {
    const {
      segments,
      segmentLength,
      pointsRadius,
      position,
      startLocked,
      endLocked,
    } = config;

    const _points: Point[] = [];
    const _sticks: Stick[] = [];

    for (let i = 0; i < segments; i++) {
      const locked =
        (i === 0 && startLocked) || (i === segments - 1 && endLocked);

      const point = new Point(
        new Vec2(position.x + i * segmentLength, position.y),
        locked,
        pointsRadius
      );

      _points.push(point);

      if (_points.length > 1) {
        const stick = new Stick(point, _points[i - 1]);
        stick.setColor("#fff");
        stick.setThickness(2);

        _sticks.push(stick);
      }
    }

    onChange(Simulation.ROPE, _points, _sticks);
  };

  return (
    <Fragment>
      <button onClick={draw}>Simulate rope</button>
      {isRunning && (
        <ConfigBox>
          <h3>- Rope config -</h3>

          <label className="input-field">
            Position: Vec2({config.position.x}px, {config.position.y}px)
            <div className="group">
              <input
                type="range"
                name="x"
                placeholder="x"
                min={10}
                max={1190}
                value={config.position.x}
                onChange={handleChangePosition}
              />
              <input
                type="range"
                name="y"
                placeholder="y"
                min={10}
                max={790}
                value={config.position.y}
                onChange={handleChangePosition}
              />
            </div>
          </label>

          <label className="input-field">
            Segments ({config.segments})
            <input
              type="range"
              name="segments"
              min={2}
              max={200}
              value={config.segments}
              onChange={handleChangeConfig}
            />
          </label>

          <label className="input-field">
            Segment length ({config.segmentLength})
            <input
              type="range"
              name="segmentLength"
              min={1}
              max={100}
              value={config.segmentLength}
              onChange={handleChangeConfig}
            />
          </label>

          <label className="input-field">
            Points radius ({config.pointsRadius})
            <input
              type="range"
              name="pointsRadius"
              min={0}
              max={20}
              value={config.pointsRadius}
              onChange={handleChangeConfig}
            />
          </label>

          <label className="input-field">
            Lock start point: ({config.startLocked ? "YES" : "NO"})
            <input
              type="checkbox"
              name="startLocked"
              checked={config.startLocked}
              onChange={handleChangeConfig}
            />
          </label>

          <label className="input-field">
            Lock end point: ({config.endLocked ? "YES" : "NO"})
            <input
              type="checkbox"
              name="endLocked"
              checked={config.endLocked}
              onChange={handleChangeConfig}
            />
          </label>

          <div className="config-actions">
            <button className="update" onClick={draw}>
              Update
            </button>
            <button className="reset" onClick={reset}>
              Reset config
            </button>
          </div>
        </ConfigBox>
      )}
    </Fragment>
  );
};

export default RopeSimulation;
