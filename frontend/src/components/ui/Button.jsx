function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
}) {
  const styles = {
    primary:
      "bg-[#1E3A8A] text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200",

    secondary:
      "bg-white text-[#1E3A8A] border border-[#1E3A8A] hover:bg-[#E5F6FD] focus:ring-4 focus:ring-blue-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        min-w-[180px]
        px-8
        py-3.5
        rounded-2xl
        font-semibold
        text-base
        shadow-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:scale-[1.02]
        hover:shadow-xl
        active:scale-95
        focus:outline-none
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
        disabled:hover:scale-100
        disabled:hover:shadow-md
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;