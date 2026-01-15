import { fetchWaterQuality } from './api';
import { AFFILIATE_LINKS } from '../config/affiliates';

export const getWaterData = async (zipCode) => {
  return await fetchWaterQuality(zipCode);
};

export const getRecommendation = (contaminants) => {
  if (!contaminants || contaminants.length === 0) {
    return {
      title: AFFILIATE_LINKS.CARBON_PITCHER.label,
      description: "Great for improving taste and odor.",
      link: AFFILIATE_LINKS.CARBON_PITCHER.url
    };
  }

  // Helper to check if a contaminant is present (handles both strings and objects)
  const hasContaminant = (name) => contaminants.some(c =>
    (typeof c === 'string' ? c : c.name).toUpperCase().includes(name.toUpperCase())
  );

  // Priority 1: PFAS / PFOA / PFOS (Requires RO or specialized Carbon)
  if (hasContaminant("PFAS") || hasContaminant("PFOA") || hasContaminant("PFOS")) {
    return {
      title: AFFILIATE_LINKS.RO_SYSTEM.label,
      description: "PFAS detected. We recommend an NSF/ANSI 58 certified Reverse Osmosis system or NSF/ANSI 53 certified filter.",
      link: AFFILIATE_LINKS.RO_SYSTEM.url
    };
  }

  // Priority 2: Lead (Requires specific certification)
  if (hasContaminant("Lead")) {
    return {
      title: AFFILIATE_LINKS.LEAD_PITCHER.label,
      description: "Lead detected. Ensure your filter is specifically certified to NSF/ANSI 53 for lead reduction.",
      link: AFFILIATE_LINKS.LEAD_PITCHER.url
    };
  }

  // Priority 3: Bacteria / Viruses (Requires UV or specific filters)
  if (hasContaminant("Bacteria") || hasContaminant("Coliform") || hasContaminant("E. Coli")) {
    return {
      title: AFFILIATE_LINKS.UV_FILTER.label,
      description: "Bacteria detected. A UV filter or boiling is recommended to ensure safety.",
      link: AFFILIATE_LINKS.UV_FILTER.url
    };
  }

  // Priority 4: Arsenic / Nitrate (RO is best)
  if (hasContaminant("Arsenic") || hasContaminant("Nitrate")) {
    return {
      title: AFFILIATE_LINKS.RO_SYSTEM.label,
      description: "Reverse Osmosis is the most effective method for removing Arsenic and Nitrates.",
      link: AFFILIATE_LINKS.RO_SYSTEM.url
    };
  }

  // Default: Standard Carbon
  return {
    title: AFFILIATE_LINKS.CARBON_PITCHER.label,
    description: "Effective for Chlorine and general taste improvement.",
    link: AFFILIATE_LINKS.CARBON_PITCHER.url
  };
};
