CREATE TABLE `pedido` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre_cliente` text,
	`fecha` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `producto` (
	`nombre_producto` text NOT NULL,
	`categoria` text NOT NULL,
	`presentacion` text,
	`cantidad` integer NOT NULL,
	`precio_unitario` real NOT NULL,
	`id_pedido` integer NOT NULL
);
