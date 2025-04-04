import React from 'react';
import { Handle } from 'reactflow';

const CustomNode = ({ data }) => {
  return (
    <div 
      className="reactflow__node"  // ensure it has the default node class
      style={{
        padding: 10,
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: 4,
        whiteSpace: 'pre-wrap',
      }}
    >
      {data.label}
      {/* Optionally, include handles if you need them */}
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
};

export default CustomNode;
