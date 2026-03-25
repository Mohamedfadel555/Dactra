import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";

function createEmptyService() {
  return { id: Date.now(), name: "", price: "", description: "" };
}

export default function ProviderServicesPage() {
  const { role } = useAuth();
  const isLab = (role || "").toLowerCase() === "lab" || (role || "").toLowerCase() === "lap";
  const [services, setServices] = useState([
    {
      id: 1,
      name: isLab ? "CBC" : "X-Ray",
      price: isLab ? "150" : "300",
      description: isLab
        ? "Complete Blood Count"
        : "Standard radiology imaging",
    },
  ]);

  const handleChange = (id, field, value) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const handleAdd = () => {
    setServices((prev) => [...prev, createEmptyService()]);
  };

  const handleRemove = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {isLab ? "Lab Tests" : "Scan Services"}
        </h1>
      </div>
      {/* <p className="text-gray-600 mb-6">
        Manage the services you provide. These are stored locally for now and
        will be connected to backend APIs later (see{" "}
        <code>docs/BACKEND_APIS_NEEDED.md</code>).
      </p> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-4 space-y-3"
          >
            <div className="flex flex-col gap-3">
              <div className="w-full">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) =>
                    handleChange(service.id, "name", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#316BE8] focus:border-transparent"
                  placeholder={isLab ? "e.g. CBC, Glucose" : "e.g. MRI, CT"}
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Price (EGP)
                </label>
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) =>
                    handleChange(service.id, "price", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#316BE8] focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Description
              </label>
              <textarea
                value={service.description}
                onChange={(e) =>
                  handleChange(service.id, "description", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#316BE8] focus:border-transparent min-h-[60px]"
                placeholder="Short description for patients..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleRemove(service.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 rounded-xl bg-[#316BE8] text-white text-sm font-semibold hover:bg-[#2552c1] transition"
        >
          Add Service
        </button>
      </div>
    </div>
  );
}

