import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminMasterDataAPI } from "../../api/adminMasterDataAPI";
import { toast } from "react-toastify";

export default function ChronicDiseasesManagementPage() {
  const adminAPI = useAdminMasterDataAPI();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(null); // { id, name }
  const [name, setName] = useState("");
  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  const {
    data: diseases = [],
    isLoading,
  } = useQuery({
    queryKey: ["admin-chronic-diseases"],
    queryFn: adminAPI.getAllChronic,
    staleTime: 1000 * 60 * 10,
  });

  const resetForm = () => {
    setEditing(null);
    setName("");
  };

  const addMutation = useMutation({
    mutationFn: (payload) => adminAPI.addChronic(payload),
    onSuccess: () => {
      toast.success("Chronic disease added successfully");
      queryClient.invalidateQueries(["admin-chronic-diseases"]);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to add chronic disease");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminAPI.updateChronic(id, payload),
    onSuccess: () => {
      toast.success("Chronic disease updated successfully");
      queryClient.invalidateQueries(["admin-chronic-diseases"]);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to update chronic disease");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteChronic(id),
    onSuccess: () => {
      toast.success("Chronic disease deleted successfully");
      queryClient.invalidateQueries(["admin-chronic-diseases"]);
    },
    onError: (error) => {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : "Failed to delete chronic disease");
      console.error("Delete chronic disease error:", error?.response?.data || error);
      toast.error(serverMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    const payload = { name: trimmedName };

    if (editing) {
      updateMutation.mutate({ id: editing.id, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setName(item.name || "");
    // scroll + focus
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 0);
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Delete chronic disease "${item.name}"?`)) return;
    if (!item?.id) {
      toast.error("Chronic disease ID not found");
      return;
    }
    deleteMutation.mutate(item.id);
  };

  const isSubmitting =
    addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Chronic Diseases Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Control the list of chronic diseases used across the app.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 space-y-4 w-full"
      >
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">
          {editing ? "Edit Chronic Disease" : "Add New Chronic Disease"}
        </h2>
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chronic disease name..."
              ref={nameInputRef}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#316BE8] text-white text-sm font-medium hover:bg-[#274fb3] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {editing ? "Save" : "Add"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : diseases.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No chronic diseases found.
                  </td>
                </tr>
              ) : (
                diseases.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 align-middle">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 align-middle">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-center whitespace-nowrap align-middle">
                      <div className="inline-flex items-center gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-blue-600 bg-blue-50/60 hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-red-600 bg-red-50/60 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

