import { Box } from '@chakra-ui/react';

const GradientBox = () => {
  return (
    <Box
      bg={{
        base: 'brown.50',
        sm: 'brown.100',
        md: 'brown.200',
        lg: 'brown.300',
        xl: 'brown.400',
        '2xl': 'brown.500',
      }}
      p={4}
      borderRadius='md'
      boxShadow='lg'
    >
      Your content here
    </Box>
  );
};

export default GradientBox;
