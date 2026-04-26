# PrintForge Studio

Een geavanceerde 3D print webshop gebouwd met Next.js, TypeScript en lokale JSON-opslag. Je kunt deze map rechtstreeks openen in PyCharm.

## Starten in PyCharm

1. Open deze map in PyCharm.
2. Open de terminal in PyCharm.
3. Voer `npm install` uit.
4. Start de app met `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000).

## Belangrijk

- Producten staan in `data/products.json`.
- Contactberichten komen in `data/messages.json`.
- Publieke websitecopy staat in `data/content.json`.
- Geuploade beelden worden geplaatst in `public/uploads/`.
- De adminpagina staat op `/admin`.
- Adminaccounts kun je nu beheren via `/admin` wanneer je ingelogd bent als `superadmin`.

## Stripe Checkout

De winkelmand bevat nu een Stripe checkout-startpunt.

Om dit werkend te maken:

1. Maak een Stripe account aan.
2. Zoek je geheime test key in het Stripe dashboard.
3. Voeg in PyCharm een environment variable toe:
   `STRIPE_SECRET_KEY=sk_test_...`
4. Herstart `npm run dev`.
5. Gebruik de knop in `/cart`.

## Mappenstructuur

```text
app/
  api/
  about/
  admin/
  blog/
  cart/
  contact/
  custom-quote/
  faq/
  gallery/
  materials/
  products/
  services/
components/
data/
lib/
public/
```
