import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CalculatorIcon = ({ width = 16, height = 14, fill = '#757575' }) => {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
    >
      <Path
        fill={fill}
        d="M4 2h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1m1 2v16h14V4zm2 2h10v4H7zm0 6h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v6h-2z"
      />
    </Svg>
  );
};