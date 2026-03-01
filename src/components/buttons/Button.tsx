export const Button = ({
  className = "",
  ...props
}) => {
  return (
    <button
      className={`w-20 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};
