import React from 'react';
import { useTemplate } from '../../hooks/useTemplateContext';
import { ScrollArea } from '../ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { SiteSection } from './SiteSection';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { OfferSection } from './OfferSection';
import { FAQSection } from './FAQSection';
import { SocialSection } from './SocialSection';
import { FooterSection } from './FooterSection';

export function TemplateEditor() {
  const { state } = useTemplate();
  const { currentTemplate } = state;

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold">Template Editor</h2>
        <p className="text-muted-foreground">
          Configure your landing page content and structure
        </p>
      </div>

      <ScrollArea className="flex-1 p-6">
        <Accordion type="multiple" defaultValue={["site", "hero"]} className="space-y-4">
          <AccordionItem value="site">
            <AccordionTrigger className="text-lg font-medium">
              Site Configuration
            </AccordionTrigger>
            <AccordionContent>
              <SiteSection data={currentTemplate.data.site} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hero">
            <AccordionTrigger className="text-lg font-medium">
              Hero Section
            </AccordionTrigger>
            <AccordionContent>
              <HeroSection data={currentTemplate.data.hero} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="features">
            <AccordionTrigger className="text-lg font-medium">
              Features Section
            </AccordionTrigger>
            <AccordionContent>
              <FeaturesSection 
                data={currentTemplate.data.features} 
                sectionData={currentTemplate.data.featuresSection}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-it-works">
            <AccordionTrigger className="text-lg font-medium">
              How It Works
            </AccordionTrigger>
            <AccordionContent>
              <HowItWorksSection 
                data={currentTemplate.data.howItWorks} 
                sectionData={currentTemplate.data.howItWorksSection}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="offer">
            <AccordionTrigger className="text-lg font-medium">
              Offer Section
            </AccordionTrigger>
            <AccordionContent>
              <OfferSection data={currentTemplate.data.offer} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq">
            <AccordionTrigger className="text-lg font-medium">
              FAQ Section
            </AccordionTrigger>
            <AccordionContent>
              <FAQSection data={currentTemplate.data.faq} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="social">
            <AccordionTrigger className="text-lg font-medium">
              Social Links
            </AccordionTrigger>
            <AccordionContent>
              <SocialSection data={currentTemplate.data.socialLinks} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="footer">
            <AccordionTrigger className="text-lg font-medium">
              Footer
            </AccordionTrigger>
            <AccordionContent>
              <FooterSection data={currentTemplate.data.footer} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}

