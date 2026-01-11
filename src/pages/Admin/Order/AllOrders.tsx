import { useGetAllOrdersQuery, useDeleteOrderMutation } from "@/store/Api/OrderApi";
import { useGetDashboardStatsQuery } from "@/store/Api/DashboardApi";
import DynamicTable from "@/common/DynamicTable/DynamicTable";
import { toast } from "sonner";
import { Eye, Trash2, CheckCircle, XCircle, Clock, Truck, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@heroui/react";

const AllOrders = () => {
  const { data: apiData, isLoading } = useGetAllOrdersQuery(undefined, {
    pollingInterval: 30000,
  });
  const { data: statsData } = useGetDashboardStatsQuery(undefined);
  const [deleteOrder] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const orders = apiData?.data || [];
  const stats = statsData?.data?.overview;

  const statCards = [
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: <Package className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pending", value: stats?.pendingCount || 0, icon: <Clock className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Processing", value: stats?.processingCount || 0, icon: <Truck className="w-5 h-5" />, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Delivered", value: stats?.deliveredCount || 0, icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-50" },
    { title: "Cancelled", value: stats?.canceledCount || 0, icon: <XCircle className="w-5 h-5" />, color: "text-red-600", bg: "bg-red-50" },
  ];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id).unwrap();
        toast.success("Order deleted successfully");
      } catch (err) {
        toast.error("Failed to delete order");
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "completed":
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" /> {status}
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3" /> {status}
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" /> {status}
          </span>
        );
      case "cancelled":
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const columns = [
    {
      key: "_id",
      label: "Order ID",
      render: (row: any) => (
        <span className="font-mono text-xs text-gray-500">
          #{row._id?.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (row: any) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.billingInformation?.name || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">
            {row.billingInformation?.email}
          </p>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      accessor: "billingInformation.phone",
      render: (row: any) => row.billingInformation?.phone || "N/A",
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (row: any) =>
        new Date(row.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row: any) => (
        <span className="font-bold text-gray-900">
          ৳{row.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => getStatusBadge(row.status),
    },
  ];

  const actions = [
    {
      label: "View/Edit",
      onClick: (row: any) => navigate(`/admin/orders/${row._id}`),
      icon: <Eye className="w-4 h-4" />,
      variant: "primary" as const,
    },
    {
      label: "Delete",
      onClick: (row: any) => handleDelete(row._id),
      icon: <Trash2 className="w-4 h-4" />,
      variant: "danger" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all customer orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
           <Card key={idx} className="p-4 border-none shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                  <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                  </div>
                  <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                      {card.icon}
                  </div>
              </div>
           </Card>
        ))}
      </div>

      <Card className="p-6 border border-gray-200 shadow-sm overflow-hidden">
        <DynamicTable
          data={orders}
          columns={columns}
          loading={isLoading}
          pagination={true}
          pageSize={10}
          searchable={true}
          searchPlaceholder="Search by name, email, or order ID..."
          actions={actions}
          emptyMessage="No orders found"
          hoverable={true}
        />
      </Card>
    </div>
  );
};

export default AllOrders;
