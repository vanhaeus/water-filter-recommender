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

  if (contaminants.includes("PFAS")) {
    return {
      title: AFFILIATE_LINKS.RO_SYSTEM.label,
      description: "The gold standard for removing PFAS and other persistent chemicals.",
      link: AFFILIATE_LINKS.RO_SYSTEM.url
    };
  }

  if (contaminants.includes("Bacteria")) {
    return {
      title: AFFILIATE_LINKS.UV_FILTER.label,
      description: "Essential for killing bacteria and viruses.",
      link: AFFILIATE_LINKS.UV_FILTER.url
    };
  }

  if (contaminants.includes("Lead")) {
    return {
      title: AFFILIATE_LINKS.LEAD_PITCHER.label,
      description: "Specifically certified to remove lead.",
      link: AFFILIATE_LINKS.LEAD_PITCHER.url
    };
  }

  return {
    title: AFFILIATE_LINKS.CARBON_PITCHER.label,
    description: "Effective for Chlorine and general taste improvement.",
    link: AFFILIATE_LINKS.CARBON_PITCHER.url
  };
};
