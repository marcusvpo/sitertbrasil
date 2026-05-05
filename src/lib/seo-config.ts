export const SITE_URL = "https://www.rtbrasilimport.com.br";
export const SITE_NAME = "RT Brasil MOTOREX";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const DEFAULT_TITLE =
  "RT Brasil MOTOREX | Óleos Suíços p/ Moto";
export const DEFAULT_DESCRIPTION =
  "Distribuidora oficial MOTOREX no Brasil. Óleos e lubrificantes suíços de alta performance para motocross, enduro, trilha e off-road. Seja revendedor.";

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RT Brasil Import — Distribuidora Oficial MOTOREX",
  alternateName: "RT Brasil MOTOREX",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-motorex.png`,
  description: DEFAULT_DESCRIPTION,
  foundingDate: "2010",
  brand: { "@type": "Brand", name: "MOTOREX", url: "https://www.motorex.com" },
  areaServed: { "@type": "Country", name: "Brasil" },
  sameAs: [
    "https://www.instagram.com/rtbrasilmotorex/",
    "https://www.motorex.com",
  ],
};
