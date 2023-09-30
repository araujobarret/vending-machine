export const convertCentsToFloat = (coin: number) => coin / 100;

export const convertFloatToCents = (value: number) =>
  parseFloat(value.toFixed(2)) * 100;

export const calculateChangeToCoins = (value: number): number[] => {
  let valueInCents = convertFloatToCents(value);
  const coins = [100, 50, 20, 10, 5];
  const coinsChange: number[] = [];

  for (const coin of coins) {
    const count = Math.floor(valueInCents / coin);
    if (count > 0) {
      coinsChange.push(...Array.from({ length: count }, () => coin));
      valueInCents -= count * coin;
    }
  }

  return coinsChange;
};
