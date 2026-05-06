import { useAxios } from "../hooks/useAxios";

export const usePerceptionAPI = () => {
  const axiosInstance = useAxios();

  const savePerception = async (Data) => {
    console.log(Data);
    const res = await axiosInstance.post("Prescriptions", Data);
    return res;
  };

  const getPrescriptionByAppointment = async (appointmentId) => {
    const res = await axiosInstance.get(
      `Prescriptions/appointment/${appointmentId}`,
    );
    return res.data;
  };

  return { savePerception, getPrescriptionByAppointment };
};
