import { useState } from "react";
import { MdVisibility, MdDelete, MdBlock, MdCheckCircle } from "react-icons/md";

export default function AdminTable({
  columns,
  data,
  isLoading = false,
  onView,
  onApprove,
  onDelete,
  onBlock,
  showMore,
  onShowMore,
  hasMore = false,
}) {
  const [expandedRow, setExpandedRow] = useState(null);

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-8">
        <p className="text-center text-sm sm:text-base text-gray-500">Loading...</p>
      </div>
    );
  }

  // Always show table structure, even if no data
  const tableData = data || [];
  const isEmpty = tableData.length === 0;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-gray-50/80">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isEmpty ? (
              // Empty state row
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 sm:px-4 lg:px-6 py-8 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              // Data rows
              tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View"
                        >
                          <MdVisibility className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      {onApprove && (
                        <button
                          onClick={() => onApprove(row)}
                          className={`p-1 ${
                            row.isApproved
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                          title={row.isApproved ? "Disapprove" : "Approve"}
                        >
                          <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      {onBlock && (
                        <button
                          onClick={() => onBlock(row)}
                          className={`p-1 ${
                            row.isDeleted || row.statusType === "Blocked" || row.isBlocked
                              ? "text-green-600 hover:text-green-800"
                              : "text-orange-600 hover:text-orange-800"
                          }`}
                          title={row.isDeleted || row.statusType === "Blocked" || row.isBlocked ? "Unblock" : "Block"}
                        >
                          <MdBlock className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          <MdDelete className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showMore && hasMore && !isEmpty && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
          <button
            onClick={onShowMore}
            className="w-full py-2 text-center text-sm sm:text-base text-[#316BE8] hover:text-[#274fb3] font-medium"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

