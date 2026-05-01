import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationInbox } from "../../hooks/useNotificationInbox";
import { useAuth } from "../../Context/AuthContext";
import {
  pickMessage as pickMessageRaw,
  resolveNotificationTarget,
} from "../../utils/notificationNavigation";

function pickId(n) {
  return n?.id ?? n?.Id;
}

function pickMessage(n) {
  const m = pickMessageRaw(n);
  return m || "Notification";
}

function pickTime(n) {
  const raw =
    n?.createdAtUtc ??
    n?.CreatedAtUtc ??
    n?.createdAt ??
    n?.CreatedAt ??
    n?.createdAtUTC;
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleString();
  } catch {
    return "";
  }
}

function isUnread(n) {
  const v = n?.isRead ?? n?.IsRead;
  if (v === false) return true;
  if (v === true) return false;
  return !v;
}

export default function NotificationsPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { items, unreadCount, isLoading, markRead, refetch, listError, isError } =
    useNotificationInbox();

  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];
    arr.sort((a, b) => {
      const ta = new Date(
        a?.createdAtUtc ?? a?.CreatedAtUtc ?? a?.createdAt ?? a?.CreatedAt ?? 0,
      ).getTime();
      const tb = new Date(
        b?.createdAtUtc ?? b?.CreatedAtUtc ?? b?.createdAt ?? b?.CreatedAt ?? 0,
      ).getTime();
      return tb - ta;
    });
    return arr;
  }, [items]);

  if (!accessToken) {
    return (
      <div className="pt-[90px] px-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm text-slate-600">Please sign in to view notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[90px] px-4 pb-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-[12px] text-slate-500 mt-1">
            {unreadCount} unread
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {isError && (
        <div className="mb-3 bg-amber-50 border border-amber-100 text-amber-900 rounded-2xl p-3 text-[12px]">
          {listError || "Could not load notifications."}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : sorted.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No notifications yet.</div>
        ) : (
          sorted.map((n) => {
            const id = pickId(n);
            const unread = isUnread(n);
            const target = resolveNotificationTarget(n);
            return (
              <button
                key={String(id ?? pickMessage(n) + pickTime(n))}
                type="button"
                onClick={async () => {
                  let source = n;
                  if (id != null) {
                    try {
                      const res = await markRead(id);
                      source = res?.data?.data ?? res?.data ?? n;
                    } catch {
                      /* ignore */
                    }
                  }
                  const next = resolveNotificationTarget(source) || target;
                  if (next) navigate(next.to, { state: next.state });
                }}
                className={`w-full text-left px-5 py-4 border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${
                  unread ? "bg-blue-100/70" : ""
                }`}
              >
                <p className="text-[14px] font-semibold text-slate-900 leading-snug">
                  {pickMessage(n)}
                </p>
                {pickTime(n) && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    {pickTime(n)}
                  </p>
                )}
                {target && (
                  <p className="text-[11px] text-[#316BE8] mt-2 font-semibold">
                    Open →
                  </p>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

