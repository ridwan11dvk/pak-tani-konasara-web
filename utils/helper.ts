import { useToast } from "@chakra-ui/react";
import { UseMutationResult } from "react-query";
import { AxiosError, AxiosResponse } from "axios";

export const useHandlingHttpToast = () => {
  const toast = useToast();

  const successToast = () => {
      toast({
        title: "Success",
        description: "Operation completed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  };

  const errorToast = (err: AxiosError) => {
    const response: AxiosResponse = err.response as AxiosResponse;

      let errorMessage = "An error occurred. Please try again later.";

      if (response) {
        const { status } = response;

        switch (status) {
          case 400:
            errorMessage = "Bad Request. Please check your input.";
            break;
          case 401:
            errorMessage = "Unauthorized. Please login again.";
            break;
          case 422:
            errorMessage = "Unprocessable Entity. Invalid data provided.";
            break;
          case 500:
            errorMessage = "Internal Server Error. Please try again later.";
            break;
          default:
            errorMessage = "An error occurred. Please try again later.";
            break;
        }
      } else if (err?.message === "Network Error") {
        errorMessage = "Network Error. Please check your internet connection.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

  return {
    successToast,
    errorToast
  };
};
