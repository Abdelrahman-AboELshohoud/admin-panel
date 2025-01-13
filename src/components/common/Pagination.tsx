import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();

  const getPageNumbers = () => {
    let startPage = currentPage > 6 ? currentPage - 6 : 1;
    let endPage = currentPage > 6 ? currentPage + 4 : 10;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - 9 > 0 ? endPage - 9 : 1;
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-4">
      <div className="text-lg font-semibold mb-2 text-gray-100">
        {t("common.pagination.pages")}
      </div>
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={` text-lg font-semibold  ${
              page === currentPage ? "font-bold text-white" : "text-blue-400"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-4 mt-2">
        <button
          className="flex items-center text-blue-400 disabled:text-gray-500 font-medium text-lg"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="ml-1">{t("common.pagination.previous")}</span>
        </button>
        <button
          className="flex items-center text-blue-400 disabled:text-gray-500 font-medium text-lg"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="mr-1">{t("common.pagination.next")}</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
