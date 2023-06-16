import type { FC } from "react";
import {
  Checkbox as ChackraCheckbox,
  CheckboxProps as ChakraCheckboxProps
} from "@chakra-ui/react";

type CheckBoxProps = ChakraCheckboxProps & {};

const ChekboxSquare: FC<CheckBoxProps> = (props) => {
  return (
      
    <ChackraCheckbox  colorScheme="orange" bgColor={"white"} {...props}/>
  );
};

export default ChekboxSquare;
