// Template configuration types

export const createDefaultTemplate = () => ({
  id: crypto.randomUUID(),
  name: 'New Template',
  description: '',
  created: new Date(),
  modified: new Date(),
  data: {
    site: {
      title: 'My Landing Page',
      favicon: '/assets/favicon.ico',
      logoUrl: '/assets/logo.svg',
      headerElements: '<!-- GA / Pixel Scripts -->'
    },
    branding: {
      primaryColor: '#3b82f6',
      primaryColorHover: '#2563eb',
      secondaryColor: '#f59e0b',
      bgColor: '#f9fafb',
      sectionBgAlt: '#f3f4f6',
      textColor: '#1f2937',
      footerBgColor: '#f59e0b',
      footerTextColor: '#ffffff'
    },
    hero: {
      headline: 'Your Amazing Product',
      subheadline: 'Transform your business with our innovative solution.',
      ctaText: 'Get Started',
      ctaLink: '#apply',
      note: 'No credit card required.',
      heroImage: '/assets/hero-image.png'
    },
    featuresSection: {
      title: 'Features'
    },
    features: [
      {
        title: 'Feature One',
        description: 'Amazing feature description.',
        icon: '/assets/icons/feature1.svg'
      },
      {
        title: 'Feature Two',
        description: 'Another great feature.',
        icon: '/assets/icons/feature2.svg'
      }
    ],
    howItWorksSection: {
      title: 'How It Works'
    },
    howItWorks: [
      'Step one description',
      'Step two description',
      'Step three description'
    ],
    offer: {
      headline: 'Special Offer',
      description: 'Limited time offer for early adopters.',
      ctaText: 'Claim Offer',
      ctaLink: '#apply'
    },
    faq: [
      {
        q: 'What is this product?',
        a: 'This is an amazing product that solves your problems.'
      },
      {
        q: 'How much does it cost?',
        a: 'Pricing starts at $99/month.'
      }
    ],
    socialLinks: {
      twitter: 'https://twitter.com/yourcompany',
      linkedin: 'https://linkedin.com/company/yourcompany',
      facebook: 'https://facebook.com/yourcompany',
      whatsapp: 'https://wa.me/1234567890',
      pinterest: 'https://pinterest.com/yourcompany',
      instagram: 'https://instagram.com/yourcompany',
      tiktok: 'https://tiktok.com/@yourcompany',
      mastodon: 'https://mastodon.social/@yourcompany',
      bluesky: 'https://bsky.app/profile/yourcompany.bsky.social'
    },
    footer: {
      copyright: '© 2025 Your Company. All rights reserved.'
    }
  },
  assets: []
});

export const validateTemplate = (template) => {
  const errors = [];
  
  if (!template.data.site.title) {
    errors.push('Site title is required');
  }
  
  if (!template.data.hero.headline) {
    errors.push('Hero headline is required');
  }
  
  if (!template.data.hero.subheadline) {
    errors.push('Hero subheadline is required');
  }
  
  if (template.data.features.length === 0) {
    errors.push('At least one feature is required');
  }
  
  return errors;
};

export const TAILWIND_COLORS = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose'
];

export const TAILWIND_SHADES = [
  '50', '100', '200', '300', '400', '500',
  '600', '700', '800', '900', '950'
];

export const FONT_FAMILIES = [
  'font-sans', 'font-serif', 'font-mono'
];

export const TEXT_SIZES = [
  'text-xs', 'text-sm', 'text-base', 'text-lg',
  'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
  'text-5xl', 'text-6xl'
];

