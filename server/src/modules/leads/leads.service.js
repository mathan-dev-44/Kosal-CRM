import {
  createLead,
  findLeadById,
  findLeads,
  updateLead,
  assignLead,
  deletedLead,
} from "./leads.repository.js";

export const createNewLead = async (data, user) => {
  let assignedTo = null;

  if (user.role === "SALES") {
    assignedTo = user.userId;
  }

  if (user.role === "ADMIN" && data.assignedTo) {
    assignedTo = data.assignedTo;
  }

  const lead = await createLead({
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    source: data.source,
    stage: data.stage,
    assignedTo,
  });

  return lead;
};
export const getLeadById = async (id, user) => {
  const lead = await findLeadById(id);

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (user.role === "SALES" && lead.assigned_to !== user.userId) {
    throw new Error("You do not have access to this lead");
  }

  return lead;
};

export const getAllLeads = async ({
  user,
  search,
  stage,
  assignedTo,
  page,
  limit,
}) => {
  const filters = {
    search,
    stage,
    page,
    limit,
  };

  if (user.role === "SALES") {
    filters.assignedTo = user.userId;
  } else if (assignedTo) {
    filters.assignedTo = assignedTo;
  }

  return await findLeads(filters);
};

export const updateExistingLead = async (id, data, user) => {
  const existingLead = await findLeadById(id);

  if (!existingLead) {
    throw new Error("Lead not found");
  }

  if (user.role === "SALES" && existingLead.assigned_to !== user.userId) {
    throw new Error("You do not have access to this lead");
  }

  return await updateLead(id, data);
};

export const assignExistingLead = async (leadId, userId) => {
  const lead = await findLeadById(leadId);

  if (!lead) {
    throw new Error("Lead not found");
  }

  return await assignLead(leadId, userId);
};

export const removeLead = async (id) => {
  return await deletedLead(id);
};
