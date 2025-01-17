export const getNormalRange = async (): Promise<{ min: number; max: number }> => {
    return new Promise((resolve) => resolve({ min: 1, max: 100 }));
  };
  
  export const getFixedValues = async (): Promise<number[]> => {
    return new Promise((resolve) => resolve([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]));
  };