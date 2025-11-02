import Icon from "../../assets/images/icons/dactraIcon.png";

export default function BrandLogo({ size = "size-[50px]", textSize = "text-[30px]" }) {
  return (
    <div className="flex justify-center items-center gap-[10px]">
      <img src={Icon} alt="dactra Icon" className={size} />
      <p className={`font-english font-[800] ${textSize} text-[#003465]`}>
        Dactra
      </p>
    </div>
  );
}

