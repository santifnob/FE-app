import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys.js";

const mockQuickActions = [
  { id: "qa-1", title: "New Trip", description: "Schedule a new service" },
  { id: "qa-2", title: "Register Driver", description: "Add a new conductor" },
  { id: "qa-3", title: "Train Maintenance", description: "Review upcoming checks" },
  { id: "qa-4", title: "View Reports", description: "Open operational dashboards" },
];

export function useQuickActions() {
  return useQuery({
    queryKey: dashboardKeys.quickActions(),
    queryFn: async () => {
      return mockQuickActions;
    },
    initialData: mockQuickActions,
    staleTime: 1000 * 60 * 30,
  });
}
