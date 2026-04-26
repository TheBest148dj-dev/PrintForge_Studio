import { NextResponse } from "next/server";

import { deleteProduct, updateProduct } from "@/lib/data";
import { slugify } from "@/lib/utils";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await request.json();
  const normalizedUpdates = {
    ...updates,
    ...(updates.name ? { slug: slugify(String(updates.name)) } : {})
  };
  const product = await updateProduct(id, normalizedUpdates);

  if (!product) {
    return NextResponse.json({ error: "Product niet gevonden" }, { status: 404 });
  }

  return NextResponse.json(product);
}
