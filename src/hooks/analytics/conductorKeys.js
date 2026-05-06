// src/hooks/analytics/conductorKeys.ts
export const dashboardKeys = {
  all: ['dashboard'],
  tripChartConductor: (conductorId) => [...dashboardKeys.all, 'trip-chart-conductor', conductorId],
  nextTripConductor: (conductorId) => [...dashboardKeys.all, 'next-trip-conductor', conductorId],
  lastLicenseConductor: (conductorId) => [...dashboardKeys.all, 'last-license-conductor', conductorId],
  kilometersConductor: (conductorId) => [...dashboardKeys.all, 'kilometers-conductor', conductorId],
  earningsConductor: (conductorId) => [...dashboardKeys.all, 'earnings-conductor', conductorId],
};