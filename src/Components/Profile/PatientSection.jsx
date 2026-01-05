import { useState, useEffect } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";

export default function PatientSection({
  Icon,
  title,
  data = [],
  submitfn,
  alldata = [],
}) {
  const [selected, setSelected] = useState([]);
  const [initialSelected, setInitialSelected] = useState([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const initialIds =
      alldata?.filter((opt) => data.includes(opt.name)).map((opt) => opt.id) ||
      [];
    setSelected(initialIds);
    setInitialSelected(initialIds);
  }, [alldata, data]);

  const isChanged = () => {
    if (selected.length !== initialSelected.length) return true;
    return selected.some((id) => !initialSelected.includes(id));
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260 }}
      className="md:w-1/2 w-full h-full flex flex-col gap-4 bg-white shadow-md rounded-xl p-5 relative z-10"
    >
      <h3 className="text-xl flex justify-between items-center">
        {title}
        <FaEdit
          onClick={() => setFlag((prev) => !prev)}
          className="text-blue-600 cursor-pointer"
        />
      </h3>

      <div className="flex flex-col gap-2">
        {data.length !== 0 ? (
          data.map((a, ind) => (
            <p key={ind} className="flex gap-[10px] items-center text-[18px]">
              <Icon className="text-[30px] text-blue-600 font-bold" />
              {a}
            </p>
          ))
        ) : (
          <div className="text-sm text-[#445] flex gap-2 justify-center items-center">
            {" "}
            <IoWarningOutline className="text-[40px] animate-bounce  text-blue-600" />{" "}
            {title === "Allergies"
              ? "The patient has no known allergies"
              : "The patient has no chronic diseases."}
          </div>
        )}
      </div>

      {flag && (
        <>
          <Select
            isMulti
            options={alldata.map((opt) => ({ value: opt.id, label: opt.name }))}
            value={alldata
              .map((opt) => ({ value: opt.id, label: opt.name }))
              .filter((opt) => selected.includes(opt.value))}
            onChange={(items) =>
              setSelected(items ? items.map((i) => i.value) : [])
            }
            placeholder={`Search ${title.toLowerCase()}...`}
            className="react-select-container"
            classNamePrefix="react-select"
          />

          <button
            onClick={() => {
              title === "Allergies"
                ? submitfn({ allergyIds: selected })
                : submitfn({ chronicDiseaseIds: selected });
              console.log(first);
            }}
            disabled={!isChanged()}
            className={`cursor-pointer p-2 w-1/2 rounded-[10px] mt-2 text-white ${
              isChanged() ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Update
          </button>
        </>
      )}
    </motion.div>
  );
}
