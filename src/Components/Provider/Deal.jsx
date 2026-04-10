import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

export function Deal({ doctor, onClose, onSubmit }) {
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const validate = () => {
    const newErrors = {};
    if (!discount || discount < 1 || discount > 100)
      newErrors.discount = "Enter a valid discount between 1 and 100";
    if (!description.trim())
      newErrors.description = "Please enter a deal description";
    if (startDate && endDate && startDate > endDate)
      newErrors.dates = "Start date must be before end date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSubmit({
        doctorId: doctor._id,
        discount: Number(discount),
        description,
        startDate: startDate || null,
        endDate: endDate || null,
      });
      setSuccess(true);
      setTimeout(() => handleClose(), 1800);
    } catch (err) {
      console.error("Deal submission failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const initials = doctor?.name
    ? doctor.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
    : "DR";

  return (
    <>
      <style>{`
        @keyframes backdropIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes backdropOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes modalIn  { from { opacity:0; transform:translateY(28px) scale(0.96) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes modalOut { from { opacity:1; transform:translateY(0) scale(1) } to { opacity:0; transform:translateY(28px) scale(0.96) } }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes checkPop { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.25) rotate(6deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:.5} 100%{transform:scale(2.4);opacity:0} }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }

        .dm-field { animation: fadeSlideIn 0.32s ease both; }
        .dm-field:nth-child(1){animation-delay:.05s}
        .dm-field:nth-child(2){animation-delay:.11s}
        .dm-field:nth-child(3){animation-delay:.17s}
        .dm-field:nth-child(4){animation-delay:.23s}
        .dm-field:nth-child(5){animation-delay:.29s}
        .dm-shake { animation: shake 0.38s ease; }

        .dm-input {
          width:100%; padding:10px 14px; font-size:14px;
          border:1.5px solid #e5e7eb; border-radius:12px;
          outline:none; background:#fff; color:#111827;
          transition:border-color .2s, box-shadow .2s;
          box-sizing:border-box; font-family:inherit;
        }
        .dm-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.13); }
        .dm-input.err { border-color:#f87171; background:#fff8f8; }
        .dm-input::placeholder { color:#9ca3af; }

        .dm-cancel {
          flex:1; padding:10px 0; font-size:14px;
          border:1.5px solid #e5e7eb; border-radius:12px;
          background:#fff; color:#6b7280; cursor:pointer;
          transition:background .15s, color .15s;
        }
        .dm-cancel:hover { background:#f9fafb; color:#374151; }

        .dm-submit {
          flex:2; padding:10px 0; font-size:14px; font-weight:600;
          border:none; border-radius:12px;
          background:linear-gradient(135deg,#3b82f6,#2563eb);
          color:#fff; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow:0 4px 14px rgba(37,99,235,.28);
          transition:transform .12s, box-shadow .12s;
        }
        .dm-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(37,99,235,.34); }
        .dm-submit:active:not(:disabled) { transform:translateY(1px); box-shadow:0 2px 8px rgba(37,99,235,.2); }
        .dm-submit:disabled { background:#93c5fd; cursor:not-allowed; box-shadow:none; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={(e) => e.target === e.currentTarget && handleClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          animation: `${visible ? "backdropIn" : "backdropOut"} 0.3s ease both`,
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            width: "100%",
            maxWidth: 440,
            boxShadow: "0 24px 60px rgba(0,0,0,0.16)",
            overflow: "hidden",
            animation: `${visible ? "modalIn" : "modalOut"} 0.3s cubic-bezier(.34,1.56,.64,1) both`,
          }}
        >
          {/* ── SUCCESS ── */}
          {success ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem 2rem",
                gap: "1rem",
                textAlign: "center",
              }}
            >
              <div style={{ position: "relative", width: 72, height: 72 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "rgba(34,197,94,.15)",
                    animation: "ripple 1s ease-out infinite",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#4ade80,#16a34a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "checkPop .5s cubic-bezier(.34,1.56,.64,1) both",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#fff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Deal Sent!
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Your offer has been sent to <strong>{doctor?.name}</strong>.
                <br />
                You'll be notified once they respond.
              </p>
            </div>
          ) : (
            <>
              {/* ── HEADER ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px 18px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1d4ed8",
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      Make a Deal
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        margin: "2px 0 0",
                      }}
                    >
                      {doctor?.name} · {doctor?.specialization || "Specialist"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    transition: "background .15s, color .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#374151";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#9ca3af";
                  }}
                >
                  <MdClose size={18} />
                </button>
              </div>

              {/* ── FIELDS ── */}
              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* Discount */}
                <div className="dm-field">
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Discount Percentage{" "}
                    <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={discount}
                      onChange={(e) => {
                        setDiscount(e.target.value);
                        setErrors((p) => ({ ...p, discount: undefined }));
                      }}
                      placeholder="e.g. 20"
                      className={`dm-input${errors.discount ? " err" : ""}`}
                      style={{ flex: 1 }}
                    />
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#3b82f6",
                        flexShrink: 0,
                      }}
                    >
                      %
                    </div>
                  </div>
                  {errors.discount && (
                    <p
                      className="dm-shake"
                      style={{
                        fontSize: 12,
                        color: "#ef4444",
                        margin: "5px 0 0",
                      }}
                    >
                      {errors.discount}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="dm-field">
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Deal Description <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors((p) => ({ ...p, description: undefined }));
                    }}
                    placeholder={`e.g. ${discount || "20"}% off all blood tests for Dr. ${doctor?.name?.split(" ")[0] || "Smith"}'s patients...`}
                    className={`dm-input${errors.description ? " err" : ""}`}
                    style={{ resize: "none", lineHeight: 1.6 }}
                  />
                  {errors.description && (
                    <p
                      className="dm-shake"
                      style={{
                        fontSize: 12,
                        color: "#ef4444",
                        margin: "5px 0 0",
                      }}
                    >
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="dm-field">
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#374151",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Deal Duration{" "}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "#9ca3af",
                      }}
                    >
                      (optional)
                    </span>
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    {[
                      ["From", "startDate", startDate, setStartDate],
                      ["To", "endDate", endDate, setEndDate],
                    ].map(([label, , val, set]) => (
                      <div key={label}>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            margin: "0 0 5px",
                          }}
                        >
                          {label}
                        </p>
                        <input
                          type="date"
                          value={val}
                          onChange={(e) => {
                            set(e.target.value);
                            setErrors((p) => ({ ...p, dates: undefined }));
                          }}
                          className={`dm-input${errors.dates ? " err" : ""}`}
                          style={{ fontSize: 13 }}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.dates && (
                    <p
                      className="dm-shake"
                      style={{
                        fontSize: 12,
                        color: "#ef4444",
                        margin: "5px 0 0",
                      }}
                    >
                      {errors.dates}
                    </p>
                  )}
                </div>

                {/* Info */}
                <div
                  className="dm-field"
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    background: "#f0f9ff",
                    borderRadius: 12,
                    padding: "10px 14px",
                    border: "1px solid #bae6fd",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#0ea5e9"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 8v4m0 4h.01"
                      stroke="#0ea5e9"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#0369a1",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    A request will be sent to the doctor for approval. Once
                    accepted, their patients will automatically receive this
                    discount.
                  </p>
                </div>
              </div>

              {/* ── FOOTER ── */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "16px 24px",
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <button className="dm-cancel" onClick={handleClose}>
                  Cancel
                </button>
                <button
                  className="dm-submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ animation: "spin .7s linear infinite" }}
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="rgba(255,255,255,.3)"
                          strokeWidth="2.5"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="#fff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Send Offer to Doctor
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
