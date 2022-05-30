import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Flex } from 'rebass';
import WidgetHead from '../../Widget/WidgetHead';
import { AnimatedContainer } from '../../../../theme/components';

const TemporaryContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 46px;
  font-style: italic;
  opacity: .6;
`;

const VerificationFormStep: FC = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Flex flexDirection="column" flexWrap="nowrap" flex={1}>
      <WidgetHead text="Verify Your Phone Number" />
      <AnimatedContainer animate={animate}>
        <TemporaryContainer>
          Coming Soon!
        </TemporaryContainer>
      </AnimatedContainer>
    </Flex>
  );
};

export default VerificationFormStep;
