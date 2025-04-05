import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const DeleteIcon = ({ width = 16, height = 14, fill = '#757575' }) => {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
    >
      <Path
        fill={fill}
        d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm1 2H6v12h12zm-4.586 6 1.768 1.768-1.414 1.414L12 15.414l-1.768 1.768-1.414-1.414L10.586 14l-1.768-1.768 1.414-1.414L12 12.586l1.768-1.768 1.414 1.414zM9 4v2h6V4z"
      />
    </Svg>
  );
};