import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const CategorySkeleton = ({ isAdmin }: { isAdmin?: boolean }) => {
  return (
    <div className="p-5 space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex items-end gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28" /> {/* Refresh */}
          <Skeleton className="h-9 w-40" /> {/* Sort dropdown */}
          {isAdmin && <Skeleton className="h-9 w-36" />} {/* Add button */}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-28" />
              </TableHead>
              {isAdmin && (
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {[...Array(10)].map((_, index) => (
              <TableRow key={index}>
                {/* Image */}
                <TableCell>
                  <Skeleton className="h-12 w-12 rounded" />
                </TableCell>

                {/* Name */}
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>

                {/* Type */}
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                {/* Created At */}
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>

                {/* Actions */}
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};

export default CategorySkeleton;
