import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { saveContactMessage } from "@/lib/data";
import { createId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: "Ontbrekende velden" }, { status: 400 });
    }

    const message = await saveContactMessage({
      id: createId("msg"),
      name: body.name,
      email: body.email,
      company: body.company,
      fileType: body.fileType,
      quantity: body.quantity,
      deadline: body.deadline,
      finish: body.finish,
      subject: body.subject,
      message: body.message,
      createdAt: new Date().toISOString()
    });

    revalidatePath("/admin");
    revalidatePath("/contact");
    revalidatePath("/custom-quote");

    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bericht kon niet worden opgeslagen." }, { status: 500 });
  }
}
