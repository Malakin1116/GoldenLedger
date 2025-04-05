import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CaseIcon = ({ width = 16, height = 14, fill = '#757575' }) => {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
    >
      <Path
        fill={fill}
        d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"
      />
    </Svg>
  );
};