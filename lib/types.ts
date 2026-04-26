export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  material: string;
  price: number;
  stock: number;
  featured: boolean;
  leadTimeDays: number;
  rating: number;
  heroTag: string;
  image: string;
  stlUrl?: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  specs: string[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  company?: string;
  fileType?: string;
  quantity?: string;
  deadline?: string;
  finish?: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type ShopSettings = {
  shopName: string;
  heroHeadline: string;
  supportEmail: string;
  supportPhone: string;
  primaryColor: string;
};

export type AdminAccount = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  passwordHash: string;
};

export type AdminSession = {
  id?: string;
  username: string;
  displayName: string;
  role: string;
};

export type AdminAccountSafe = {
  id: string;
  username: string;
  displayName: string;
  role: string;
};
