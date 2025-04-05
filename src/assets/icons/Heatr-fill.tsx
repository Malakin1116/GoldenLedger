import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const HeartFillIcon = ({ width = 16, height = 14, fill = '#757575' }) => {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
    >
      <Path
        fill={fill}
        d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2"
      />
    </Svg>
  );
};