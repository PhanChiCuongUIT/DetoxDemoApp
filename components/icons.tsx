import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg'; //thêm Circle nếu cần

const defaultProps = {
  width: 20,
  height: 20,
  strokeWidth: 1.5,
  color: 'currentColor',
};

export const UserIcon: React.FC<SvgProps> = props => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    stroke={props.color || defaultProps.color}
    //strokeWidth={defaultProps.strokeWidth}
    {...defaultProps}
    {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </Svg>
);

export const LockIcon: React.FC<SvgProps> = props => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    stroke={props.color || defaultProps.color}
    //strokeWidth={defaultProps.strokeWidth}
    {...defaultProps}
    {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </Svg>
);

export const LoginIcon: React.FC<SvgProps> = props => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    stroke={props.color || defaultProps.color}
    //strokeWidth={defaultProps.strokeWidth}
    {...defaultProps}
    {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
    />
  </Svg>
);

export const LogoutIcon: React.FC<SvgProps> = props => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    stroke={props.color || defaultProps.color}
    //strokeWidth={defaultProps.strokeWidth}
    {...defaultProps}
    {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3 3m0 0l-3-3m-3 3H9"
    />
  </Svg>
);

export const CheckCircleIcon: React.FC<SvgProps> = props => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    stroke={props.color || defaultProps.color}
    //strokeWidth={defaultProps.strokeWidth}
    {...defaultProps}
    {...props}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </Svg>
);
