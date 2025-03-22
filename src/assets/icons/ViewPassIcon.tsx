import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ViewPassIcon = ({ width = 16, height = 12, fill = '#757575' }) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 16 12">
      <Path fill={fill} d="M10.5 6a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      <Path
        fill={fill}
        d="M0 6S3 .5 8 .5 16 6 16 6s-3 5.5-8 5.5S0 6 0 6zm8 3.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
      />
    </Svg>
  );
};