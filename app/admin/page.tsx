import { AdminAccountManager } from "@/components/AdminAccountManager";
import { AdminContentManager } from "@/components/AdminContentManager";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
import { PageHero } from "@/components/PageHero";
import { getAdminSession } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";
import { getAdminAccounts, getMessages, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <>
        <PageHero
          eyebrow="Admin"
          title="Beveiligde beheeromgeving"
          description="Deze adminzone is nu afgesloten met meerdere accounts en een sessie-cookie."
        />
        <section className="page-section">
          <div className="container">
            <AdminLogin />
          </div>
        </section>
      </>
    );
  }

  const [products, messages, admins, content] = await Promise.all([
    getProducts(),
    getMessages(),
    getAdminAccounts(),
    getSiteContent()
  ]);

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Beheer prijzen, uploads en productdata"
        description="Hier kun je producten toevoegen, prijzen ingeven, foto's uploaden en contactberichten bekijken."
      />
      <section className="page-section">
        <div className="container stack">
          <AdminDashboard initialProducts={products} messages={messages} session={session} />
          <AdminAccountManager
            session={session}
            initialAdmins={admins.map((admin) => ({
              id: admin.id,
              username: admin.username,
              displayName: admin.displayName,
              role: admin.role
            }))}
          />
          <AdminContentManager session={session} initialContent={content} />
        </div>
      </section>
    </>
  );
}
