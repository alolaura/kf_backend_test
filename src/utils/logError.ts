export const logError = (error: any) => {
  if (error.response) {
    console.log(error.response.data.message);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
};
