// src/hooks/analytics/keys.ts
export const dashboardKeys = {
  all: ['dashboard'],
  fleetStatus: () => [...dashboardKeys.all, 'fleet-status'],
  tripQuality: (period) => [...dashboardKeys.all, 'trip-quality', period],
  licenseAlerts: () => [...dashboardKeys.all, 'license-alerts'],
};