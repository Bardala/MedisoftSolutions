// utils/errorMessages.ts
export const ERROR_MESSAGES: Record<number, string> = {
  400: "Your request couldn’t be processed. Please check the information you entered.",
  401: "You need to log in or verify your identity to continue.",
  403: "Access denied. You don’t have permission to perform this action.",
  404: "Oops! The requested resource couldn’t be found.",
  405: "This action isn’t supported right now. Please check your request.",
  408: "The server took too long to respond. Please try again.",
  429: "Whoa there! You’re sending requests too fast. Please wait a bit.",
  500: "Something went wrong on our end. Please try again later.",
  502: "Received an invalid response. The system might be temporarily overloaded.",
  503: "The system is currently down for maintenance or overloaded. Try again soon.",
  504: "Our servers didn’t respond in time. Give it another shot in a moment.",
};
