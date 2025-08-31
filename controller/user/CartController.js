import pool from "../../config.js";

export const AddtoCart = async (req, res) => {
  try {
    const { user } = req; 
    const { product_id, price } = req.body;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!product_id || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID and price are required" });
    }

    await pool.execute(
      `INSERT INTO carts (product_id, price, user_id) VALUES (?, ?, ?)`,
      [product_id, price, user.id]
    );

    return res.json({
      success: true,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
