import {
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  //   LineChart,
  //   Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  //   PieChart,
  //   Pie,
  Cell,
  Legend,
} from "recharts";
import { mockTransactions, categoryConfig } from "../../utils/mockData";
import { useMemo } from "react";

export function Analytics() {
  // Monthly comparison data
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => {
      const monthTransactions = mockTransactions.filter(
        (t) => t.date.getMonth() === index,
      );

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month,
        income,
        expense,
        savings: income - expense,
      };
    });
  }, []);

  // Category analysis
  const categoryAnalysis = useMemo(() => {
    const analysis = Object.entries(categoryConfig)
      .map(([key, config]) => {
        const transactions = mockTransactions.filter(
          (t) => t.category === key && t.type === "expense",
        );
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        return {
          category: key,
          name: config.name,
          color: config.color,
          total,
          count: transactions.length,
          average: transactions.length > 0 ? total / transactions.length : 0,
        };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);

    return analysis;
  }, []);

  // Top spending categories
  const topCategories = categoryAnalysis.slice(0, 5);

  // Calculate insights
  const currentMonth = mockTransactions.filter(
    (t) => t.date.getMonth() === new Date().getMonth(),
  );

  const totalIncome = currentMonth
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonth
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const avgTransaction =
    totalExpense / currentMonth.filter((t) => t.type === "expense").length;
  const largestExpense = Math.max(
    ...currentMonth.filter((t) => t.type === "expense").map((t) => t.amount),
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Deep insights into your spending patterns
        </p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Avg. Transaction
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            ${avgTransaction.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per expense transaction</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Largest Expense
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            ${largestExpense.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Transactions
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {mockTransactions.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Spending Rate
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {((totalExpense / totalIncome) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Of income</p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Monthly Trends
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="savings" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Top Spending Categories
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                width={100}
              />
              <Tooltip
                formatter={(value: number | undefined) =>
                  value !== undefined ? `$${value.toFixed(2)}` : "$0.00"
                }
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                {topCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Details */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Category Details
          </h2>
          <div className="space-y-4">
            {topCategories.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${category.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{category.count} transactions</span>
                  <span>Avg: ${category.average.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(category.total / topCategories[0].total) * 100}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spending Patterns */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Spending Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Active Day</p>
                <p className="font-semibold text-gray-900">Monday</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You tend to make more transactions at the start of the week
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Peak Spending</p>
                <p className="font-semibold text-gray-900">Weekends</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Entertainment and dining expenses increase on weekends
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Savings Trend</p>
                <p className="font-semibold text-gray-900">Improving</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Your savings rate has increased by 8% compared to last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
