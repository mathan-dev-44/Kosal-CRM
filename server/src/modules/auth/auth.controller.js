import { registerUser, loginUser, getCurrentUser } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
