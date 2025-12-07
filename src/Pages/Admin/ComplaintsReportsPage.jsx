import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminTable from "../../Components/Admin/AdminTable";
import { MdSearch } from "react-icons/md";
import { toast } from "react-toastify";
import { useAdminAPI } from "../../api/adminAPI";

export default function ComplaintsReportsPage() {
  const adminAPI = useAdminAPI();
  const [searchQuery, setSearchQuery] = useState("");
  const [mainTab, setMainTab] = useState("complaints"); // "complaints" or "reports"
  const [reportsTab, setReportsTab] = useState("questions"); // "questions" or "articles" (only when mainTab is "reports")
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch all questions info
  const { data: questionsData, isLoading: questionsLoading, refetch: refetchQuestions } = useQuery({
    queryKey: ["admin-questions-info"],
    queryFn: async () => {
      const res = await adminAPI.getAllQuestionsInfo();
      return res.data; // Array of question objects
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Fetch all articles info
  const { data: articlesData, isLoading: articlesLoading, refetch: refetchArticles } = useQuery({
    queryKey: ["admin-articles-info"],
    queryFn: async () => {
      const res = await adminAPI.getAllArticlesInfo();
      return res.data; // Array of article objects
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // TODO: Fetch complaints data when API is available
  const { data: complaintsData, isLoading: complaintsLoading } = useQuery({
    queryKey: ["admin-complaints"],
    queryFn: async () => {
      // TODO: Replace with actual complaints API
      // const res = await adminAPI.getAllComplaints();
      // return res.data;
      return []; // Placeholder
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Client-side pagination for complaints
  const allComplaints = complaintsData || [];
  const complaintsStartIndex = (page - 1) * pageSize;
  const complaintsEndIndex = complaintsStartIndex + pageSize;
  const paginatedComplaints = allComplaints.slice(complaintsStartIndex, complaintsEndIndex);
  const complaintsTotalPages = Math.ceil(allComplaints.length / pageSize);

  // Client-side pagination for questions
  const allQuestions = questionsData || [];
  const questionsStartIndex = (page - 1) * pageSize;
  const questionsEndIndex = questionsStartIndex + pageSize;
  const paginatedQuestions = allQuestions.slice(questionsStartIndex, questionsEndIndex);
  const questionsTotalPages = Math.ceil(allQuestions.length / pageSize);

  // Client-side pagination for articles
  const allArticles = articlesData || [];
  const articlesStartIndex = (page - 1) * pageSize;
  const articlesEndIndex = articlesStartIndex + pageSize;
  const paginatedArticles = allArticles.slice(articlesStartIndex, articlesEndIndex);
  const articlesTotalPages = Math.ceil(allArticles.length / pageSize);

  // Filter complaints
  const filteredComplaints = paginatedComplaints.filter((complaint) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      complaint.title?.toLowerCase().includes(query) ||
      complaint.message?.toLowerCase().includes(query) ||
      complaint.patientName?.toLowerCase().includes(query)
    );
  });

  // Filter questions
  const filteredQuestions = paginatedQuestions.filter((question) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const questionText = question.question || question.content || "";
    const patientName = question.patientName || question.patient?.name || "";
    return (
      questionText.toLowerCase().includes(query) ||
      patientName.toLowerCase().includes(query)
    );
  });

  // Filter articles
  const filteredArticles = paginatedArticles.filter((article) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const title = article.title || "";
    const doctorName = article.doctorName || article.doctor?.name || "";
    return (
      title.toLowerCase().includes(query) ||
      doctorName.toLowerCase().includes(query)
    );
  });

  // Complaints columns
  const complaintsColumns = [
    {
      label: "Title",
      key: "title",
      render: (complaint) => (
        <span className="text-sm font-medium text-gray-900">
          {complaint.title || "N/A"}
        </span>
      ),
    },
    {
      label: "Message",
      key: "message",
      render: (complaint) => (
        <span className="text-sm text-gray-600 line-clamp-2 max-w-md">
          {complaint.message || "N/A"}
        </span>
      ),
    },
    {
      label: "Patient",
      key: "patient",
      render: (complaint) => (
        <span className="text-sm text-gray-600">
          {complaint.patientName || complaint.patient?.name || "N/A"}
        </span>
      ),
    },
    {
      label: "Date",
      key: "date",
      render: (complaint) => (
        <span className="text-sm text-gray-600">
          {complaint.createdDate || complaint.date
            ? new Date(complaint.createdDate || complaint.date).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (complaint) => {
        const status = complaint.status || "Pending";
        const statusColors = {
          Pending: "bg-yellow-100 text-yellow-800",
          Resolved: "bg-green-100 text-green-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status] || statusColors.Pending
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  // Questions columns
  const questionsColumns = [
    {
      label: "Question",
      key: "question",
      render: (question) => (
        <span className="text-sm font-medium text-gray-900 line-clamp-2 max-w-md">
          {question.question || question.content || "N/A"}
        </span>
      ),
    },
    {
      label: "Patient",
      key: "patient",
      render: (question) => (
        <span className="text-sm text-gray-600">
          {question.patientName || question.patient?.name || "N/A"}
        </span>
      ),
    },
    {
      label: "Date",
      key: "date",
      render: (question) => (
        <span className="text-sm text-gray-600">
          {question.createdDate || question.date
            ? new Date(question.createdDate || question.date).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      label: "Can Delete",
      key: "canDelete",
      render: (question) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          question.canDelete !== false
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {question.canDelete !== false ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  // Articles columns
  const articlesColumns = [
    {
      label: "Title",
      key: "title",
      render: (article) => (
        <span className="text-sm font-medium text-gray-900">
          {article.title || "N/A"}
        </span>
      ),
    },
    {
      label: "Doctor",
      key: "doctor",
      render: (article) => (
        <span className="text-sm text-gray-600">
          {article.doctorName || article.doctor?.name || "N/A"}
        </span>
      ),
    },
    {
      label: "Date",
      key: "date",
      render: (article) => (
        <span className="text-sm text-gray-600">
          {article.createdDate || article.date
            ? new Date(article.createdDate || article.date).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      label: "Can Delete",
      key: "canDelete",
      render: (article) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          article.canDelete !== false
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {article.canDelete !== false ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  const handleView = (item) => {
    // TODO: Implement view details modal
  };

  const handleResolve = async (complaint) => {
    // TODO: Implement resolve complaint API
    toast.info("Resolve functionality coming soon");
  };

  const handleDelete = async (item) => {
    let itemType = "";
    if (mainTab === "complaints") {
      itemType = "complaint";
    } else if (mainTab === "reports") {
      itemType = reportsTab === "questions" ? "question" : "article";
    }

    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        if (mainTab === "complaints") {
          // TODO: Implement delete complaint API
          toast.info("Delete complaint functionality coming soon");
        } else if (mainTab === "reports") {
          if (reportsTab === "questions") {
            await adminAPI.deleteQuestion(item.id);
            toast.success("Question deleted successfully!");
            refetchQuestions();
          } else {
            await adminAPI.deletePost(item.id);
            toast.success("Article deleted successfully!");
            refetchArticles();
          }
        }
      } catch (error) {
        toast.error(`Failed to delete ${itemType}`);
      }
    }
  };

  const getHasMore = () => {
    if (mainTab === "complaints") {
      return page < complaintsTotalPages;
    } else if (mainTab === "reports") {
      return reportsTab === "questions"
        ? page < questionsTotalPages
        : page < articlesTotalPages;
    }
    return false;
  };

  const getCurrentData = () => {
    if (mainTab === "complaints") {
      return filteredComplaints;
    } else if (mainTab === "reports") {
      return reportsTab === "questions" ? filteredQuestions : filteredArticles;
    }
    return [];
  };

  const getCurrentColumns = () => {
    if (mainTab === "complaints") {
      return complaintsColumns;
    } else if (mainTab === "reports") {
      return reportsTab === "questions" ? questionsColumns : articlesColumns;
    }
    return [];
  };

  const getCurrentLoading = () => {
    if (mainTab === "complaints") {
      return complaintsLoading;
    } else if (mainTab === "reports") {
      return reportsTab === "questions" ? questionsLoading : articlesLoading;
    }
    return false;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Complaints / Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage complaints and reports from patients
          </p>
        </div>
        <div className="w-full sm:flex-1 sm:max-w-md sm:ml-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316BE8] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Main Tabs: Complaints / Reports */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => {
            setMainTab("complaints");
            setPage(1);
            setSearchQuery("");
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mainTab === "complaints"
              ? "text-[#316BE8] border-b-2 border-[#316BE8]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Complaints ({allComplaints.length})
        </button>
        <button
          onClick={() => {
            setMainTab("reports");
            setPage(1);
            setSearchQuery("");
          }}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mainTab === "reports"
              ? "text-[#316BE8] border-b-2 border-[#316BE8]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Reports
        </button>
      </div>

      {/* Reports Sub-tabs: Questions / Articles (only when mainTab is "reports") */}
      {mainTab === "reports" && (
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => {
              setReportsTab("questions");
              setPage(1);
              setSearchQuery("");
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              reportsTab === "questions"
                ? "text-[#316BE8] border-b-2 border-[#316BE8]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Questions ({allQuestions.length})
          </button>
          <button
            onClick={() => {
              setReportsTab("articles");
              setPage(1);
              setSearchQuery("");
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              reportsTab === "articles"
                ? "text-[#316BE8] border-b-2 border-[#316BE8]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Articles ({allArticles.length})
          </button>
        </div>
      )}

      {/* Table */}
      <AdminTable
        columns={getCurrentColumns()}
        data={getCurrentData()}
        isLoading={getCurrentLoading()}
        onView={handleView}
        onApprove={mainTab === "complaints" ? handleResolve : undefined}
        onDelete={handleDelete}
        showMore={true}
        hasMore={getHasMore()}
        onShowMore={() => setPage((p) => p + 1)}
      />
    </div>
  );
}
