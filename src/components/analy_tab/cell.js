// src/components/cell.js
import React from 'react';
import { parseTimestamp, formatTimestamp } from '../utils/time';

export default function Cell({ ts }) {
  const date = parseTimestamp(ts);
  return <span>{formatTimestamp(date)}</span>;
}
