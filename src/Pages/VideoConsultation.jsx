import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../hooks/useAxios";
import { useAuth } from "../Context/AuthContext";

function sanitizeDomain(raw = "") {
  const mdMatch = raw.match(/^\[([^\]]+)\]/);
  if (mdMatch) return mdMatch[1].trim();
  return raw
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();
}

const createVideoCallApi = (axios) => ({
  join: async (appointmentId) => {
    const { data } = await axios.post(`VideoCall/join/${appointmentId}`);
    return data;
  },
  getStatus: async (appointmentId) => {
    const { data } = await axios.get(`VideoCall/status/${appointmentId}`);
    return data;
  },
  end: async (appointmentId) => {
    const { data } = await axios.post(`VideoCall/end/${appointmentId}`);
    return data;
  },
});

function loadJitsiScript(domain) {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) return resolve();
    const script = document.createElement("script");
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error(`Failed to load Jitsi script from ${domain}`));
    document.head.appendChild(script);
  });
}

function useTimer(active) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!active) return;
    setSec(0);
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

function StatusOverlay({ status, isDoctor, onRejoin }) {
  if (status === "connected") return null;
  const map = {
    loading: {
      icon: <Spinner />,
      title: "جاري تحميل الجلسة...",
      sub: "يتم جلب بيانات الاستشارة",
    },
    waiting: {
      icon: <VideoIcon />,
      title: isDoctor ? "في انتظار المريض..." : "في انتظار الطبيب...",
      sub: isDoctor
        ? "يمكنك البدء الآن، سينضم المريض قريباً"
        : "ستبدأ المكالمة تلقائياً عند انضمام الطبيب",
    },
    connecting: {
      icon: <Spinner />,
      title: "جاري الاتصال...",
      sub: "يتم إعداد جلسة الفيديو الآمنة",
    },
    left: {
      icon: <LeftIcon />,
      title: "غادرت المكالمة",
      sub: "الجلسة لا تزال نشطة، يمكنك العودة إليها",
    },
    ended: {
      icon: <CheckIcon />,
      title: "انتهت الاستشارة",
      sub: isDoctor
        ? "يمكنك مراجعة ملاحظاتك قبل المغادرة"
        : "ستكون الوصفة الطبية متاحة قريباً",
    },
    error: {
      icon: <ErrorIcon />,
      title: "خطأ في الاتصال",
      sub: "يرجى تحديث الصفحة والمحاولة مرة أخرى",
    },
  };
  const c = map[status] || map.loading;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, #BFDBFE 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute w-48 h-48 rounded-full border border-blue-100 animate-ping opacity-30" />
      <div
        className="absolute w-64 h-64 rounded-full border border-blue-50 animate-ping opacity-20"
        style={{ animationDelay: "0.5s" }}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl border border-blue-100 px-12 py-10 flex flex-col items-center gap-5 max-w-sm text-center">
        {c.icon}
        <div>
          <p className="text-gray-800 font-semibold text-lg leading-snug">
            {c.title}
          </p>
          <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
            {c.sub}
          </p>
        </div>
        {status === "left" && onRejoin && (
          <button
            onClick={onRejoin}
            className="mt-1 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition shadow-sm"
          >
            العودة للمكالمة
          </button>
        )}
        {status === "error" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-1 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition shadow-sm"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
}

const Spinner = () => (
  <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
);
const VideoIcon = () => (
  <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center">
    <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14v-4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="6"
        width="12"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  </div>
);
const CheckIcon = () => (
  <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
    <svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
const ErrorIcon = () => (
  <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
    <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
const LeftIcon = () => (
  <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center">
    <svg className="w-7 h-7 text-yellow-500" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default function VideoConsultation() {
  const { appointmentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDoctor = (searchParams.get("role") || "patient") === "doctor";
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const axios = useAxios();

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const sessionDataRef = useRef(null);

  const [callStatus, setCallStatus] = useState("loading");
  const [sessionData, setSessionData] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const timer = useTimer(callStatus === "connected");

  const { data: statusData } = useQuery({
    queryKey: ["videoCall", "status", appointmentId],
    queryFn: () => createVideoCallApi(axios).getStatus(appointmentId),
    enabled:
      !!appointmentId &&
      !!accessToken &&
      !sessionEnded &&
      callStatus !== "error",
    refetchInterval: 6000,
  });

  const endSessionMutation = useMutation({
    mutationFn: () => createVideoCallApi(axios).end(appointmentId),
    onSuccess: () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      setSessionEnded(true);
      setCallStatus("ended");
      queryClient.invalidateQueries(["videoCall", "status", appointmentId]);
    },
    onError: () => {
      setSessionEnded(true);
      setCallStatus("ended");
    },
  });

  const initJitsi = useCallback(
    async (data) => {
      if (!jitsiContainerRef.current) return;
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }

      const jitsiDomain = sanitizeDomain(data.jitsiDomain || "8x8.vc");
      const { roomName, jitsiToken, displayName = "User", role } = data;
      const isModerator = role === "moderator";

      setCallStatus("connecting");
      await loadJitsiScript(jitsiDomain);
      if (!jitsiContainerRef.current) return;

      const jitsiOptions = {
        roomName,
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
  startWithAudioMuted: false,
  startWithVideoMuted: false,
  disableDeepLinking: true,
  prejoinPageEnabled: false,
  prejoinConfig: { enabled: false },  // ← أضف
  skipPrejoin: true,                  // ← أضف
  disableInviteFunctions: true,
  remoteVideoMenu: {
    disableKick: !isModerator,
    disableDemote: !isModerator,
  },
  lobby: { autoKnock: false, enableChat: false, enable: false },
  toolbarButtons: [
    "microphone",
    "camera",
    "hangup",
    "tileview",
    "fullscreen",
    ...(isModerator ? ["mute-everyone", "security"] : []),
  ],
},
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          HIDE_INVITE_MORE_HEADER: true,
          MOBILE_APP_PROMO: false,
        },
        userInfo: { displayName, moderator: isModerator },
        width: "100%",
        height: "100%",
      };

      // ✅ التغيير الأول — بعت الـ JWT دايماً مع JaaS
      if (jitsiToken) {
        jitsiOptions.jwt = jitsiToken;
      }

      const jitsi = new window.JitsiMeetExternalAPI(jitsiDomain, jitsiOptions);
      jitsiApiRef.current = jitsi;

      const fallbackTimer = setTimeout(() => {
        if (jitsiApiRef.current) {
          console.log("⚡ Fallback: forcing connected");
          setCallStatus("connected");
        }
      }, 8000);

      jitsi.addEventListeners({
        videoConferenceJoined: () => {
          clearTimeout(fallbackTimer);
          setCallStatus("connected");
        },
        videoConferenceLeft: () => {
          jitsiApiRef.current = null;
          if (!sessionEnded) setCallStatus("left");
        },
        readyToClose: () => {
          if (jitsiApiRef.current) {
            jitsiApiRef.current.dispose();
            jitsiApiRef.current = null;
          }
          if (!sessionEnded) setCallStatus("left");
        },
        errorOccurred: (err) => {
          if (err?.error?.isFatal) setCallStatus("error");
        },
      });
    },
    [sessionEnded],
  );

  const handleRejoin = useCallback(async () => {
    if (!sessionDataRef.current) return;
    try {
      await initJitsi(sessionDataRef.current);
    } catch {
      setCallStatus("error");
    }
  }, [initJitsi]);

  // ✅ التغيير الثاني — المريض ميعملش join هنا
  useEffect(() => {
    if (!appointmentId || !accessToken) return;
    let disposed = false;
    const api = createVideoCallApi(axios);

    (async () => {
      try {
        setCallStatus("loading");

        if (isDoctor) {
          const data = await api.join(appointmentId);
          if (disposed) return;
          setSessionData(data);
          sessionDataRef.current = data;
          await initJitsi(data);
        } else {
          // ✅ المريض بس بيستنى — من غير join
          setCallStatus("waiting");
        }
      } catch (err) {
        if (!disposed) {
          console.error("Init error:", err);
          setCallStatus("error");
        }
      }
    })();

    return () => {
      disposed = true;
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, accessToken]);

  // ✅ المريض بيعمل join بس لما isDoctorOnline = true
  useEffect(() => {
    if (isDoctor) return;
    if (!statusData?.isDoctorOnline) return;
    if (sessionEnded) return;
    if (callStatus !== "waiting") return;

    const api = createVideoCallApi(axios);
    api
      .join(appointmentId)
      .then((data) => {
        setSessionData(data);
        sessionDataRef.current = data;
        return initJitsi(data);
      })
      .catch(() => setCallStatus("error"));
  }, [statusData?.isDoctorOnline, callStatus, sessionEnded]);

  const endSession = useCallback(() => {
    if (endSessionMutation.isPending) return;
    endSessionMutation.mutate();
  }, [endSessionMutation]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 shadow-sm flex-shrink-0 z-30">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4 9h10M9 4v10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-800 tracking-tight">
              Dactara
            </span>
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <span className="text-sm text-gray-400 font-medium">
            استشارة أونلاين
          </span>
        </div>

        <div className="flex items-center justify-center flex-1">
          {callStatus === "connected" ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              مباشر · {timer}
            </div>
          ) : callStatus === "left" ? (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              خارج المكالمة · الجلسة نشطة
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-400 px-4 py-1.5 rounded-full text-sm font-medium">
              {{
                loading: "جاري التهيئة...",
                waiting: isDoctor ? "في انتظار المريض" : "في انتظار الطبيب",
                connecting: "جاري الاتصال...",
                ended: "انتهت الجلسة",
                error: "خطأ في الاتصال",
              }[callStatus] || "..."}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 justify-end flex-1">
          {sessionData && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                {sessionData.displayName?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none mb-0.5">
                  {isDoctor ? "دكتور" : "مريض"}
                </p>
                <p className="text-sm font-semibold text-gray-700 leading-none">
                  {sessionData.displayName}
                </p>
              </div>
            </div>
          )}
          {!sessionEnded && callStatus !== "error" && (
            <button
              onClick={endSession}
              disabled={endSessionMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.52 10.5 19.79 19.79 0 01.44 1.88 2 2 0 012.44 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 003.77 5.4z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              {endSessionMutation.isPending
                ? "جاري الإنهاء..."
                : "إنهاء الجلسة"}
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative bg-gray-900 overflow-hidden">
          <div
            ref={jitsiContainerRef}
            className="absolute inset-0 w-full h-full"
          />
          <StatusOverlay
            status={callStatus}
            isDoctor={isDoctor}
            onRejoin={!sessionEnded ? handleRejoin : null}
          />
          {(callStatus === "ended" || callStatus === "error") && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition shadow-md"
              >
                ← العودة للوحة التحكم
              </button>
            </div>
          )}
        </div>

        <aside className="w-96 flex-shrink-0 bg-white border-l border-gray-100 flex flex-col overflow-hidden shadow-lg">
          <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-base font-bold text-gray-800">تفاصيل الجلسة</h2>
            {sessionData?.sessionId && (
              <p className="text-xs text-gray-400 mt-0.5">
                رقم الجلسة:{" "}
                <span className="font-semibold text-gray-600">
                  #{sessionData.sessionId}
                </span>
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {sessionData && (
              <>
                {[
                  {
                    icon: "👤",
                    label: "المشارك",
                    value: sessionData.displayName || "—",
                  },
                  {
                    icon: "🎭",
                    label: "الدور",
                    value:
                      sessionData.role === "moderator" ? "طبيب (مشرف)" : "مريض",
                  },
                  {
                    icon: "📋",
                    label: "حالة الجلسة",
                    value: sessionEnded
                      ? "منتهية"
                      : callStatus === "connected"
                        ? "جارية الآن"
                        : callStatus === "left"
                          ? "خارج المكالمة"
                          : callStatus === "waiting"
                            ? "في الانتظار"
                            : "جاري الاتصال...",
                    highlight: callStatus === "connected",
                  },
                  {
                    icon: "🚪",
                    label: "الغرفة",
                    value: sessionData.roomName || "—",
                  },
                  ...(statusData
                    ? [
                        {
                          icon: "🩺",
                          label: "الطبيب",
                          value: statusData.isDoctorOnline
                            ? "متصل"
                            : "غير متصل",
                          highlight: statusData.isDoctorOnline,
                        },
                        {
                          icon: "🧑‍🤝‍🧑",
                          label: "المريض",
                          value: statusData.isPatientOnline
                            ? "متصل"
                            : "غير متصل",
                          highlight: statusData.isPatientOnline,
                        },
                      ]
                    : []),
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-100 rounded-xl"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">
                        {item.label}
                      </p>
                      <p
                        className={`text-sm font-semibold truncate ${item.highlight ? "text-green-500" : "text-gray-700"}`}
                      >
                        {item.value}
                        {item.highlight && (
                          <span className="inline-block w-2 h-2 rounded-full bg-green-400 ml-1.5 animate-pulse" />
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {callStatus === "left" && !sessionEnded && (
              <button
                onClick={handleRejoin}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition shadow-sm"
              >
                العودة للمكالمة
              </button>
            )}

            {callStatus === "error" && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-red-500 mb-1">
                  ⚠️ فشل الاتصال
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  تعذّر الاتصال بالخادم. تأكد من صلاحيتك وحاول مجدداً.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-1">
              <p className="text-sm font-bold text-blue-600 mb-2">
                💡 نصائح للاستشارة
              </p>
              <ul className="space-y-1.5 text-xs text-gray-500 list-disc list-inside leading-relaxed">
                {(isDoctor
                  ? [
                      "استمع جيداً لوصف المريض",
                      "اطرح أسئلة واضحة ومحددة",
                      "وضّح التشخيص والخطوات التالية",
                      "تأكد من فهم المريض للتعليمات",
                    ]
                  : [
                      "اشرح أعراضك بوضوح",
                      "اذكر الأدوية التي تتناولها حالياً",
                      "اسأل عن التشخيص والخطوات التالية",
                      "ستُحفظ الوصفة تلقائياً",
                    ]
                ).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              محمية بتشفير Jitsi Meet من طرف لطرف
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
