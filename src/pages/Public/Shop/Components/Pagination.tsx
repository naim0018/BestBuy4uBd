import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPage, onPageChange }: PaginationProps) => {
  if (totalPage <= 1) return null;

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  // Helper to determine which pages to show (ellipsis logic could be added here for many pages)
  const renderPageNumbers = () => {
    return pages.map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
          currentPage === page
            ? "bg-primary-green text-white shadow-lg shadow-primary-green/30 scale-110"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          currentPage === 1
            ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPage, currentPage + 1))}
        disabled={currentPage === totalPage}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          currentPage === totalPage
            ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
