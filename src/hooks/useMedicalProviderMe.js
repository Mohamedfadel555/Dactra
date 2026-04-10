import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";
import { useProviderAPI } from "../api/providerAPI";
import { useProviderPortalAPI } from "../api/providerPortalAPI";

export function pick(obj, camel, pascal) {
  return obj?.[camel] ?? obj?.[pascal];
}

export function medicalProviderMeQueryKey(accessToken, role) {
  return ["medicalProvider", "me", accessToken, role];
}

/**
 * Current lab/scan provider for logged-in MedicalTestProvider user.
 */
export function useMedicalProviderMe() {
  const { accessToken, role } = useAuth();
  const { getMedicalTestsProviders } = useProviderAPI();
  const portal = useProviderPortalAPI();

  const isLab =
    (role || "").toLowerCase() === "lab" ||
    (role || "").toLowerCase() === "lap";

  return useQuery({
    queryKey: medicalProviderMeQueryKey(accessToken, role),
    queryFn: async () => {
      try {
        const me = await portal.getMedicalProviderMe();
        if (me && (me.id ?? me.Id)) return me;
      } catch {
        /* continue */
      }
      const uid = portal.userIdFromToken(accessToken);
      if (uid) {
        try {
          const byUser = await portal.getMedicalProviderByUserId(uid);
          if (byUser && (byUser.id ?? byUser.Id)) return byUser;
        } catch {
          /* list fallback */
        }
      }
      const list = await getMedicalTestsProviders();
      const desiredType = isLab ? 0 : 1;
      return list.find((x) => x.type === desiredType) || list[0] || null;
    },
    enabled: !!accessToken,
  });
}
