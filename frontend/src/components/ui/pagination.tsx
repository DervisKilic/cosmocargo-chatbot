import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface PaginationProps {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ totalCount, page, pageSize, totalPages, onPageChange}: PaginationProps) => {
  const itemsOnPage = Math.min(pageSize, totalCount - page * pageSize);
  console.log(totalCount, page, pageSize, totalPages, itemsOnPage);
  return <div className="flex items-center justify-between mt-6">
  <div className="text-sm text-space-text-secondary">
    Visar {itemsOnPage} av {totalCount} leveranser
  </div>
  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(Math.max(1, page - 1))}
      disabled={page === 1}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <span className="text-sm">
      Sida {page} av {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      disabled={page === totalPages}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
</div>
}

Pagination.displayName = "Pagination";

export default Pagination;
