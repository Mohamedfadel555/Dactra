export default function UserTypeSelector({ userType, onUserTypeChange }) {
  const userTypes = ["patient", "doctor", "scan", "lap"];

  return (
    <div className="flex gap-[10px]  md:mt-0 md:gap-[20px] lg:gap-[25px] justify-center items-center flex-wrap">
      {userTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onUserTypeChange(type)}
          className={`px-[15px] md:px-[25px] lg:px-[30px] py-[6px] md:py-[5px] rounded-[10px] font-english font-[500] text-[11px] md:text-[12px] lg:text-[13px] transition-all duration-300 whitespace-nowrap ${
            userType === type
              ? "bg-[#3E69FE] text-[#FFFFFF] shadow-md"
              : "bg-[#FFFFFF] text-[#003465] border border-[#3E69FE] hover:bg-[#F0F4FF]"
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
}

