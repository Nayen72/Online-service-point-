
import { GoogleGenAI, Type } from "@google/genai";
import { Blueprint, StoreDesign, ProductCopy } from "./types";

// Always use the named parameter and process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const BLUEPRINT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mustHavePages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["title", "description"],
      },
    },
    siteMap: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        children: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              children: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING } }
                }
              },
            },
          },
        },
      },
    },
    platformAnalysis: {
      type: Type.OBJECT,
      properties: {
        recommendation: { type: Type.STRING },
        reasoning: { type: Type.STRING },
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["recommendation", "reasoning", "pros", "cons"],
    },
    essentialFeatures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"],
      },
    },
  },
  required: ["mustHavePages", "siteMap", "platformAnalysis", "essentialFeatures"],
};

const DESIGN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    colors: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "Hex code for primary color" },
        secondary: { type: Type.STRING, description: "Hex code for secondary color" },
        accent: { type: Type.STRING, description: "Hex code for accent color" },
        background: { type: Type.STRING, description: "Hex code for background" },
        text: { type: Type.STRING, description: "Hex code for main text" },
      },
      required: ["primary", "secondary", "accent", "background", "text"],
    },
    navigation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          href: { type: Type.STRING },
          children: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["label", "items"]
            }
          }
        },
        required: ["label", "href"]
      }
    },
    fonts: {
      type: Type.OBJECT,
      properties: {
        heading: { type: Type.STRING },
        body: { type: Type.STRING },
      },
      required: ["heading", "body"],
    },
    hero: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        ctaText: { type: Type.STRING },
      },
      required: ["title", "subtitle", "ctaText"],
    },
    bestSellers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          price: { type: Type.STRING },
          category: { type: Type.STRING, description: "Category like Audio, Power, or Connectivity" },
          isOutOfStock: { type: Type.BOOLEAN, description: "True if the product is out of stock" },
          imageDescriptions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "An array of 2-3 detailed descriptions of product images (angles, features) for a carousel." 
          },
        },
        required: ["name", "price", "category", "imageDescriptions"],
      },
    },
    testimonials: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          comment: { type: Type.STRING },
          rating: { type: Type.NUMBER },
        },
        required: ["name", "comment", "rating"],
      },
    },
    extraSections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          type: { type: Type.STRING, description: "One of: checker, guide, info, cta" },
          items: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "content", "type"]
      }
    }
  },
  required: ["colors", "fonts", "hero", "bestSellers", "testimonials"],
};

const COPY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    hook: { type: Type.STRING, description: "Catchy opening line" },
    benefits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING, description: "Focus on benefits, not just features" }
        },
        required: ["title", "description"]
      }
    },
    technicalSpecs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "e.g., MacBook Pro Charge Time" },
          value: { type: Type.STRING, description: "e.g., 0-50% in 30 mins" }
        },
        required: ["label", "value"]
      }
    },
    cta: { type: Type.STRING, description: "Strong call to action" },
    fullDraft: { type: Type.STRING, description: "The complete formatted description" }
  },
  required: ["hook", "benefits", "cta", "fullDraft"]
};

export async function generateBlueprint(product: string, budget: string): Promise<Blueprint> {
  const prompt = `Create a comprehensive e-commerce website blueprint for a business selling "${product}". 
  The target budget is "${budget}". 
  Provide:
  1. A list of must-have pages (Home, Shop, About, etc.) with brief descriptions.
  2. A hierarchical site map structure.
  3. A platform recommendation (Shopify vs WooCommerce) tailored to the "${budget}" budget.
  4. 5 essential features or plugins for payments, shipping, and core functionality.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: BLUEPRINT_SCHEMA,
    },
  });

  return {
    ...JSON.parse(response.text),
    productName: product,
    budget: budget as 'small' | 'large',
  };
}

export async function generateDesign(businessName: string, style: string, palette: string, requirements?: string): Promise<StoreDesign> {
  const prompt = `Design a modern, high-conversion e-commerce store for "${businessName}". 
  Style requested: "${style}". 
  Color palette requested: "${palette}".
  Additional Requirements: "${requirements || 'None'}".
  
  IMPORTANT: Organize the navigation menu as follows:
  - Audio: Earbuds (ANC, Sports, Budget), Over-ear Headphones.
  - Power: Power Banks (Laptop-ready, Slim, Wireless), Wall Chargers (Single vs. Multi-port).
  - Connectivity: USB-C Cables, Lightning, HDMI Adapters.
  - Collections: 'Travel Essentials,' 'Gaming Audio,' and 'Office Setup.'
  
  Please ensure each item in 'bestSellers' is assigned a 'category' matching one of the main categories (Audio, Power, Connectivity).
  Also provide multiple image descriptions (2-3) per product for a mockup carousel.
  Mark at least one item as isOutOfStock: true for variety.
  
  Please provide:
  1. Specific hex codes for dark or light modes as requested.
  2. Font suggestions.
  3. Hero copy.
  4. At least 3 Best seller products relevant to the business across different categories.
  5. 3 Testimonials.
  6. Extra sections if requested (like checkers, guides, or speed charts).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: DESIGN_SCHEMA,
    },
  });

  return {
    ...JSON.parse(response.text),
    businessName,
    style,
  };
}

export async function generateCopy(product: string, audience: string, features: string, tone: string, requirements?: string): Promise<ProductCopy> {
  const prompt = `Write a persuasive e-commerce product description for "${product}".
  Target Audience: "${audience}".
  Key Features/Specs: "${features}".
  Tone: "${tone}".
  Special Instructions/Hook Focus: "${requirements || 'Focus on value and quality.'}".
  
  Structure:
  1. Catchy hook focusing on core problem/solution based on the hook focus.
  2. Bulleted list of benefits (NOT just features).
  3. A structured technical table (technicalSpecs) including specific details mentioned in features like charging times, safety features (Overheat Protection, Smart Chip), or dimensions.
  4. Strong Call to Action.
  
  Safety Mention: Ensure safety features like Overheat Protection and Smart Chips are highlighted.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: COPY_SCHEMA,
    },
  });

  return {
    ...JSON.parse(response.text),
    productName: product
  };
}
