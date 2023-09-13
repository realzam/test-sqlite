import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const pedido = sqliteTable("pedido", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre_cliente: text("nombre_cliente"),
  fecha: text("fecha").notNull(),
});

export const producto = sqliteTable("producto", {
  nombre_producto: text("nombre_producto").notNull(),
  categoria: text("categoria").notNull(),
  presentacion: text("presentacion"),
  cantidad: integer("cantidad").notNull(),
  precio_unitario: real("precio_unitario").notNull(),
  id_pedido: integer("id_pedido").notNull(),
});

export const pedidoRelation = relations(pedido, ({ many }) => ({
  productos: many(producto),
}));

export const productoRelations = relations(producto, ({ one }) => ({
  author: one(pedido, {
    fields: [producto.id_pedido],
    references: [pedido.id],
  }),
}));
