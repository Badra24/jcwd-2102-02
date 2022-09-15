import { Button, Flex, Text } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React, { useEffect } from 'react';

const steps = [
  { label: 'Payment' },
  { label: 'Validation' },
  { label: 'Shipment' },
  { label: 'Delivered ' },
  { label: 'Completed ' },
];

export const ProgressStep = ({ status }) => {
  const { setStep, activeStep } = useSteps({
    initialStep: 0,
  });

  useEffect(() => {
    switch (status) {
      case 'Payment':
        setStep(1);
        break;
      case 'Validation':
        setStep(2);
        break;
      case 'Shipment':
        setStep(3);
        break;
      case 'Delivered':
        setStep(4);
        break;
      case 'Completed':
        setStep(5);
        break;
      default:
        setStep(0);
        break;
    }
  }, [status]);

  return status ? (
    <Flex flexDir="column" width="100%" my="0.5rem">
      <Steps activeStep={activeStep} colorScheme="teal">
        {steps.map(({ label }) => (
          <Step label={label} key={label}></Step>
        ))}
      </Steps>
      {/* <Button
        onClick={() => {
          setStep(2);
        }}
      >
        2
      </Button> */}
    </Flex>
  ) : (
    <></>
  );
};
