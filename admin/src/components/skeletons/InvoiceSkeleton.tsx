import { Skeleton } from "@/components/ui/skeleton";

const InvoiceSkeleton = () => {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/30">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 p-4 border-b items-center"
          >
            {/* Invoice Number */}
            <Skeleton className="h-4 w-28" />

            {/* Customer */}
            <Skeleton className="h-4 w-36" />

            {/* Amount */}
            <Skeleton className="h-4 w-20" />

            {/* Status */}
            <Skeleton className="h-6 w-20 rounded-full" />

            {/* Date */}
            <Skeleton className="h-4 w-24" />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-64" />

        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSkeleton;