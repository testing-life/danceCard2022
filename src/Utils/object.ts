export const isObjectWithValue = <T>(obj: T, prop: string) => Object.keys(obj).includes(prop);

export const getFilteredKeys = <T, K extends keyof T>(obj: T, property: K): string[] =>
  Object.entries(obj)
    .filter((item: any[]) => item[1][property])
    .map((item: any[]) => item[0]);

export const updateObjectInArrayById = <T, K extends object, U extends keyof K>(
  array: T[],
  object: K,
  lookupProperty: U,
): T[] => {
  const result = [];
  const lookupValue = object[lookupProperty];
  const index = (array as T[]).findIndex((item: any) => item[lookupProperty] === object[lookupProperty]);

  return [];
};

export const updateObjArrayWithOtherArrayOfObj = <T, K>(
  array: T[],
  newArray: K[],
  lookupProperty: any = null,
): T[] => {
  const res = array.map((item: any) => {
    const newObj = newArray.find((newItem: any) => item.uid === newItem.uid);
    return { ...item, newObj };
  });

  return res;
};
