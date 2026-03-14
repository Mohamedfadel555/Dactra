import { useAxios } from "../hooks/useAxios";

export const useAppointmentAPI = () => {
  const axiosInstance = useAxios();

  const getWorkDetails = async () => {
    const res = await axiosInstance.get("DoctorSlots/myworking-hours");
    return res.data;
  };

  const saveWorkDetails = async (Data) => {
    const res = await axiosInstance.put("DoctorSlots/working-details", Data);
    return res;
  };

  const saveAVSlots = async (Data) => {
    console.log(Data);
    const res = await axiosInstance.post("DoctorSlots/save-slots", Data);
    return res;
  };

  const getSlots = async () => {
    const res = await axiosInstance.get("DoctorSlots/all-slots");
    return res.data.slots;
  };

  const getDoctorSlots = async (id) => {
    const res = await axiosInstance.get(`DoctorSlots/all-slots${id}`);
    return res.data.slots;
  };

  const Book = async (id) => {
    console.log(id);
    const res = await axiosInstance.post(
      `Appointment/Book?scheduleTableId=${id}`,
    );
    return res;
  };

  return {
    getWorkDetails,
    saveWorkDetails,
    saveAVSlots,
    getSlots,
    getDoctorSlots,
    Book,
  };
};
