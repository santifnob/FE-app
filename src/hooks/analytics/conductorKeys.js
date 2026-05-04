// src/hooks/analytics/conductorKeys.ts
export const dashboardKeys = {
  all: ['dashboard'],
  tripChartConductor: () => [...dashboardKeys.all, 'trip-chart-conductor'],
  nextTripConductor: () => [...dashboardKeys.all, 'next-trip-conductor'],
  lastLicenseConductor: () => [...dashboardKeys.all, 'last-license-conductor'],
  kilometersConductor: () => [...dashboardKeys.all, 'kilometers-conductor'],
  earningsConductor: () => [...dashboardKeys.all, 'earnings-conductor'],
};