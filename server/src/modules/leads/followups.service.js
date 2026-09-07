import { findLeadById } from "./leads.repository.js";

import {
  createFollowUp,
  findFollowUpsByLeadId,
  findFollowUpById,
  updateFollowUp,
} from "./followups.respository.js";

const checkLeadAccess = async (leadId, user) => {
  const lead = await findLeadById(leadId);

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (user.role === "SALES" && lead.assigned_to !== user.userId) {
    throw new Error("You do not have access to this lead");
  }

  return lead;
};

export const addFollowUpToLead = async (leadId, data, user) => {
  await checkLeadAccess(leadId, user);

  return await createFollowUp({
    leadId,
    scheduledAt: data.scheduledAt,
    remarks: data.remarks || null,
  });
};

export const getLeadFollowUps = async (leadId, user) => {
  await checkLeadAccess(leadId, user);

  return await findFollowUpsByLeadId(leadId);
};

export const updateExistingFollowUp = async (
  leadId,
  followUpId,
  data,
  user,
) => {
  await checkLeadAccess(leadId, user);

  const followUp = await findFollowUpById(followUpId);

  if (!followUp) {
    throw new Error("Follow-up not found");
  }

  if (followUp.lead_id !== leadId) {
    throw new Error("Follow-up does not belong to this lead");
  }

  return await updateFollowUp(followUpId, data);
};
