export const cleanAddressData = (data) => {
  const { _id,  __v,userId, createdAt, updatedAt, ...rest } = data;
  return rest;
};
