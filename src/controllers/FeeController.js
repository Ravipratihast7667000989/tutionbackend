import Fee from "../models/FeeModel.js";

// POST Fee
export const addFee = async (req, res) => {
  try {
     console.log(req.body);
    const { studentName, course, amount } = req.body;

    const fee = await Fee.create({
      studentName,
      course,
      amount,
    });

    res.status(201).json({
      success: true,
      message: "Fee Added Successfully",
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET All Fees
export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: fees.length,
      data: fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET Single Fee
export const getSingleFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE Fee
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(
      req.params.id
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};