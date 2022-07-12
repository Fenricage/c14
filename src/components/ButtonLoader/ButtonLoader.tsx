import React from 'react';
import ReactLoading from 'react-loading';

const ButtonLoader = () => (
  <ReactLoading
    data-testid="ButtonLoader"
    type="spin"
    color="rgba(255, 255, 255, .5)"
    height={16}
    width={16}
  />
);

export default ButtonLoader;
