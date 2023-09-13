import { Request, Response } from "express";
import { PostOrderType, UpdateOrderType } from "../schemas/order.schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and } from "drizzle-orm";
import * as models from "../models/orders";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema: models });
migrate(db, { migrationsFolder: "drizzle" });

function formatDate(date: Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export const addOder = async (
  req: Request<unknown, unknown, PostOrderType>,
  res: Response
) => {
  try {
    const { productos, ...order } = req.body;
    const fecha = formatDate(order.fecha);
    const newOrder = (
      await db
        .insert(models.pedido)
        .values({ fecha, nombre_cliente: order.nombre_cliente })
        .returning()
    )[0];
    await db.insert(models.producto).values(
      productos.map((p) => ({
        id_pedido: newOrder.id,
        ...p,
      }))
    );
    return res.json({ message: "Pedido creado" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const getOders = async (req: Request, res: Response) => {
  const re = await db.query.pedido.findMany({
    with: {
      productos: {
        columns: {
          id_pedido: false,
        },
      },
    },
  });
  return res.json({ order: re });
};

export const getOder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const re = await db.query.pedido.findFirst({
    where: eq(models.pedido.id, parseInt(id)),
    with: {
      productos: {
        columns: {
          id_pedido: false,
        },
      },
    },
  });
  return res.json({ orders: re });
};

export const updatedOder = async (
  req: Request<{ id: string }, unknown, UpdateOrderType>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { productos, ...order } = req.body;
    const fecha = order.fecha ? formatDate(order.fecha) : undefined;
    if (fecha || order.nombre_cliente) {
      await db
        .update(models.pedido)
        .set({ fecha, nombre_cliente: order.nombre_cliente })
        .where(eq(models.pedido.id, parseInt(id)));
    }
    for (const product of productos) {
      await db
        .update(models.producto)
        .set({
          cantidad: product.cantidad,
          precio_unitario: product.precio_unitario,
        })
        .where(
          and(
            eq(models.producto.id_pedido, parseInt(id)),
            eq(models.producto.nombre_producto, product.nombre_producto)
          )
        );
    }

    return res.json({ message: "Pedido actualizado" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server Error" });
  }
};
