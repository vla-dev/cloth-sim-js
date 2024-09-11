const Instructions = () => {
  return (
    <div className="instructions">
      <h2>Usage: </h2>
      <p className="instruction">
        Press <b>Left click</b> to create a static point.
      </p>
      <p className="instruction">
        Press <kbd className="kbc-button no-container">Ctrl</kbd> +{" "}
        <b>Left click</b> to create a static point.
      </p>
      <p className="instruction">
        Hold <kbd className="kbc-button no-container">C</kbd> and hover over the
        lines to cut them when the simulation is enabled.
      </p>
    </div>
  );
};

export default Instructions;
