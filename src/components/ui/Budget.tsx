import { useState } from "react";
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Edit,
  Trash2,
} from "lucide-react";
import { mockBudgets, categoryConfig } from "../../utils/mockData";
import type { Budget as BudgetType } from "../../utils/types";

export function Budget() {
  const [budgets] = useState<BudgetType[]>(mockBudgets);

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const getBudgetStatus = (budget: BudgetType) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return { status: "exceeded", color: "red" };
    if (percentage >= 80) return { status: "warning", color: "orange" };
    return { status: "good", color: "green" };
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Budget Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your spending limits
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Budget</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Budget</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Spent</p>
          <p className="text-2xl font-semibold text-red-600">
            ${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Remaining</p>
          <p className="text-2xl font-semibold text-green-600">
            $
            {totalRemaining.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {((totalRemaining / totalBudget) * 100).toFixed(1)}% available
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Overall Budget Progress
          </h2>
          <span className="text-sm font-medium text-gray-600">
            {((totalSpent / totalBudget) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-violet-600 to-indigo-600"
            style={{
              width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>${totalSpent.toFixed(2)} spent</span>
          <span>${totalBudget.toFixed(2)} total</span>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Budget by Category
        </h2>

        {budgets.map((budget) => {
          const config = categoryConfig[budget.category];
          const { status } = getBudgetStatus(budget);
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const remaining = budget.limit - budget.spent;

          return (
            <div
              key={budget.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {config.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {budget.period}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {status === "exceeded" && (
                    <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Over Budget</span>
                    </div>
                  )}
                  {status === "warning" && (
                    <div className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Warning</span>
                    </div>
                  )}
                  {status === "good" && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>On Track</span>
                    </div>
                  )}
                  <button
                    title="Edit budget"
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete budget"
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    ${budget.spent.toFixed(2)} spent of $
                    {budget.limit.toFixed(2)}
                  </span>
                  <span
                    className={`font-semibold ${
                      status === "exceeded"
                        ? "text-red-600"
                        : status === "warning"
                          ? "text-orange-600"
                          : "text-gray-900"
                    }`}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      status === "exceeded"
                        ? "bg-red-500"
                        : status === "warning"
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingDown className="w-4 h-4" />
                    <span>
                      {remaining >= 0
                        ? `$${remaining.toFixed(2)} remaining`
                        : `$${Math.abs(remaining).toFixed(2)} over budget`}
                    </span>
                  </div>
                  {remaining >= 0 && (
                    <span className="text-gray-500">
                      {Math.floor(
                        remaining / (budget.spent / new Date().getDate()) || 0,
                      )}{" "}
                      days left
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 border border-violet-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Budget Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Review your budgets weekly to stay on track</li>
              <li>• Set alerts when you reach 80% of your budget limit</li>
              <li>• Adjust budgets based on seasonal spending patterns</li>
              <li>
                • Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
