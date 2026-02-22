import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import {
  // LineChart,
  // Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  // Legend,
} from "recharts";
import { mockTransactions, categoryConfig } from "../../utils/mockData";
import { useState } from "react";
import { AddTransactionModal } from "./AddTransactionModel";
import "./Dashboard.css";

export function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate summary stats
  const currentMonth = new Date().getMonth();
  const currentMonthTransactions = mockTransactions.filter(
    (t) => t.date.getMonth() === currentMonth,
  );

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const lineChartData = last7Days.map((date) => {
    const dayTransactions = mockTransactions.filter(
      (t) => t.date.toDateString() === date.toDateString(),
    );

    const income = dayTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = dayTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      income,
      expense,
    };
  });

  // Category breakdown for pie chart
  const categoryBreakdown = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const existing = acc.find((item) => item.category === t.category);
        if (existing) {
          existing.value += t.amount;
        } else {
          acc.push({
            category: t.category,
            name: categoryConfig[t.category].name,
            value: t.amount,
            color: categoryConfig[t.category].color,
          });
        }
        return acc;
      },
      [] as Array<{
        category: string;
        name: string;
        value: number;
        color: string;
      }>,
    )
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Recent transactions
  const recentTransactions = [...mockTransactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's your financial overview
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Transaction</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              +12.5%
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Income</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
              +8.2%
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
          <p className="text-2xl font-semibold text-gray-900">
            $
            {totalExpenses.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                balance >= 0
                  ? "text-green-600 bg-green-50"
                  : "text-red-600 bg-red-50"
              }`}
            >
              {balance >= 0 ? "+" : ""}
              {savingsRate}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Balance</p>
          <p
            className={`text-2xl font-semibold ${
              balance >= 0 ? "text-gray-900" : "text-red-600"
            }`}
          >
            $
            {Math.abs(balance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-violet-600" />
            </div>
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded">
              This Month
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Savings Rate</p>
          <p className="text-2xl font-semibold text-gray-900">{savingsRate}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Income vs Expenses
            </h2>
            <select
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600"
              aria-label="Select time period"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={lineChartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                // style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#9ca3af"
                //  style={{ fontSize: "12px" }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorIncome)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorExpense)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Expense Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) =>
                  value ? `$${value.toFixed(2)}` : "$0.00"
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryBreakdown.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="categoryDot"
                    // style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">
                  ${item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h2>
          <a
            href="/transactions"
            className="text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            View All
          </a>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTransactions.map((transaction) => {
            const config = categoryConfig[transaction.category];
            return (
              <div
                key={transaction.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="transactionIconContainer"
                    // style={{ backgroundColor: `${config.color}15` }}
                  >
                    <div
                      className="transactionIconDot"
                      // style={{ backgroundColor: config.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {config.name} •{" "}
                      {transaction.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </p>
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600 ml-auto" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600 ml-auto" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
