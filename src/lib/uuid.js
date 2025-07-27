var counter = Date.now();

export default (ns = "uuid") => {
  ++counter;

  return `${ns}-${counter}-${Date.now()}`;
};
