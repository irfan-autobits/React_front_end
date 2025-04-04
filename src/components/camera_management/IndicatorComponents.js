// src/components/IndicatorComponents.js
import './IndicatorComponents.css'; // Create this file for component-specific styling

export const GreenIndsm = ({ onClick }) => {
    return (
      <span
        className="getway_icon_inner"
        style={{
          backgroundColor: "rgb(134, 173, 74)",
          margin: 0,
          marginRight: "7.5px",
        }}
        onClick={() => onClick()}
      ></span>
    );
  };
  export const RedIndsm = ({ onClick }) => {
    return (
      <span
        className="getway_icon_inner"
        style={{
          backgroundColor: "rgb(255, 82, 82)",
          margin: 0,
          marginRight: "7.5px",
        }}
        onClick={() => onClick()}
      ></span>
    );
  };
  export const GreenIndsmncli = () => {
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