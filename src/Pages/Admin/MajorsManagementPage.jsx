import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminMasterDataAPI } from "../../api/adminMasterDataAPI";
import { toast } from "react-toastify";

export default function MajorsManagementPage() {
  const adminAPI = useAdminMasterDataAPI();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(null); // { id, name, iconpath, description }
  const [name, setName] = useState("");
  const [iconPath, setIconPath] = useState("");
  const [description, setDescription] = useState("");

  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  const {
    data: majors = [],
    isLoading,
  } = useQuery({
    queryKey: ["admin-majors"],
    queryFn: adminAPI.getAllMajors,
    staleTime: 1000 * 60 * 10,
  });

  const resetForm = () => {
    setEditing(null);
    setName("");
    setIconPath("");
    setDescription("");
  };

  const addMutation = useMutation({
    mutationFn: (payload) => adminAPI.addMajor(payload),
    onSuccess: () => {
      toast.success("Major added successfully");
      queryClient.invalidateQueries(["admin-majors"]);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to add major");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminAPI.updateMajor(id, payload),
    onSuccess: () => {
      toast.success("Major updated successfully");
      queryClient.invalidateQueries(["admin-majors"]);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to update major");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteMajor(id),
    onSuccess: () => {
      toast.success("Major deleted successfully");
      queryClient.invalidateQueries(["admin-majors"]);
    },
    onError: (error) => {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : "Failed to delete major");
      console.error("Delete major error:", error?.response?.data || error);
      toast.error(serverMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedIconPath = iconPath.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (trimmedDescription && trimmedDescription.length < 5) {
      toast.error("Description must be at least 5 characters");
      return;
    }

    const payload = {
      name: trimmedName,
      iconPath: trimmedIconPath || null,
      description: trimmedDescription || null,
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setName(item.name || "");
    setIconPath(item.iconpath || item.iconPath || "");
    setDescription(item.description || "");

    // Scroll للفورم و Focus على الاسم
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 0);
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Delete major "${item.name}"?`)) return;
    if (!item?.id) {
      toast.error("Major ID not found");
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
            Majors Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage doctor specializations (majors) available during signup.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 space-y-4 w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      >
        <h2 className="text-sm sm:text-base font-semibold text-gray-800">
          {editing ? "Edit Major" : "Add New Major"}
        </h2>

        {/* Fields (stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Major name..."
              ref={nameInputRef}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Icon Path */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Icon Path (URL)
            </label>
            <input
              type="text"
              value={iconPath}
              onChange={(e) => setIconPath(e.target.value)}
              placeholder="https://.../icon.png"
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description about this major..."
              rows={3}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Actions row تحت الفورم */}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-[#316BE8] text-white text-sm font-medium hover:bg-[#274fb3] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {editing ? "Save" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  Icon
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : majors.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No majors found.
                  </td>
                </tr>
              ) : (
                majors.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 align-middle">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium align-middle">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 align-middle text-center">
                      {item.iconpath || item.iconPath ? (
                        <div className="inline-flex w-8 h-8 rounded-md border border-gray-200 overflow-hidden bg-gray-50 items-center justify-center">
                          <img
                            src={item.iconpath || item.iconPath}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs align-middle">
                      {item.description ? (
                        <span className="line-clamp-2">
                          {item.description}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          No description
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center whitespace-nowrap align-middle">
                      <div className="inline-flex items-center gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-blue-600 bg-blue-50/60 hover:bg-blue-100 transition-colors duration-150"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-red-600 bg-red-50/60 hover:bg-red-100 transition-colors duration-150"
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

