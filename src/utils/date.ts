export const createDateForToken = (dateInString: string): number => {
  let numericValue = parseInt(dateInString);
  return numericValue * parseInt(dateInString) * 60 * 60 * 1000;
};
