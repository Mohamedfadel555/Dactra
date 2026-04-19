import { motion } from "framer-motion";
import AvatarIcon from "../Common/AvatarIcon1";

import Logo from "../../assets/images/icons/dactraIcon.webp";
import {
  HiExclamationTriangle,
  HiOutlineDocumentText,
  HiSignal,
} from "react-icons/hi2";
import ErrorCard from "./ErrorCard";

function renderMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(\|.+\|\n?)+/g, (table) => {
      const rows = table.trim().split("\n");
      if (rows.length < 2) return table;
      const isAlignRow = /^\|[\s\-|:]+\|$/.test(rows[1]);
      const body = isAlignRow ? rows.slice(2) : rows.slice(1);
      const parseCells = (row) =>
        row
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
      const headerCells = parseCells(rows[0])
        .map((c) => `<th>${c}</th>`)
        .join("");
      const bodyRows = body
        .map(
          (r) =>
            `<tr>${parseCells(r)
              .map((c) => `<td>${c}</td>`)
              .join("")}</tr>`,
        )
        .join("");
      return `<table class="md-table"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    })
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/(^[\-\*] .+(\n|$))+/gm, (block) => {
      const items = block
        .trim()
        .split("\n")
        .map((l) => `<li>${l.replace(/^[\-\*] /, "")}</li>`)
        .join("");
      return `<ul class="md-ul">${items}</ul>`;
    })
    .replace(/(^\d+\. .+(\n|$))+/gm, (block) => {
      const items = block
        .trim()
        .split("\n")
        .map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`)
        .join("");
      return `<ol class="md-ol">${items}</ol>`;
    })
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br/>");
  return `<p>${html}</p>`;
}

const mdStyles = `
    .md-content h3.md-h3{font-size:13px;font-weight:700;color:#1e40af;margin:10px 0 5px;padding-bottom:3px;border-bottom:1px solid #bfdbfe}
    .md-content strong{font-weight:700;color:#1e3a8a}
    .md-content em{font-style:italic;color:#475569}
    .md-content .md-ul,.md-content .md-ol{margin:6px 0 6px 4px;padding:0;list-style:none;display:flex;flex-direction:column;gap:3px}
    .md-content .md-ul li{padding-left:14px;position:relative;font-size:13px;line-height:1.5;color:#334155}
    .md-content .md-ul li::before{content:"•";position:absolute;left:3px;color:#3b82f6;font-weight:700}
    .md-content .md-ol{list-style:decimal;list-style-position:inside}
    .md-content .md-ol li{font-size:13px;line-height:1.5;color:#334155}
    .md-content .md-table{width:100%;border-collapse:collapse;margin:8px 0;font-size:12px;border-radius:8px;overflow:hidden}
    .md-content .md-table th{background:#eff6ff;color:#1e40af;font-weight:700;padding:6px 10px;text-align:left;border:1px solid #bfdbfe}
    .md-content .md-table td{padding:5px 10px;border:1px solid #e0f0ff;color:#334155;background:#fff}
    .md-content .md-table tr:nth-child(even) td{background:#f8fbff}
    .md-content p{margin:4px 0;font-size:13px;line-height:1.65;color:#334155}
    .md-content p:first-child{margin-top:0}
    .md-content p:last-child{margin-bottom:0}
    .md-content[dir="rtl"] .md-ul li{padding-left:0;padding-right:14px}
    .md-content[dir="rtl"] .md-ul li::before{left:auto;right:3px}
  `;
export default function Message({ msg, lang }) {
  const isUser = msg.role === "user";
  const isAnalysis = msg.role === "analysis";
  const isError = msg.isError;
  const isEmerg = msg.isEmergency;
  const msgLang = msg.lang || lang || "en";
  const isRtl = msgLang === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {isUser ? (
        <AvatarIcon />
      ) : isError ? (
        <HiExclamationTriangle className="size-7 text-red-600" />
      ) : (
        <img src={Logo} alt="logo" className="size-[30px]" />
      )}

      <div
        className={`max-w-[78%] sm:max-w-[68%] flex flex-col gap-1.5 ${isUser ? "items-start" : "items-end"}`}
      >
        {!isUser && !isError && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAnalysis ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-500 border border-blue-100"}`}
          >
            {isAnalysis ? "Dactra · Analysis" : "Dactra"}
          </span>
        )}
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {msg.attachments.map((att, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-xl border text-[11px] font-medium flex items-center gap-2 ${isUser ? "bg-blue-100 border-blue-200 text-blue-700" : "bg-slate-50 border-slate-200 text-slate-600"}`}
              >
                {att.type === "pdf" ? (
                  <HiOutlineDocumentText className="w-4 h-4 flex-shrink-0 text-red-500" />
                ) : (
                  <img
                    src={att.preview}
                    alt={att.name}
                    className="w-9 h-9 object-cover rounded-lg border border-blue-200"
                  />
                )}
                <span className="truncate max-w-[150px]">{att.name}</span>
              </div>
            ))}
          </div>
        )}
        {isError ? (
          <ErrorCard
            errorType={msg.errorType}
            rawMessage={msg.rawErrorMessage}
            lang={msgLang}
          />
        ) : isEmerg ? (
          <div
            className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3"
            dir={dir}
          >
            <HiExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[13px] font-semibold text-red-700 leading-relaxed">
              {msg.text}
            </p>
          </div>
        ) : msg.text ? (
          isUser ? (
            <div
              className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl ${isRtl ? "rounded-bl-sm" : "rounded-br-sm"} whitespace-pre-wrap`}
              dir={dir}
            >
              {msg.text}
            </div>
          ) : (
            <div
              className={`px-4 py-3 text-sm shadow-sm rounded-2xl ${isRtl ? "rounded-br-sm" : "rounded-bl-sm"} border ${isAnalysis ? "bg-white border-emerald-100" : "bg-white border-blue-100"}`}
              dir={dir}
            >
              <style>{mdStyles}</style>
              <div
                className="md-content"
                dir={dir}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
              />
              {msg.model && (
                <p className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-300 flex items-center gap-1">
                  <HiSignal className="w-3 h-3" />
                  {msg.model}
                </p>
              )}
            </div>
          )
        ) : null}
      </div>
    </motion.div>
  );
}
