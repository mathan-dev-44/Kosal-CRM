import {
  createNewLead,
  getLeadById,
  getAllLeads,
  updateExistingLead,
  assignExistingLead,
  removeLead,
} from "./leads.service.js";

export const createLead = async (req, res) => {
  try {
    const lead = await createNewLead(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { search, stage, assignedTo } = req.query;

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const result = await getAllLeads({
      user: req.user,
      search,
      stage,
      assignedTo,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

export const getLead = async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error(error);

    const status = error.message === "Lead not found" ? 404 : 403;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await updateExistingLead(req.params.id, req.body, req.user);

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error(error);

    const status = error.message === "Lead not found" ? 404 : 403;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignLead = async (req, res) => {
  try {
    const lead = await assignExistingLead(req.params.id, req.body.assignedTo);

    return res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: lead,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await removeLead(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: lead,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
