import { findBuildingById } from "./buildings.repository.js";

import {
  createUnit,
  findUnitsByBuildingId,
  findUnitById,
  updateUnit,
} from "./units.repository.js";

export const createNewUnit = async (buildingId, data) => {
  const building = await findBuildingById(buildingId);

  if (!building) {
    throw new Error("Building not found");
  }

  return await createUnit({
    buildingId,
    unitNumber: data.unitNumber,
    type: data.type,
    price: data.price,
    status: data.status,
  });
};

export const getBuildingUnits = async (buildingId, filters) => {
  const building = await findBuildingById(buildingId);

  if (!building) {
    throw new Error("Building not found");
  }

  return await findUnitsByBuildingId(buildingId, filters);
};

export const getUnitById = async (id) => {
  const unit = await findUnitById(id);

  if (!unit) {
    throw new Error("Unit not found");
  }

  return unit;
};

export const updateExistingUnit = async (id, data) => {
  const unit = await findUnitById(id);

  if (!unit) {
    throw new Error("Unit not found");
  }

  return await updateUnit(id, data);
};
