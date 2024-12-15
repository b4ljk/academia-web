//  REACT FC
//  - 1. Conditional rendering

interface ConditionalProps {
  condition?: boolean;
  children: React.ReactNode;
}
export const Conditional: React.FC<ConditionalProps> = ({
  children,
  condition = false
}) => {
  if (condition) return <>{children}</>;
  return null;
};
