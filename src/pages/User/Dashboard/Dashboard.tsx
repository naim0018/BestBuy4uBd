import { useGetUserDashboardStatsQuery } from "@/store/Api/UserDashboardApi";
import { ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
    // Since this is a protected route, we fetch stats for the logged-in user.
    // We pass an empty string as phone, so the backend uses the authenticated user's info.
    const { data: statsResponse, isLoading } = useGetUserDashboardStatsQuery("");

    const stats = statsResponse?.data;

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading your dashboard...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">No dashboard data available.</div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Orders</p>
                                    <p className="text-2xl font-bold">{stats.overview.totalOrders}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <ShoppingBag className="text-blue-500" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Pending</p>
                                    <p className="text-2xl font-bold">{stats.overview.pendingOrders}</p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                    <Clock className="text-yellow-500" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Delivered</p>
                                    <p className="text-2xl font-bold">{stats.overview.deliveredOrders}</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <CheckCircle className="text-green-500" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Spent</p>
                                    <p className="text-2xl font-bold">৳{stats.overview.totalSpent}</p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <span className="text-purple-500 text-xl font-bold">৳</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold">Your Orders</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.orders.map((order: any) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                                      'bg-blue-100 text-blue-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{order.totalAmount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.itemsCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};


export default Dashboard;
