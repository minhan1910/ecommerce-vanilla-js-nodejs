import express from "express";
import cors from "cors";
import data from "./data.js";
const app = express();

app.use(cors());

app.get("/api/products", (req, res) => {
  res.send(data.products);
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const productFilter = data.products.find(
    (product) => product._id === (id)
  );

  if (!productFilter) {
    return res.status(400).json({
      message: "Product Not Found!",
    });
  }

  return res.send(productFilter);
});

app.listen(5000, () => {
  console.log(`serve at http://localhost:5000`);
});
