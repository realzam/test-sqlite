import express from "express";
import orderRoutes from "./routes/orders.routes";

const app = express();

app.use(express.json());
app.use(orderRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server on port", process.env.PORT || 3000);
});
