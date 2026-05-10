import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePerceptionAPI } from "./../api/perceptionAPI";

function mapPayload(appointmentId, { diagnosis, medicines }) {
  return {
    appointmentId: Number(appointmentId),
    diagnosis,
    medicines: medicines.map((med) => ({
      name: med.name,
      // dose اختياري — بنبعته بس لو فيه قيمة
      ...(med.dose?.trim() ? { dose: med.dose.trim() } : {}),
      duration: Number(med.duration), // عدد الأيام دايمًا رقم
      timesPerDay: med.schedule?.frequency ?? 1,
      whenToTake: med.schedule?.mealRelation ?? 1,
      firstDoseTime: med.schedule?.firstDoseTime ?? "08:00",
    })),
  };
}

// Map API response → sidebar form shape
function mapResponseToForm(data) {
  if (!data) return null;
  return {
    diagnosis: data.diagnosis ?? "",
    medicines: data.medicines.map((med) => ({
      name: med.name,
      dose: med.dose ?? "", // اختياري
      duration: med.duration ?? 1, // رقم (أيام)
      schedule: {
        frequency: med.timesPerDay,
        mealRelation: med.whenToTake,
        firstDoseTime: med.firstDoseTime?.slice(0, 5) ?? "08:00", // "12:00:00" → "12:00"
      },
    })),
  };
}

export function useSavePrescription(appointmentId, options = {}) {
  const { savePerception, getPrescriptionByAppointment } = usePerceptionAPI();
  const queryClient = useQueryClient();

  // Fetch existing prescription (runs in background on mount)
  const {
    data: existingPrescription,
    isLoading: isLoadingPrescription,
    isError: prescriptionNotFound,
  } = useQuery({
    queryKey: ["prescription", appointmentId],
    queryFn: () => getPrescriptionByAppointment(appointmentId),
    select: mapResponseToForm,
    retry: false, // لو مفيش روشتة متحاولش تاني
    enabled: !!appointmentId,
  });

  const mutation = useMutation({
    mutationFn: (payload) => {
      const body = mapPayload(appointmentId, payload);
      return savePerception(body);
    },

    onSuccess: (data, variables, context) => {
      // Refetch بعد الحفظ عشان الـ sidebar يتحدث لو اتفتح تاني
      queryClient.invalidateQueries(["prescription", appointmentId]);
      options.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      console.error(
        "[useSavePrescription] Failed to save prescription:",
        error,
      );
      options.onError?.(error, variables, context);
    },

    onSettled: options.onSettled,
  });

  return {
    ...mutation,
    existingPrescription, // البيانات المحوّلة جاهزة للـ form
    isLoadingPrescription,
    hasPrescription: !!existingPrescription && !prescriptionNotFound,
  };
}
