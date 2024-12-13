/**
 * -------------------- makeAllowedFieldData ---------------------
 * @param allowedFields array of allowed fields like (typeof TUser)[] = ['email', 'name',..and so on]
 * @param payload payload data to update
 */
const makeAllowedFieldData = <T>(
  allowedFields: (keyof T)[],
  payload: Partial<T>
) => {
  const updatedData: Partial<T> = {};
  allowedFields.forEach((field) => {
    if (payload[field]) {
      updatedData[field] = payload[field];
    }
  });

  return updatedData;
};

export default makeAllowedFieldData;
