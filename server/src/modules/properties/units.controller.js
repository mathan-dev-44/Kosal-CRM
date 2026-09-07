import {
  createNewUnit,
  getBuildingUnits,
  getUnitById,
  updateExistingUnit,
} from "./units.service.js";

export const createUnit = async (req, res) => {
  try {
    const unit = await createNewUnit(req.params.buildingId, req.body);

    return res.status(201).json({
      success: true,
      message: "Unit created successfully",
      data: unit,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUnits = async (req, res) => {
  try {
    console.log("BUILDING ID:", req.params.buildingId);
    console.log("STATUS:", req.query.status);
    console.log("TYPE:", req.query.type);

    const units = await getBuildingUnits(req.params.buildingId, {
      status: req.query.status,
      type: req.query.type,
    });

    return res.status(200).json({
      success: true,
      data: units,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUnit = async (req, res) => {
  try {
    const unit = await getUnitById(req.params.id);

    return res.status(200).json({
      success: true,
      data: unit,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const unit = await updateExistingUnit(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: unit,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
