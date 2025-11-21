export default function HeaderSection({
  leftText,
  gradientText,
  rightText,
  description,
}) {
  return (
    <>
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#3D3D3D] text-center">
        {leftText} <span className="gradient-text">{gradientText}</span>{" "}
        {rightText}
      </h1>
      <p className="text-[#B0B0B0] text-base sm:text-lg md:text-[18px] max-w-[90%] md:max-w-[60%] text-center">
        {description}
      </p>
    </>
  );
}
