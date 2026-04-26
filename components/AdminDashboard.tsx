"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import type { AdminSession, ContactMessage, Product } from "@/lib/types";

type AdminDashboardProps = {
  initialProducts: Product[];
  messages: ContactMessage[];
  session: AdminSession;
};

type Notice = {
  type: "success" | "error";
  text: string;
} | null;

export function AdminDashboard({ initialProducts, messages, session }: AdminDashboardProps) {
  const [products, setProducts] = useState(initialProducts);
  const [inboxMessages, setInboxMessages] = useState(messages);
  const [notice, setNotice] = useState<Notice>(null);
  const [createUploadPreview, setCreateUploadPreview] = useState("");
  const [editUploadPreview, setEditUploadPreview] = useState("");
  const [createModelPreview, setCreateModelPreview] = useState("");
  const [editModelPreview, setEditModelPreview] = useState("");
  const [editingProductId, setEditingProductId] = useState(initialProducts[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const featuredCount = useMemo(() => products.filter((item) => item.featured).length, [products]);
  const editingProduct = products.find((product) => product.id === editingProductId) ?? null;

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    mode: "create" | "edit",
    kind: "image" | "model" = "image"
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);

    const response = await fetch("/api/products", {
      method: "PUT",
      body: formData
    });

    if (!response.ok) {
      setNotice({ type: "error", text: "Upload van afbeelding mislukt." });
      return;
    }

    const result = (await response.json()) as { imageUrl?: string; modelUrl?: string };

    if (kind === "model") {
      if (mode === "create") {
        setCreateModelPreview(result.modelUrl || "");
      } else {
        setEditModelPreview(result.modelUrl || "");
      }
    } else {
      if (mode === "create") {
        setCreateUploadPreview(result.imageUrl || "");
      } else {
        setEditUploadPreview(result.imageUrl || "");
      }
    }

    setNotice({
      type: "success",
      text: kind === "model" ? "STL geupload. Je kunt het product nu opslaan." : "Afbeelding geupload. Je kunt het product nu opslaan."
    });
  }

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      category: formData.get("category"),
      material: formData.get("material"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      leadTimeDays: Number(formData.get("leadTimeDays")),
      featured: formData.get("featured") === "on",
      heroTag: formData.get("heroTag"),
      shortDescription: formData.get("shortDescription"),
      description: formData.get("description"),
      specs: String(formData.get("specs") ?? "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      image: createUploadPreview || formData.get("image"),
      stlUrl: createModelPreview || formData.get("stlUrl")
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error();
      }

      const created = (await response.json()) as Product;
      setProducts((current) => [created, ...current]);
      setCreateUploadPreview("");
      setCreateModelPreview("");
      setEditingProductId(created.id);
      form.reset();
      setNotice({ type: "success", text: "Nieuw product toegevoegd aan de webshop." });
    } catch {
      setNotice({ type: "error", text: "Product opslaan mislukt." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingProduct) {
      setNotice({ type: "error", text: "Kies eerst een product om te bewerken." });
      return;
    }

    setIsUpdating(true);
    setNotice(null);

    const formData = new FormData(event.currentTarget);
    const imageValue = String(formData.get("image") || "").trim();
    const nextImage = editUploadPreview || imageValue || editingProduct.image;
    const stlValue = String(formData.get("stlUrl") || "").trim();
    const payload = {
      name: String(formData.get("name") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      material: String(formData.get("material") || "").trim(),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      leadTimeDays: Number(formData.get("leadTimeDays")),
      featured: formData.get("featured") === "on",
      heroTag: String(formData.get("heroTag") || "").trim(),
      shortDescription: String(formData.get("shortDescription") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      specs: String(formData.get("specs") ?? "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      image: nextImage,
      stlUrl: editModelPreview || stlValue || editingProduct.stlUrl || "",
      gallery: [nextImage]
    };

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error();
      }

      const updated = (await response.json()) as Product;
      setProducts((current) =>
        current.map((product) => (product.id === updated.id ? updated : product))
      );
      setEditUploadPreview("");
      setEditModelPreview("");
      setNotice({ type: "success", text: "Bestaand product bijgewerkt op de website." });
    } catch {
      setNotice({ type: "error", text: "Bewerken van product mislukt." });
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      setNotice({ type: "error", text: "Verwijderen mislukt." });
      return;
    }

    const remaining = products.filter((product) => product.id !== id);
    setProducts(remaining);

    if (editingProductId === id) {
      setEditingProductId(remaining[0]?.id ?? "");
      setEditUploadPreview("");
      setEditModelPreview("");
    }

    setNotice({ type: "success", text: "Product verwijderd uit de lijst." });
  }

  async function handleDeleteMessage(id: string) {
    const response = await fetch(`/api/messages/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      setNotice({ type: "error", text: "Bericht verwijderen mislukt." });
      return;
    }

    setInboxMessages((current) => current.filter((message) => message.id !== id));
    setNotice({ type: "success", text: "Klantbericht verwijderd uit de inbox." });
  }

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div
        className="glass-panel"
        style={{
          borderRadius: 24,
          padding: 20,
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center"
        }}
      >
        <div className="stack" style={{ gap: 4 }}>
          <strong>{session.displayName}</strong>
          <span className="muted">
            @{session.username} | Rol: {session.role}
          </span>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="stats-grid">
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
          <span className="muted">Totaal producten</span>
          <h3 style={{ margin: "8px 0 0", fontSize: "2rem" }}>{products.length}</h3>
        </div>
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
          <span className="muted">Featured producten</span>
          <h3 style={{ margin: "8px 0 0", fontSize: "2rem" }}>{featuredCount}</h3>
        </div>
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
          <span className="muted">Binnengekomen berichten</span>
          <h3 style={{ margin: "8px 0 0", fontSize: "2rem" }}>{inboxMessages.length}</h3>
        </div>
        <div className="glass-panel" style={{ padding: 24, borderRadius: 24 }}>
          <span className="muted">Upload preview</span>
          <h3 style={{ margin: "8px 0 0", fontSize: "1.1rem" }}>
            {editUploadPreview || createUploadPreview || "Nog geen upload"}
          </h3>
        </div>
      </div>

      <div className="split-layout">
        <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
          <div className="section-heading">
            <span className="eyebrow">Nieuw product</span>
            <h2 style={{ margin: 0 }}>Voeg producten toe met prijs, foto, specs en voorraad.</h2>
          </div>
          <form className="form-grid" onSubmit={handleCreateProduct}>
            <div className="form-grid two">
              <label className="field">
                <span>Productnaam</span>
                <input name="name" required placeholder="Ultra Desk Dock" />
              </label>
              <label className="field">
                <span>Categorie</span>
                <input name="category" required placeholder="Desk Setup" />
              </label>
            </div>
            <div className="form-grid two">
              <label className="field">
                <span>Materiaal</span>
                <input name="material" required placeholder="PLA Silk" />
              </label>
              <label className="field">
                <span>Hero label</span>
                <input name="heroTag" required placeholder="Limited" />
              </label>
            </div>
            <div className="form-grid two">
              <label className="field">
                <span>Prijs</span>
                <input name="price" type="number" step="0.01" required placeholder="59.95" />
              </label>
              <label className="field">
                <span>Voorraad</span>
                <input name="stock" type="number" required placeholder="25" />
              </label>
            </div>
            <div className="form-grid two">
              <label className="field">
                <span>Levertijd in dagen</span>
                <input name="leadTimeDays" type="number" required placeholder="4" />
              </label>
              <label className="field" style={{ alignContent: "end" }}>
                <span>Featured product</span>
                <input name="featured" type="checkbox" style={{ width: 24, height: 24 }} />
              </label>
            </div>
            <label className="field">
              <span>Korte beschrijving</span>
              <input name="shortDescription" required placeholder="Korte samenvatting voor cards." />
            </label>
            <label className="field">
              <span>Volledige beschrijving</span>
              <textarea name="description" required />
            </label>
            <label className="field">
              <span>Specs, 1 per lijn</span>
              <textarea name="specs" required placeholder={"Print resolution: 0.16mm\nLarge build volume"} />
            </label>
            <div className="form-grid two">
              <label className="field">
                <span>Afbeelding via URL</span>
                <input name="image" placeholder="https://..." />
              </label>
              <label className="field">
                <span>Of upload een lokale afbeelding</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageUpload(event, "create", "image")}
                />
              </label>
            </div>
            <div className="form-grid two">
              <label className="field">
                <span>STL via URL</span>
                <input name="stlUrl" placeholder="/models/jouw-model.stl of https://..." />
              </label>
              <label className="field">
                <span>Of upload een STL bestand</span>
                <input
                  type="file"
                  accept=".stl,model/stl"
                  onChange={(event) => handleImageUpload(event, "create", "model")}
                />
              </label>
            </div>
            {createUploadPreview ? (
              <div className="glass-panel" style={{ borderRadius: 20, padding: 18 }}>
                <p className="muted" style={{ marginTop: 0 }}>
                  Geuploade preview
                </p>
                <img
                  src={createUploadPreview}
                  alt="Upload preview"
                  style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 18 }}
                />
              </div>
            ) : null}
            {createModelPreview ? (
              <div className="pill" style={{ width: "fit-content" }}>
                STL klaar: {createModelPreview}
              </div>
            ) : null}
            <div className="button-row">
              <button className="button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Opslaan..." : "Product toevoegen"}
              </button>
            </div>
            {notice ? (
              <p style={{ margin: 0, color: notice.type === "error" ? "#a72c17" : "#145c47" }}>
                {notice.text}
              </p>
            ) : null}
          </form>
        </div>

        <div className="stack">
          <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
            <div className="section-heading">
              <span className="eyebrow">Bewerk online product</span>
              <h2 style={{ margin: 0 }}>Pas prijs, info en foto aan van producten die al live staan.</h2>
            </div>
            {editingProduct ? (
              <form className="form-grid" onSubmit={handleUpdateProduct}>
                <label className="field">
                  <span>Kies product</span>
                  <select
                    value={editingProductId}
                    onChange={(event) => {
                      setEditingProductId(event.target.value);
                      setEditUploadPreview("");
                    }}
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="form-grid two">
                  <label className="field">
                    <span>Productnaam</span>
                    <input name="name" required defaultValue={editingProduct.name} key={`${editingProduct.id}-name`} />
                  </label>
                  <label className="field">
                    <span>Categorie</span>
                    <input
                      name="category"
                      required
                      defaultValue={editingProduct.category}
                      key={`${editingProduct.id}-category`}
                    />
                  </label>
                </div>
                <div className="form-grid two">
                  <label className="field">
                    <span>Materiaal</span>
                    <input
                      name="material"
                      required
                      defaultValue={editingProduct.material}
                      key={`${editingProduct.id}-material`}
                    />
                  </label>
                  <label className="field">
                    <span>Hero label</span>
                    <input
                      name="heroTag"
                      required
                      defaultValue={editingProduct.heroTag}
                      key={`${editingProduct.id}-heroTag`}
                    />
                  </label>
                </div>
                <div className="form-grid two">
                  <label className="field">
                    <span>Prijs</span>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingProduct.price}
                      key={`${editingProduct.id}-price`}
                    />
                  </label>
                  <label className="field">
                    <span>Voorraad</span>
                    <input
                      name="stock"
                      type="number"
                      required
                      defaultValue={editingProduct.stock}
                      key={`${editingProduct.id}-stock`}
                    />
                  </label>
                </div>
                <div className="form-grid two">
                  <label className="field">
                    <span>Levertijd in dagen</span>
                    <input
                      name="leadTimeDays"
                      type="number"
                      required
                      defaultValue={editingProduct.leadTimeDays}
                      key={`${editingProduct.id}-leadTimeDays`}
                    />
                  </label>
                  <label className="field" style={{ alignContent: "end" }}>
                    <span>Featured product</span>
                    <input
                      name="featured"
                      type="checkbox"
                      defaultChecked={editingProduct.featured}
                      key={`${editingProduct.id}-featured`}
                      style={{ width: 24, height: 24 }}
                    />
                  </label>
                </div>
                <label className="field">
                  <span>Korte beschrijving</span>
                  <input
                    name="shortDescription"
                    required
                    defaultValue={editingProduct.shortDescription}
                    key={`${editingProduct.id}-shortDescription`}
                  />
                </label>
                <label className="field">
                  <span>Volledige beschrijving</span>
                  <textarea
                    name="description"
                    required
                    defaultValue={editingProduct.description}
                    key={`${editingProduct.id}-description`}
                  />
                </label>
                <label className="field">
                  <span>Specs, 1 per lijn</span>
                  <textarea
                    name="specs"
                    required
                    defaultValue={editingProduct.specs.join("\n")}
                    key={`${editingProduct.id}-specs`}
                  />
                </label>
                <div className="form-grid two">
                  <label className="field">
                    <span>Afbeelding via URL</span>
                    <input
                      name="image"
                      defaultValue={editingProduct.image}
                      key={`${editingProduct.id}-image`}
                    />
                  </label>
                  <label className="field">
                    <span>Of upload een nieuwe afbeelding</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageUpload(event, "edit", "image")}
                    />
                  </label>
                </div>
                <div className="form-grid two">
                  <label className="field">
                    <span>STL via URL</span>
                    <input
                      name="stlUrl"
                      defaultValue={editingProduct.stlUrl || ""}
                      key={`${editingProduct.id}-stlUrl`}
                    />
                  </label>
                  <label className="field">
                    <span>Of upload een nieuw STL bestand</span>
                    <input
                      type="file"
                      accept=".stl,model/stl"
                      onChange={(event) => handleImageUpload(event, "edit", "model")}
                    />
                  </label>
                </div>
                <div className="glass-panel" style={{ borderRadius: 20, padding: 18 }}>
                  <p className="muted" style={{ marginTop: 0 }}>
                    Huidige live afbeelding
                  </p>
                  <img
                    src={editUploadPreview || editingProduct.image}
                    alt={editingProduct.name}
                    style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 18 }}
                  />
                </div>
                {editModelPreview || editingProduct.stlUrl ? (
                  <div className="pill" style={{ width: "fit-content" }}>
                    STL gekoppeld: {editModelPreview || editingProduct.stlUrl}
                  </div>
                ) : null}
                <div className="button-row">
                  <button className="button-secondary" type="submit" disabled={isUpdating}>
                    {isUpdating ? "Bijwerken..." : "Product bijwerken"}
                  </button>
                </div>
              </form>
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                Er zijn nog geen producten om te bewerken.
              </p>
            )}
          </div>

          <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
            <div className="section-heading">
              <span className="eyebrow">Inbox</span>
              <h2 style={{ margin: 0 }}>Laatste contactberichten</h2>
            </div>
            <div className="stack">
              {inboxMessages.length === 0 ? (
                <p className="muted" style={{ margin: 0 }}>
                  Nog geen berichten ontvangen.
                </p>
              ) : (
                inboxMessages.slice(0, 5).map((message) => (
                  <article
                    key={message.id}
                    style={{ paddingBottom: 16, borderBottom: "1px solid var(--line)" }}
                  >
                    <strong>{message.subject}</strong>
                    <p className="muted" style={{ margin: "8px 0" }}>
                      {message.name} - {message.email}
                    </p>
                    <div className="stack" style={{ gap: 8, marginBottom: 12 }}>
                      {message.fileType ? <div className="pill">Bestandstype: {message.fileType}</div> : null}
                      {message.quantity ? <div className="pill">Aantal: {message.quantity}</div> : null}
                      {message.deadline ? <div className="pill">Deadline: {message.deadline}</div> : null}
                      {message.finish ? <div className="pill">Afwerking: {message.finish}</div> : null}
                    </div>
                    <p style={{ margin: 0 }}>{message.message}</p>
                    <div className="button-row" style={{ marginTop: 12 }}>
                      <button className="button-ghost" type="button" onClick={() => handleDeleteMessage(message.id)}>
                        Verwijder bericht
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
          <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
            <div className="section-heading">
              <span className="eyebrow">Tips</span>
              <h2 style={{ margin: 0 }}>Hoe je dit verder uitbreidt</h2>
            </div>
            <div className="stack">
              <p className="muted" style={{ margin: 0 }}>
                Koppel later een echte database zoals PostgreSQL, voeg login toe via NextAuth, en maak orderbeheer aan
                via extra API routes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
        <div className="section-heading">
          <span className="eyebrow">Huidige catalogus</span>
          <h2 style={{ margin: 0 }}>Productbeheer</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Naam</th>
                <th>Categorie</th>
                <th>Prijs</th>
                <th>Voorraad</th>
                <th>Featured</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>EUR {product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>{product.featured ? "Ja" : "Nee"}</td>
                  <td>
                    <div className="button-row">
                      <button
                        className="button-ghost"
                        type="button"
                        onClick={() => {
                          setEditingProductId(product.id);
                          setEditUploadPreview("");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Bewerk
                      </button>
                      <button
                        className="button-ghost"
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Verwijder
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
