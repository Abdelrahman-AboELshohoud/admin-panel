import { Button } from "../ui/button";

export default function Pagination({
  filters,
  setFilters,
  totalCount,
  loading,
  t,
}: {
  filters: any;
  setFilters: any;
  totalCount: number;
  loading: boolean;
  t: any;
}) {
  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        variant="outline"
        onClick={() =>
          setFilters((prev: any) => ({
            ...prev,
            page: prev.page - 1,
          }))
        }
        disabled={filters.page === 1 || loading}
      >
        {t("common.previous")}
      </Button>
      <span>
        {t("common.page")} {filters.page || 1} /{" "}
        {Math.ceil(totalCount / filters.limit || 1)}
      </span>
      <Button
        variant="outline"
        onClick={() =>
          setFilters((prev: any) => ({
            ...prev,
            page: prev.page + 1,
          }))
        }
        disabled={
          filters.page >= Math.ceil(totalCount / filters.limit) || loading
        }
      >
        {t("common.next")}
      </Button>
    </div>
  );
}
