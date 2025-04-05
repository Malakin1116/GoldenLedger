import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const WalletIcon = ({ width = 16, height = 14, fill = '#757575' }) => {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
    >
      {/* Основна частина гаманця */}
      <Path
        fill={fill}
        d="M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v10h14V8H5z"
      />
      {/* Клапан гаманця (відкритий) */}
      <Path
        fill={fill}
        d="M5 6h14l-2-3H7l-2 3z"
      />
      {/* Монета (символ фінансів) */}
      <Path
        fill={fill}
        d="M15 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
      />
      {/* Маленька деталь на монеті */}
      <Path
        fill={fill}
        d="M15 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
      />
    </Svg>
  );
};