export const generateRandomId = () => {
  return 'id-' + Math.random().toString(36).slice(-8);
};
