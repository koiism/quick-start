const calculateContainScale = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) => {
  const scale = Math.min(maxWidth / width, maxHeight / height);
  return scale;
};

const calculateCoverScale = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) => {
  const scale = Math.max(maxWidth / width, maxHeight / height);
  return scale;
};

const calculateScale = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) => {
  const containScale = calculateContainScale(
    width,
    height,
    maxWidth,
    maxHeight
  );
  const coverScale = calculateCoverScale(width, height, maxWidth, maxHeight);
  return {
    containScale,
    coverScale,
  };
};

export { calculateContainScale, calculateCoverScale, calculateScale };
