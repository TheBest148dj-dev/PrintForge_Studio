import fs from "node:fs/promises";
import path from "node:path";

import { AdminAccount, ContactMessage, Product, ShopSettings } from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");
const productsFile = path.join(dataDirectory, "products.json");
const messagesFile = path.join(dataDirectory, "messages.json");
const settingsFile = path.join(dataDirectory, "settings.json");
const adminsFile = path.join(dataDirectory, "admins.json");

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getProducts() {
  return readJsonFile<Product[]>(productsFile);
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((product) => product.featured);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function createProduct(product: Product) {
  const products = await getProducts();
  const nextProducts = [product, ...products];
  await writeJsonFile(productsFile, nextProducts);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const products = await getProducts();
  const updatedProducts = products.map((product) =>
    product.id === id ? { ...product, ...updates } : product
  );
  const updated = updatedProducts.find((product) => product.id === id) ?? null;
  await writeJsonFile(productsFile, updatedProducts);
  return updated;
}

export async function deleteProduct(id: string) {
  const products = await getProducts();
  const filteredProducts = products.filter((product) => product.id !== id);
  await writeJsonFile(productsFile, filteredProducts);
}

export async function saveContactMessage(message: ContactMessage) {
  const messages = await readJsonFile<ContactMessage[]>(messagesFile);
  const nextMessages = [message, ...messages];
  await writeJsonFile(messagesFile, nextMessages);
  return message;
}

export async function getMessages() {
  return readJsonFile<ContactMessage[]>(messagesFile);
}

export async function deleteMessage(id: string) {
  const messages = await getMessages();
  const filteredMessages = messages.filter((message) => message.id !== id);
  await writeJsonFile(messagesFile, filteredMessages);
}

export async function getSettings() {
  return readJsonFile<ShopSettings>(settingsFile);
}

export async function getAdminAccounts() {
  return readJsonFile<AdminAccount[]>(adminsFile);
}

export async function createAdminAccount(account: AdminAccount) {
  const accounts = await getAdminAccounts();
  const nextAccounts = [account, ...accounts];
  await writeJsonFile(adminsFile, nextAccounts);
  return account;
}

export async function updateAdminAccount(id: string, updates: Partial<AdminAccount>) {
  const accounts = await getAdminAccounts();
  const updatedAccounts = accounts.map((account) =>
    account.id === id ? { ...account, ...updates } : account
  );
  const updated = updatedAccounts.find((account) => account.id === id) ?? null;
  await writeJsonFile(adminsFile, updatedAccounts);
  return updated;
}

export async function deleteAdminAccount(id: string) {
  const accounts = await getAdminAccounts();
  const filteredAccounts = accounts.filter((account) => account.id !== id);
  await writeJsonFile(adminsFile, filteredAccounts);
}
