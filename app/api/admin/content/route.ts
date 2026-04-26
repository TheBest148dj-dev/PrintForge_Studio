import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { saveSiteContent } from "@/lib/content";

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Niet toegelaten." }, { status: 403 });
  }

  try {
    const body = await request.json();
    await saveSiteContent(body);

    revalidatePath("/", "layout");
    revalidatePath("/products");
    revalidatePath("/services");
    revalidatePath("/custom-quote");
    revalidatePath("/materials");
    revalidatePath("/gallery");
    revalidatePath("/about");
    revalidatePath("/blog");
    revalidatePath("/contact");
    revalidatePath("/faq");
    revalidatePath("/cart");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Content kon niet opgeslagen worden." }, { status: 500 });
  }
}
