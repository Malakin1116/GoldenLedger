import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const HidePassIcon = ({ width = 16, height = 14, fill = '#757575' }) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 16 14">
      <Path
        fill={fill}
        d="M10.79 11.912l-1.614-1.615a3.5 3.5 0 01-4.474-4.474l-2.06-2.06C.938 5.278 0 7 0 7s3 5.5 8 5.5a7.03 7.03 0 002.79-.588zM5.21 2.088A7.028 7.028 0 018 1.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 00-4.474-4.474L5.21 2.088z"
      />
      <Path
        fill={fill}
        d="M5.525 6.646a2.5 2.5 0 002.83 2.83l-2.83-2.83zm4.95.708l-2.829-2.83a2.5 2.5 0 012.83 2.83zm3.171 6l-12-12 .708-.708 12 12-.707.708z"
      />
    </Svg>
  );
};