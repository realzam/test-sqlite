import { Router } from "express";
import {
  addOder,
  getOder,
  getOders,
  updatedOder,
} from "../controllers/orders.controllers";
import { schemaValidation } from "../middleware/schemaValidation.middleware";
import {
  PostOrderShema,
  GetOrderShema,
  UpdateOrderShema,
} from "../schemas/order.schema";

const router = Router();

router.post("/api/pedido", schemaValidation(PostOrderShema), addOder);
router.get("/api/pedido", getOders);
router.get("/api/pedido/:id", schemaValidation(GetOrderShema), getOder);
router.put("/api/pedido/:id", schemaValidation(UpdateOrderShema), updatedOder);

export default router;
