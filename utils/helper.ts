import { useToast } from "@chakra-ui/react";
import { UseMutationResult } from "react-query";
import { AxiosError, AxiosResponse } from "axios";

export const useHandlingHttpToast = () => {
  const toast = useToast();

  const successToast = (msg?: string) => {
      toast({
        title: "Success",
        description: msg || "Operation completed successfully.",
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
            errorMessage = response?.data?.error || "Unauthorized. Please login again.";
            break;
          case 422:
            errorMessage = response?.data?.error?.details?.map((err: any) => err?.message)?.join(',') || "Unprocessable Entity. Invalid data provided.";
            break;
          case 500:
            errorMessage = response?.data?.error ||"Internal Server Error. Please try again later.";
            break;
          default:
            errorMessage = response?.data?.error || "An error occurred. Please try again later.";
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

export const serialize = function (obj: any) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      if (obj[p]) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  return str.join("&");
};