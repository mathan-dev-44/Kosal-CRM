import { getDashboard } from "./dashboard.service.js";

export const getDashboardStats = async (req, res) => {
  try {
    const dashboard = await getDashboard(req.user);

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};
