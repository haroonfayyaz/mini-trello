export const RenderIf = ({ isTrue, children, fallback }) => {
  return isTrue ? children : fallback || null;
};
