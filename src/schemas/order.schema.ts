import { z } from "zod";

export const PostOrderShema = z.object({
  body: z.object({
    nombre_cliente: z.string().min(1),
    fecha: z.coerce.date(),
    productos: z.array(
      z.object({
        nombre_producto: z.string().min(1),
        presentacion: z.string().optional(),
        categoria: z.string().min(1),
        cantidad: z.number().positive(),
        precio_unitario: z.number().positive(),
      })
    ),
  }),
});

export const GetOrderShema = z.object({
  params: z.object({
    id: z.preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number().positive()
    ),
  }),
});

export const UpdateOrderShema = z.object({
  params: z.object({
    id: z.preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number().positive()
    ),
  }),
  body: z.object({
    nombre_cliente: z.string().optional(),
    fecha: z.coerce.date().optional(),
    productos: z.array(
      z.object({
        nombre_producto: z.string().min(1),
        categoria: z.string().min(1),
        cantidad: z.number().positive(),
        presentacion: z.string().optional(),
        precio_unitario: z.number().positive(),
      })
    ),
  }),
});

export type PostOrderType = z.infer<typeof PostOrderShema>["body"];
export type GetOrderType = z.infer<typeof GetOrderShema>["params"];
export type UpdateOrderType = z.infer<typeof UpdateOrderShema>["body"];
