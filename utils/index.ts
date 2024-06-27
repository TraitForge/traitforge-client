export const calculateUri = (
  _paddedEntropy: number | string,
  _generation: number | string
) => {
  return `${_paddedEntropy}_${_generation}`;
};

export const getEntityPrice = (entityPrice: string | number, index: number) => {
  const numericPrice = Number(entityPrice);
  const increment = index * 0.0001;
  const calculatedPrice = (numericPrice + increment).toFixed(4);
  return calculatedPrice;
};
