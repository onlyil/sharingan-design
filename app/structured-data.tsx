import { SITE_URL } from '@/constants/urls'

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Sharingan Designer',
    alternateName: 'Mangekyo Sharingan Creator',
    description:
      'Create custom Mangekyo Sharingan eye patterns inspired by Naruto anime. Free online design tool with bezier curve editor, symmetry controls, and real-time preview.',
    url: SITE_URL,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web Browser',
    author: {
      '@type': 'Person',
      name: 'onlyil',
      url: 'https://github.com/onlyil',
    },
    creator: {
      '@type': 'Person',
      name: 'onlyil',
      url: 'https://github.com/onlyil',
    },
    applicationSubCategory: 'Graphic Design Tool',
    featureList: [
      'Bezier Curve Editor',
      'Symmetrical Design',
      'Real-time Preview',
      'Multiple Shape Support',
      'Animation Controls',
      'Export Functionality',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    inLanguage: 'en',
    isAccessibleForFree: true,
    keywords:
      'sharingan designer, mangekyo sharingan, naruto eye designer, anime eye creator, sharingan generator, uchiha sharingan, naruto shippuden, anime character creator, eye pattern design, symmetrical design tool, bezier curve editor, online drawing tool, anime art generator',
    mainEntity: {
      '@type': 'CreativeWork',
      name: 'Sharingan Pattern Designer',
      description:
        'An interactive web application for designing custom Mangekyo Sharingan eye patterns with advanced editing features.',
      genre: ['Anime', 'Design', 'Art'],
      about: {
        '@type': 'Thing',
        name: 'Naruto Sharingan',
        description:
          'The Sharingan is a dōjutsu kekkai genkai, which appears in select members of the Uchiha clan.',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
