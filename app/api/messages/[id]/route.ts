import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { deleteMessage } from "@/lib/data";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteMessage(id);
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
