function handleTime(create) {
  const diff = Date.now() - new Date(create).getTime();
  const m = diff / 60000;
  const h = m / 60;
  const d = h / 24;
  const w = d / 7;
  const mo = d / 30;
  const y = mo / 12;
  if (y >= 1) return `${Math.floor(y)}y ago`;
  if (mo >= 1) return `${Math.floor(mo)}mo ago`;
  if (w >= 1) return `${Math.floor(w)}w ago`;
  if (d >= 1) return `${Math.floor(d)}d ago`;
  if (h >= 1) return `${Math.floor(h)}h ago`;
  if (m >= 1) return `${Math.floor(m)}m ago`;
  return "now";
}

export default function AnswererInfo({ answerer, time, size = "md" }) {
  const nameSize = size === "sm" ? "text-[11.5px]" : "text-[13px]";
  const metaSize = size === "sm" ? "text-[10.5px]" : "text-[11.5px]";
  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-1.5 min-w-0">
      <span
        className={`${nameSize} font-bold text-slate-800 flex items-center gap-1 shrink-0`}
      >
        {answerer.fullName}
        {answerer.isDoctor && (
          <span className="inline-flex items-center text-[9px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded-md leading-none tracking-wide">
            DR
          </span>
        )}
      </span>
      <span className={`${metaSize} text-slate-300`}>·</span>
      <span className={`${metaSize} text-blue-400 font-medium`}>
        {answerer.specialty}
      </span>
      {answerer.yearsOfExperience > 0 && (
        <>
          <span className={`${metaSize} text-slate-300`}>·</span>
          <span className={`${metaSize} text-slate-400`}>
            {answerer.yearsOfExperience}y exp
          </span>
        </>
      )}
      <span className={`ml-auto ${metaSize} text-slate-300 shrink-0`}>
        {handleTime(time)}
      </span>
    </div>
  );
}
