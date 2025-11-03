import { useEffect } from "react";
import { Outlet } from "react-router-dom";
export default function AuthLayout() {
  return (
    <div className="w-full min-h-screen h-fit md:h-screen py-[20px] md:py-0 bg-[#DBE3FF] flex justify-center items-center">
      <div className="bg-[#F5F5F5] py-[20px] md:py-[5px]  w-full sm:w-[90%] md:w-[95%] h-fit lg:w-[80%]  rounded-[30px] flex justify-center items-center">
        <Outlet />
      </div>
    </div>
  );
}
