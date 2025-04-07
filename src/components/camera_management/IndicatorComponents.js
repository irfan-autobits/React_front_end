// src/components/IndicatorComponents.js
import './IndicatorComponents.css';

export const GreenIndicator = () => {
  return (
    <span
      className="getway_icon_inner"
      style={{
        backgroundColor: "rgb(134, 173, 74)",
        margin: 0,
        marginRight: "7.5px",
      }}
    ></span>
  );
};

export const RedIndicator = () => {
  return (
    <span
      className="getway_icon_inner"
      style={{
        backgroundColor: "rgb(255, 82, 82)",
        margin: 0,
        marginRight: "7.5px",
      }}
    ></span>
  );
};
