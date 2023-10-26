/* eslint-disable no-plusplus */
let objCount = 0;

export const getNextId = () => {
  return objCount++;
};
