export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "salary"
  | "freelance"
  | "investment"
  | "other-income"
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "shopping"
  | "healthcare"
  | "education"
  | "rent"
  | "other-expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: Date;
  tags?: string[];
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}
