import {
  addFollowUpToLead,
  getLeadFollowUps,
  updateExistingFollowUp,
} from "./followups.service.js";

export const createFollowUp = async (req, res) => {
  try {
    const followUp = await addFollowUpToLead(req.params.id, req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Follow-up created successfully",
      data: followUp,
    });
  } catch (error) {
    console.error(error);

    let status = 400;

    if (error.message === "Lead not found") {
      status = 404;
    }

    if (error.message === "You do not have access to this lead") {
      status = 403;
    }

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFollowUps = async (req, res) => {
  try {
    const followUps = await getLeadFollowUps(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: followUps,
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

export const updateFollowUp = async (req, res) => {
  try {
    const followUp = await updateExistingFollowUp(
      req.params.id,
      req.params.followUpId,
      req.body,
      req.user,
    );

    return res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      data: followUp,
    });
  } catch (error) {
    console.error(error);

    let status = 400;

    if (
      error.message === "Lead not found" ||
      error.message === "Follow-up not found"
    ) {
      status = 404;
    }

    if (error.message === "You do not have access to this lead") {
      status = 403;
    }

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};
