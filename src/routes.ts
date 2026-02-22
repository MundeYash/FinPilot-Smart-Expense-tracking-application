import { createBrowserRouter } from "react-router";
import { Root } from "./components/ui/Root";
import { Dashboard } from "./components/ui/Dashboard";
import { Transactions } from "./components/ui/Transactions";
import { Analytics } from "./components/ui/Analytics";
import { Budget } from "./components/ui/Budget";
import { Settings } from "./components/ui/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "transactions", Component: Transactions },
      { path: "analytics", Component: Analytics },
      { path: "budget", Component: Budget },
      { path: "settings", Component: Settings },
    ],
  },
]);
