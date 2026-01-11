import { useGetDashboardStatsQuery } from "@/store/Api/DashboardApi";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Clock,
  XCircle,
  Calendar,
  ArrowRight,
  Package,
} from "lucide-react";
import {
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  completed: "#10b981",
  delivered: "#10b981",
  processing: "#f59e0b",
  pending: "#3b82f6",
  cancelled: "#ef4444",
  canceled: "#ef4444",
  shipped: "#8b5cf6",
};

import DashboardSkeleton from "@/common/Skeleton/DashboardSkeleton";

const Dashboard = () => {
  const { data, isLoading, isError, error } = useGetDashboardStatsQuery(
    undefined,
    {
      pollingInterval: 30000,
    }
  );
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data || !data.data) {
    console.error("Dashboard Error:", error);
    return (
      <div className="text-center p-10 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 font-bold">
          Failed to load dashboard statistics.
        </p>
        <p className="text-xs text-red-400 mt-2">
          Please check if the server is running and the database has orders.
        </p>
      </div>
    );
  }

  const {
    overview,
    statusBreakdown = [],
    monthlyStats = [],
    recentOrders = [],
  } = data.data;

  const statsCards = [
    {
      title: "Pending Orders",
      value: overview?.pendingCount || 0,
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      bgColor: "bg-orange-50",
    },
    {
      title: "Sales This Month (Qty)",
      value: overview?.currentMonthOrders || 0,
      icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Sales This Month (Amt)",
      value: `৳${(overview?.currentMonthSales || 0).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: `৳${(overview?.revenueAmount || 0).toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      bgColor: "bg-indigo-50",
    },
    {
      title: "Canceled Orders",
      value: overview?.canceledCount || 0,
      icon: <XCircle className="w-6 h-6 text-rose-600" />,
      bgColor: "bg-rose-50",
    },
    {
      title: "Total Sales (All Time)",
      value: `৳${(overview?.totalSalesAmount || 0).toLocaleString()}`,
      icon: <Package className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-50",
      trend: overview?.salesGrowth,
    },
  ];

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status.toLowerCase()] || "#9ca3af";
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header / Last Order Status */}
      {overview?.lastOrder && (
        <Card className="border-none shadow-sm bg-gradient-to-r from-yellow-500 to-amber-100 text-white">
          <CardBody className="p-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-90 text-white">
                  Last Order Status
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-bold capitalize text-white">
                    {overview.lastOrder.status}
                  </h2>
                  <Chip
                    variant="flat"
                    className="bg-white/20 text-white border-none text-xs font-bold uppercase"
                    size="sm"
                  >
                    ID: {overview.lastOrder._id.slice(-6)}
                  </Chip>
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs opacity-80 uppercase tracking-widest font-bold">
                Latest Order Amount
              </p>
              <p className="text-2xl font-black mt-1">
                ৳{overview.lastOrder.totalAmount.toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statsCards.map((card, i) => (
          <Card
            key={i}
            className="border-none shadow-sm hover:shadow-md transition-shadow"
          >
            <CardBody className="p-5 flex flex-col gap-3">
              <div
                className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {card.value}
                </h3>
                {card.trend !== undefined && (
                  <div
                    className={`flex items-center gap-1 mt-2 text-xs font-bold ${
                      card.trend >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {card.trend >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(card.trend)}% vs last month
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Sales Bar Chart */}
        <Card className="border-none shadow-sm p-6 ring-1 ring-gray-100">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900">Monthly Sales</h3>
            <p className="text-sm text-gray-500">Gross order volume by month</p>
          </div>
          <div className="h-[300px] w-full">
            {monthlyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickFormatter={(value) => `৳${value.toLocaleString()}`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => [
                      `৳${value.toLocaleString()}`,
                      "Total Sales",
                    ]}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                No sales data available for charts
              </div>
            )}
          </div>
        </Card>

        {/* Monthly Revenue Area Chart */}
        <Card className="border-none shadow-sm p-6 ring-1 ring-gray-100">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900">
              Revenue Analysis
            </h3>
            <p className="text-sm text-gray-500">
              Net revenue from completed orders
            </p>
          </div>
          <div className="h-[300px] w-full">
            {monthlyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyStats}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickFormatter={(value) => `৳${value.toLocaleString()}`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => [
                      `৳${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                No revenue data available for charts
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-none shadow-sm p-6 ring-1 ring-gray-100 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button className="text-sm font-bold text-green-600 flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {recentOrders.length > 0 ? (
            <Table aria-label="Recent orders table" removeWrapper>
              <TableHeader>
                <TableColumn className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  Customer
                </TableColumn>
                <TableColumn className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  Date
                </TableColumn>
                <TableColumn className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  Amount
                </TableColumn>
                <TableColumn className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider text-center">
                  Status
                </TableColumn>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow
                    key={order._id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <p className="font-bold text-gray-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        Order #{order._id?.slice(-6)}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-sm">
                          {order.date
                            ? new Date(order.date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-black text-gray-900">
                      ৳{order.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <Chip
                          size="sm"
                          variant="flat"
                          className="font-bold uppercase text-[10px] px-3 border-none"
                          style={{
                            backgroundColor: `${getStatusColor(
                              order.status || ""
                            )}20`,
                            color: getStatusColor(order.status || ""),
                          }}
                        >
                          {order.status || "Unknown"}
                        </Chip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center text-gray-400 italic">
              No recent orders found
            </div>
          )}
        </Card>

        {/* Status Breakdown (Pie) */}
        <Card className="border-none shadow-sm p-6 ring-1 ring-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Order Distribution
          </h3>
          <p className="text-sm text-gray-500 mb-8">Performance by status</p>
          <div className="h-[250px] w-full">
            {statusBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                  >
                    {statusBreakdown.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStatusColor(entry.status || "")}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                No distribution data
              </div>
            )}
          </div>
          <div className="space-y-4 mt-6">
            {statusBreakdown.map((entry: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{
                      backgroundColor: getStatusColor(entry.status || ""),
                    }}
                  />
                  <span className="text-sm font-bold text-gray-700 capitalize">
                    {entry.status || "Unknown"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">
                    {entry.count}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Orders
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
