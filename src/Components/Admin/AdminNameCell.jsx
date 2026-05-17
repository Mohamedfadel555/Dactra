import { useState } from "react";
import {
  getAdminDisplayName,
  pickAdminImageUrl,
} from "../../utils/adminEntityHelpers";

export default function AdminNameCell({ entity, fallback = "?" }) {
  const [imgError, setImgError] = useState(false);
  const src = pickAdminImageUrl(entity);
  const name = getAdminDisplayName(entity);
  const initial = name?.trim()?.[0]?.toUpperCase() || fallback;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
        {src && !imgError ? (
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-500">
            {initial}
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-gray-900 truncate">
        {name || "N/A"}
      </span>
    </div>
  );
}
