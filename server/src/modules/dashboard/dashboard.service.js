import { getDashboardStats } from "./dashboard.repository.js";

export const getDashboard = async (user) => {
  const stats = await getDashboardStats({
    userId: user.userId,
    role: user.role,
  });

  return {
    leads: {
      total: Number(stats.leads.total),
      new: Number(stats.leads.new),
      contacted: Number(stats.leads.contacted),
      siteVisits: Number(stats.leads.site_visits),
      interested: Number(stats.leads.interested),
      negotiation: Number(stats.leads.negotiation),
      booked: Number(stats.leads.booked),
      lost: Number(stats.leads.lost),
    },

    followUps: {
      today: Number(stats.followUps.today),
      pending: Number(stats.followUps.pending),
    },

    bookings: {
      total: Number(stats.bookings.total),
      totalValue: Number(stats.bookings.total_value),
    },

    units: {
      available: Number(stats.units.available),
      booked: Number(stats.units.booked),
      blocked: Number(stats.units.blocked),
    },
  };
};
