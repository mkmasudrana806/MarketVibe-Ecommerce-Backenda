type TFlattenedObject = {
  [key: string]: any;
};

/**
 * ------------------- makeFlattenedObject ------------------
 * @param obj object
 * @param parentKey parent key (optional)
 * @param result flattened object (optional)
 * @returns flattened object
 */
const makeFlattenedObject = (
  obj: TFlattenedObject,
  parentKey: string = "",
  result: TFlattenedObject = {}
): TFlattenedObject => {
  for (const key in obj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      obj[key] !== null
    ) {
      makeFlattenedObject(obj[key], fullKey, result);
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
};

export default makeFlattenedObject;
