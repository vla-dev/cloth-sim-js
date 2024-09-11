import { Vector as Vec2 } from "vector2d";
import { Point, Stick } from "../shapes";
import { Simulation } from "../App";
import { Fragment } from "react/jsx-runtime";
import ConfigBox from "./ConfigBox";
import { useState } from "react";

interface IClothSimulationProps {
  isRunning: boolean;
  onChange: (simulation: Simulation, points: Point[], sticks: Stick[]) => void;
}

const initialConfig = {
  position: new Vec2(50, 10),
  numOfPoints: new Vec2(56, 30),
  gap: 20,
  lockPointsStep: 11,
  pointsRadius: 0,
};

const ClothSimulation = ({ isRunning, onChange }: IClothSimulationProps) => {
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

  const handleChangeNoOfPoints = (e: any) => {
    const { name, value } = e.target;

    setConfig((prevConfig) => {
      const points = new Vec2(
        name === "x" ? Number(value) : prevConfig.numOfPoints.x,
        name === "y" ? Number(value) : prevConfig.numOfPoints.y
      );

      return {
        ...prevConfig,
        numOfPoints: points,
      };
    });
  };

  const reset = () => setConfig(initialConfig);

  const draw = () => {
    const { position, numOfPoints, gap, lockPointsStep, pointsRadius } = config;
    const _points: Point[] = [];
    const _sticks: Stick[] = [];

    const indexFrom2DCoord = (x: number, y: number) => y * numOfPoints.x + x;

    for (let y = 0; y < numOfPoints.y; y++) {
      for (let x = 0; x < numOfPoints.x; x++) {
        const point = new Point(
          new Vec2(position.x + x * gap, position.y + y * gap),
          x % lockPointsStep === 0 && y === 0,
          pointsRadius
        );
        _points.push(point);
      }
    }

    for (let y = 0; y < numOfPoints.y; y++) {
      for (let x = 0; x < numOfPoints.x; x++) {
        if (x < numOfPoints.x - 1) {
          _sticks.push(
            new Stick(
              _points[indexFrom2DCoord(x, y)],
              _points[indexFrom2DCoord(x + 1, y)]
            )
          );
        }
        if (y < numOfPoints.y - 1) {
          _sticks.push(
            new Stick(
              _points[indexFrom2DCoord(x, y)],
              _points[indexFrom2DCoord(x, y + 1)]
            )
          );
        }
      }
    }

    onChange(Simulation.CLOTH, _points, _sticks);
  };

  return (
    <Fragment>
      <button onClick={draw}>Simulate cloth</button>
      {isRunning && (
        <ConfigBox>
          <h3>- Cloth config -</h3>

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
            Number of points: Vec2({config.numOfPoints.x},{" "}
            {config.numOfPoints.y})
            <div className="group">
              <input
                type="range"
                name="x"
                placeholder="x"
                min={2}
                max={100}
                value={config.numOfPoints.x}
                onChange={handleChangeNoOfPoints}
              />
              <input
                type="range"
                name="y"
                placeholder="y"
                min={2}
                max={40}
                value={config.numOfPoints.y}
                onChange={handleChangeNoOfPoints}
              />
            </div>
          </label>

          <label className="input-field">
            Density ({config.gap})
            <input
              type="range"
              name="gap"
              min={2}
              max={40}
              value={config.gap}
              onChange={handleChangeConfig}
            />
          </label>

          <label className="input-field">
            Distance between locked points ({config.lockPointsStep})
            <input
              type="range"
              name="lockPointsStep"
              min={1}
              max={99}
              value={config.lockPointsStep}
              onChange={handleChangeConfig}
            />
          </label>

          <label className="input-field">
            Points radius ({config.pointsRadius})
            <input
              type="range"
              name="pointsRadius"
              min={0}
              max={10}
              value={config.pointsRadius}
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

export default ClothSimulation;
