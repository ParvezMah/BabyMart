import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { StatsData } from "@/lib/type";
import { motion } from "framer-motion";
import {
  Bookmark,
  DollarSign,
  Package,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const COLORS = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(221, 83%, 53%)", // Indigo
  "hsl(262, 83%, 58%)", // Purple
  "hsl(350, 87%, 55%)", // Red
  "hsl(120, 60%, 50%)", // Green
];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Dashboard = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const recentOrdersCount = stats?.recentOrders?.length ?? 0;
  const topProductsCount = stats?.topProducts?.length ?? 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosPrivate.get("/stats");
        setStats(response.data);
      } catch (error) {
        toast("Failed to load dashboard statistics");
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosPrivate, toast]);

  console.log("Dashboard stats: ", stats);

  return (
    <div className="">
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="p-5 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">
            Dashboard OverView
          </h1>
          {stats && (
            <>
              <motion.div
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
                variants={containerVariants}
              >
                <motion.div variants={cardVariants}>
                  <StatsCard
                    title="Total Users"
                    value={stats.counts.users}
                    icon={<Users className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/users"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <StatsCard
                    title="Total Products"
                    value={stats.counts.products}
                    icon={<ShoppingBag className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/products"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <StatsCard
                    title="Categories"
                    value={stats.counts.categories}
                    icon={<Tag className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/categories"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <StatsCard
                    title="Brands"
                    value={stats.counts.brands}
                    icon={<Bookmark className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/brands"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <StatsCard
                    title="Total Orders"
                    value={stats.counts.orders}
                    icon={<Package className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/orders"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.counts.totalRevenue)}
                    icon={<DollarSign className="h-6 w-6 text-indigo-600" />}
                    href="/dashboard/account"
                    className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="grid gap-6 grid-cols-1 lg:grid-cols-2"
                variants={containerVariants}
              >
                <motion.div variants={cardVariants}>
                  <Card className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Categories Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.categories}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="name" tick={{ fill: "#4b5563" }} />
                          <YAxis tick={{ fill: "#4b5563" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="value"
                            name="Products"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          >
                            {stats.categories.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Card className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        User Roles Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.roles}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={100}
                            animationDuration={1000}
                            dataKey="value"
                          >
                            {stats.roles.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants} className="lg:col-span-2">
                  <Card className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Brand Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.brands}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis dataKey="name" tick={{ fill: "#4b5563" }} />
                          <YAxis tick={{ fill: "#4b5563" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="value"
                            name="Products"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1000}
                          >
                            {stats.brands.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
                {/* Recent Orders */}
                <motion.div variants={cardVariants}>
                  <Card className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Recent Orders
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      {stats.recentOrders && recentOrdersCount > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead>
                              <tr className="border-b text-gray-600">
                                <th className="py-2">Order ID</th>
                                <th className="py-2">Customer</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Total</th>
                                <th className="py-2">Date</th>
                              </tr>
                            </thead>

                            <tbody>
                              {stats.recentOrders.map((order) => (
                                <tr key={order._id} className="border-b">
                                  <td className="py-2 font-medium text-gray-700">
                                    #{order._id.slice(-6)}
                                  </td>

                                  <td className="py-2 text-gray-600">
                                    {order.user?.name || "Unknown"}
                                  </td>

                                  <td className="py-2">
                                    <span
                                      className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        order.status === "delivered"
                                          ? "bg-green-100 text-green-700"
                                          : order.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : order.status === "cancelled"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-gray-100 text-gray-700",
                                      )}
                                    >
                                      {order.status}
                                    </span>
                                  </td>

                                  <td className="py-2 font-semibold text-gray-800">
                                    ${order.totalPrice}
                                  </td>

                                  <td className="py-2 text-gray-500">
                                    {new Date(
                                      order.createdAt,
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No recent orders found
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Card className="bg-white/95 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Top Products
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      {stats.topProducts && stats?.topProducts?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead>
                              <tr className="border-b text-gray-600">
                                <th className="py-2">Product</th>
                                <th className="py-2">Sold</th>
                                <th className="py-2">Revenue</th>
                              </tr>
                            </thead>

                            <tbody>
                              {stats.topProducts.slice(0, 5).map((p: any) => (
                                <tr key={p._id} className="border-b">
                                  <td className="py-2 font-medium text-gray-700">
                                    {p.name}
                                  </td>

                                  <td className="py-2 text-gray-600">
                                    {p.sold}
                                  </td>

                                  <td className="py-2 font-semibold text-indigo-600">
                                    ${p.revenue}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No product data found
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
