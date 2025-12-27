export const Button = ({
  className = "",
  ...props
}) => {
  return (
    <button
      className={`w-20 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all hover:cursor-pointer disabled:pointer-events-none ${className}`}
      {...props}
    />
  );
};
