let counter = Date.now();

export default (ns = "uuid"): string => {
  ++counter;

  return `${ns}-${counter}-${Date.now()}`;
};
