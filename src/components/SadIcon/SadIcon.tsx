import React, { FC } from 'react';

type SadIconProps = {
  color: string;
  width: number;
  height: number;
}

const SadIcon: FC<SadIconProps> = (props) => {
  const {
    color = '#000',
    width = 10,
    height = 10,
  } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        /* eslint-disable-next-line max-len */
        d="M60 3.75C28.9341 3.75 3.75 28.9341 3.75 60C3.75 91.0659 28.9341 116.25 60 116.25C91.0659 116.25 116.25 91.0659 116.25 60C116.25 28.9341 91.0659 3.75 60 3.75ZM94.4714 94.4714C85.9239 102.993 74.5097 108.028 62.4529 108.594C50.3961 109.16 38.5605 105.217 29.2522 97.533C19.9439 89.8492 13.8297 78.9751 12.101 67.0295C10.3723 55.0839 13.1529 42.9225 19.9011 32.9151C26.6492 22.9077 36.8814 15.7711 48.604 12.8958C60.3266 10.0206 72.6998 11.6128 83.3126 17.362C93.9254 23.1113 102.018 32.6058 106.012 43.9956C110.007 55.3854 109.619 67.8545 104.922 78.9734C102.474 84.767 98.9251 90.0304 94.4714 94.4714Z"
        fill={color}
      />
      <path
        /* eslint-disable-next-line max-len */
        d="M35.625 46.875H45V56.25H35.625V46.875ZM75 46.875H84.375V56.25H75V46.875ZM60 67.5C54.5318 67.5062 49.2894 69.6812 45.4228 73.5478C41.5562 77.4144 39.3812 82.6568 39.375 88.125H46.875C46.875 84.644 48.2578 81.3056 50.7192 78.8442C53.1806 76.3828 56.519 75 60 75C63.481 75 66.8194 76.3828 69.2808 78.8442C71.7422 81.3056 73.125 84.644 73.125 88.125H80.625C80.6188 82.6568 78.4438 77.4144 74.5772 73.5478C70.7106 69.6812 65.4682 67.5062 60 67.5V67.5Z"
        fill={color}
      />
    </svg>

  );
};

export default SadIcon;
