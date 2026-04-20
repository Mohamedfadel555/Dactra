import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import { useLocation } from "react-router-dom";
import { useProviderPortalAPI } from "../../api/providerPortalAPI";
import { useMedicalProviderMe, pick } from "../../hooks/useMedicalProviderMe";
import Loader from "../../Components/Common/loader";
import {
  minutesToDurationSpan,
  durationSpanToMinutes,
} from "../../utils/workingHours";

function normOffering(o) {
  return {
    id: pick(o, "id", "Id"),
    providerId: pick(o, "providerId", "ProviderId"),
    testServiceId: pick(o, "testServiceId", "TestServiceId"),
    price: pick(o, "price", "Price"),
    duration: pick(o, "duration", "Duration"),
    testService: pick(o, "testService", "TestService") || {},
  };
}

function normTestService(t) {
  return {
    id: pick(t, "id", "Id"),
    name: pick(t, "name", "Name"),
    description: pick(t, "description", "Description"),
  };
}

export default function ProviderServicesPage({ type }) {
  const { role } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const portal = useProviderPortalAPI();
  const pathType = location.pathname.startsWith("/scan") ? "scan" : "lab";
  const normalizedType = (type || pathType || role || "").toLowerCase();
  const isLab = normalizedType !== "scan";

  const { data: provider, isLoading: loadingProvider } = useMedicalProviderMe();
  const providerId = provider ? pick(provider, "id", "Id") : null;

  const { data: offeringsRaw = [], isLoading: loadingOfferings } = useQuery({
    queryKey: ["providerOfferings", providerId],
    queryFn: () => portal.getProviderOfferings(providerId),
    enabled: providerId != null,
  });

  const { data: catalogRaw = [], isLoading: loadingCatalog } = useQuery({
    queryKey: ["testServices"],
    queryFn: () => portal.getTestServices(),
    enabled: providerId != null,
  });

  const offerings = offeringsRaw.map(normOffering);
  const catalog = catalogRaw.map(normTestService);

  const [newServiceId, setNewServiceId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDurationMin, setNewDurationMin] = useState("60");
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createPrice, setCreatePrice] = useState("");
  const [createDurationMin, setCreateDurationMin] = useState("60");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["providerOfferings"] });
    queryClient.invalidateQueries({ queryKey: ["testServices"] });
    queryClient.invalidateQueries({ queryKey: ["medicalTestsProvider"] });
  };

  const createOfferingMut = useMutation({
    mutationFn: (body) => portal.createProviderOffering(body),
    onSuccess: () => {
      invalidate();
      toast.success("Service added to your offerings.", {
        position: "top-center",
      });
      setNewServiceId("");
      setNewPrice("");
      setNewDurationMin("60");
    },
    onError: () =>
      toast.error("Could not add offering.", { position: "top-center" }),
  });

  const updateOfferingMut = useMutation({
    mutationFn: ({ id, body }) => portal.updateProviderOffering(id, body),
    onSuccess: () => {
      invalidate();
      toast.success("Offering updated.", { position: "top-center" });
    },
    onError: () =>
      toast.error("Update failed.", { position: "top-center" }),
  });

  const deleteOfferingMut = useMutation({
    mutationFn: (id) => portal.deleteProviderOffering(id),
    onSuccess: () => {
      invalidate();
      toast.success("Offering removed.", { position: "top-center" });
    },
    onError: () =>
      toast.error("Delete failed.", { position: "top-center" }),
  });

  const createTestServiceMut = useMutation({
    mutationFn: (body) => portal.createTestService(body),
    onError: () =>
      toast.error("Could not create test service.", {
        position: "top-center",
      }),
  });

  const handleAddFromCatalog = () => {
    if (!providerId || !newServiceId) {
      toast.warning("Choose a service from the list.", {
        position: "top-center",
      });
      return;
    }
    const price = Number(newPrice);
    if (Number.isNaN(price) || price < 0) {
      toast.warning("Enter a valid price.", { position: "top-center" });
      return;
    }
    const mins = Number(newDurationMin) || 60;
    createOfferingMut.mutate({
      providerId,
      testServiceId: Number(newServiceId),
      price,
      duration: minutesToDurationSpan(mins),
    });
  };

  const handleCreateAndAdd = async () => {
    if (!providerId || !createName.trim()) {
      toast.warning("Enter a service name.", { position: "top-center" });
      return;
    }
    const price = Number(createPrice);
    if (Number.isNaN(price) || price < 0) {
      toast.warning("Enter a valid price.", { position: "top-center" });
      return;
    }
    const mins = Number(createDurationMin) || 60;
    try {
      const created = await createTestServiceMut.mutateAsync({
        name: createName.trim(),
        description: createDesc.trim() || null,
      });
      const tid = pick(created, "id", "Id");
      if (tid == null) {
        toast.error("Server did not return new service id.", {
          position: "top-center",
        });
        return;
      }
      await portal.createProviderOffering({
        providerId,
        testServiceId: tid,
        price,
        duration: minutesToDurationSpan(mins),
      });
      invalidate();
      toast.success("New service created and linked.", {
        position: "top-center",
      });
      setCreateName("");
      setCreateDesc("");
      setCreatePrice("");
      setCreateDurationMin("60");
    } catch {
      /* toast in mutation */
    }
  };

  const handleSaveOffering = (off) => {
    const price = Number(off._editPrice ?? off.price);
    const mins = Number(off._editMins ?? durationSpanToMinutes(off.duration));
    if (Number.isNaN(price) || price < 0) {
      toast.warning("Invalid price.", { position: "top-center" });
      return;
    }
    updateOfferingMut.mutate({
      id: off.id,
      body: {
        providerId: off.providerId,
        testServiceId: off.testServiceId,
        price,
        duration: minutesToDurationSpan(mins),
      },
    });
  };

  if (loadingProvider || !providerId) {
    if (!loadingProvider && !provider) {
      return (
        <div className="min-h-[40vh] flex items-center justify-center text-gray-600 text-sm px-4 text-center">
          Could not resolve your provider account. Open profile first or check
          login.
        </div>
      );
    }
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const busy =
    loadingOfferings ||
    loadingCatalog ||
    createOfferingMut.isPending ||
    createTestServiceMut.isPending;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isLab ? "Lab tests" : "Scan services"}
        </h1>
       
      
      </div>

      {/* Add from global catalog */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800">
          Add from catalog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Test service
            </label>
            <select
              value={newServiceId}
              onChange={(e) => setNewServiceId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#316BE8]"
            >
              <option value="">Select…</option>
              {catalog.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name || `Service #${t.id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Price (EGP)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
            Duration
            </label>
            <input
              type="number"
              min={5}
              step={5}
              value={newDurationMin}
              onChange={(e) => setNewDurationMin(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={handleAddFromCatalog}
          className="px-4 py-2 rounded-xl bg-[#316BE8] text-white text-sm font-semibold hover:bg-[#2552c1] disabled:opacity-60"
        >
          Add service
        </button>
      </section>

      {/* Create new test service + offering */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800">
         Create New service
        </h2>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Name
            </label>
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder={isLab ? "e.g. CBC" : "e.g. MRI"}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Price (EGP)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={createPrice}
              onChange={(e) => setCreatePrice(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Description
            </label>
            <textarea
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[72px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
            Duration  
            </label>
            <input
              type="number"
              min={5}
              step={5}
              value={createDurationMin}
              onChange={(e) => setCreateDurationMin(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={handleCreateAndAdd}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 disabled:opacity-60"
        >
          Create &amp; link
        </button>
      </section>

      {/* List */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          Your offerings
        </h2>
        {loadingOfferings ? (
          <Loader />
        ) : offerings.length === 0 ? (
          <p className="text-sm text-gray-500">No offerings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offerings.map((off) => (
              <OfferingCard
                key={off.id}
                off={off}
                onSave={handleSaveOffering}
                onDelete={(id) => {
                  if (window.confirm("Remove this offering?")) {
                    deleteOfferingMut.mutate(id);
                  }
                }}
                saving={updateOfferingMut.isPending}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OfferingCard({ off, onSave, onDelete, saving }) {
  const ts = off.testService || {};
  const name = pick(ts, "name", "Name") || `Service #${off.testServiceId}`;
  const desc = pick(ts, "description", "Description") || "";
  const [price, setPrice] = useState(String(off.price ?? ""));
  const [mins, setMins] = useState(
    String(durationSpanToMinutes(off.duration)),
  );

  useEffect(() => {
    setPrice(String(off.price ?? ""));
    setMins(String(durationSpanToMinutes(off.duration)));
  }, [off.id, off.price, off.duration]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
        <button
          type="button"
          onClick={() => onDelete(off.id)}
          className="text-xs text-red-600 hover:underline shrink-0"
        >
          Remove
        </button>
      </div>
      {desc && (
        <p className="text-xs text-gray-600 line-clamp-3">{desc}</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-gray-500 uppercase mb-0.5">
            Price (EGP)
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase mb-0.5">
            Minutes
          </label>
          <input
            type="number"
            min={5}
            step={5}
            value={mins}
            onChange={(e) => setMins(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
          />
        </div>
      </div>
      <button
        type="button"
        disabled={saving}
        onClick={() =>
          onSave({
            ...off,
            _editPrice: price,
            _editMins: mins,
          })
        }
        className="w-full py-2 rounded-lg bg-[#316BE8] text-white text-sm font-medium hover:bg-[#2552c1] disabled:opacity-60"
      >
        Save
      </button>
    </div>
  );
}
