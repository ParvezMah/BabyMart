/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Download,
  Eye,
  Receipt,
  RefreshCw,
  Search
} from "lucide-react";

import InvoiceSkeleton from "@/components/skeletons/InvoiceSkeleton";
import type { Invoice } from "@/lib/type";

const InvoicePage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get("/invoices");
      setInvoices(res.data?.invoices || []);
      setTotal(res?.data?.users.length);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await axiosPrivate.get("/invoices");
      setInvoices(res.data?.invoices || []);
      setTotal(res?.data?.users.length);
      toast.success("Invoices refreshed");
    } catch (err) {
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "all" || inv.status === status;

    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewOpen(true);
  };

  const handleDownload = (invoice: Invoice) => {
    toast.success(`Downloading ${invoice.invoiceNumber}`);
  };

  if (loading) return <InvoiceSkeleton isAdmin={isAdmin} />;

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-0.5">
            View and manage all of invoices in one place. Search, filter, and export as needed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{total}</span>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((inv) => (
                <TableRow key={inv._id}>
                  <TableCell className="font-medium">
                    {inv.invoiceNumber}
                  </TableCell>

                  <TableCell>{inv.customerName}</TableCell>

                  <TableCell className="font-semibold">
                    ${inv.totalAmount.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(inv.status)}>
                      {inv.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleView(inv)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDownload(inv)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              Full invoice information
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="font-semibold">
                    {selectedInvoice.invoiceNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Customer
                  </p>
                  <p className="font-semibold">
                    {selectedInvoice.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Total
                  </p>
                  <p className="font-semibold">
                    ${selectedInvoice.totalAmount}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    className={getStatusColor(selectedInvoice.status)}
                  >
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicePage;