import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description?: string;
  canonical?: string;
}

export default function Seo({ title, description, canonical }: SeoProps) {
  const metaDescription = description || "Yaver Dilekçe - Süreçlerinizde yapay zeka destekli rehberiniz.";
  const fullTitle = `${title} | Yaver`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
