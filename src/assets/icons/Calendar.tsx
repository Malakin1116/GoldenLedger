// src/assets/icons/CalendarIcon.tsx
import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export const CalendarIcon = ({ width = 24, height = 24, fill = '#757575' }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fill="none"
        d="M0 0h24v24H0z"
      />
      <G>
        <Path
          stroke={fill}
          strokeLinejoin="round"
          d="M3 8.267V19a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8.267m-18 0V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3.267m-18 0h18"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 2v3"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 2v3"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 11h-2"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 17h-2"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 11h-2"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 17h-2"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 11H6"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 17H6"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 14h-2"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 14h-2"
        />
      </G>
      <G>
        <Path
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 14H6"
        />
      </G>
    </Svg>
  );
};