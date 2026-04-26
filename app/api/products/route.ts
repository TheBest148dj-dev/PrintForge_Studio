import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { createProduct, getProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import { createId, slugify } from "@/lib/utils";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.category || !body.material || !body.image) {
    return NextResponse.json({ error: "Ontbrekende productvelden" }, { status: 400 });
  }

  const product: Product = {
    id: createId("prod"),
    slug: slugify(body.name),
    name: body.name,
    category: body.category,
    material: body.material,
    price: Number(body.price ?? 0),
    stock: Number(body.stock ?? 0),
    featured: Boolean(body.featured),
    leadTimeDays: Number(body.leadTimeDays ?? 0),
    rating: 4.8,
    heroTag: body.heroTag ?? "New",
    image: body.image,
    stlUrl: body.stlUrl ?? "",
    gallery: [body.image],
    shortDescription: body.shortDescription ?? "",
    description: body.description ?? "",
    specs: Array.isArray(body.specs) ? body.specs : []
  };

  await createProduct(product);
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const kind = String(formData.get("kind") || "image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Geen bestand ontvangen" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = file.name.split(".").pop() || "png";
  const filename = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`;
  const folder = kind === "model" ? "models" : "uploads";
  const uploadPath = path.join(process.cwd(), "public", folder, filename);

  await fs.writeFile(uploadPath, buffer);

  if (kind === "model") {
    return NextResponse.json({ modelUrl: `/models/${filename}` });
  }

  return NextResponse.json({ imageUrl: `/uploads/${filename}` });
}
