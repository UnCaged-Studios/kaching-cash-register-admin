const CURRENCY_DECIMALS = 6;

export const calculateAmountInDecimals = (n: number) =>
  n * Math.pow(10, CURRENCY_DECIMALS);
