import React from 'react';
import Svg, { Path } from 'react-native-svg';

const SvgIcon = ({ width = 16, height = 14, fill = '#757575' }) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
  >
    <Path
      fill={fill}
      d="m13.172 12-4.95-4.95 1.414-1.413L16 12l-6.364 6.364-1.414-1.415z"
    />
  </Svg>
);

export default SvgIcon;
