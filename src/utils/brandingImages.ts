/// <reference types="vite/client" />

import heroCareerGraduatesUrl from "../assets/images/hero_career_graduates_1794910021124.jpg";
import trackGovtCivilServicesUrl from "../assets/images/track_govt_civil_services_1794910022761.jpg";
import trackItCloudAiLabUrl from "../assets/images/track_it_cloud_ai_lab_1794910024883.jpg";
import trackBankingFinanceHubUrl from "../assets/images/track_banking_finance_hub_1794910026082.jpg";
import hybridClassroomMentorshipUrl from "../assets/images/hybrid_classroom_mentorship_1794910028151.jpg";
import campusPlacementMegadriveUrl from "../assets/images/campus_placement_megadrive_1794927483546.jpg";
import aiInterviewCoachingStudioUrl from "../assets/images/ai_interview_coaching_studio_1794927483943.jpg";
import coreEngineeringPsuRailwayUrl from "../assets/images/core_engineering_psu_railway_1794927485128.jpg";
import cybersecurityCloudCommandUrl from "../assets/images/cybersecurity_cloud_command_1794927488158.jpg";
import universityMouPartnershipUrl from "../assets/images/university_mou_partnership_1794927487846.jpg";

import panIndiaNetworkGlassUrl from "../assets/images/pan_india_network_glass_1795317316507.jpg";
import genaiNeuralPrismUrl from "../assets/images/genai_neural_prism_1795317314397.jpg";
import arohiVoiceAuroraUrl from "../assets/images/arohi_voice_aurora_1795317312905.jpg";
import remoteTechEditorialUrl from "../assets/images/remote_tech_editorial_1795317315514.jpg";
import placementOfferMilestoneUrl from "../assets/images/placement_offer_milestone_1795317317176.jpg";

export const BRANDING_IMAGES = {
  heroCareerGraduates: heroCareerGraduatesUrl || "/src/assets/images/hero_career_graduates_1794910021124.jpg",
  trackGovtCivilServices: trackGovtCivilServicesUrl || "/src/assets/images/track_govt_civil_services_1794910022761.jpg",
  trackItCloudAiLab: trackItCloudAiLabUrl || "/src/assets/images/track_it_cloud_ai_lab_1794910024883.jpg",
  trackBankingFinanceHub: trackBankingFinanceHubUrl || "/src/assets/images/track_banking_finance_hub_1794910026082.jpg",
  hybridClassroomMentorship: hybridClassroomMentorshipUrl || "/src/assets/images/hybrid_classroom_mentorship_1794910028151.jpg",
  campusPlacementMegadrive: campusPlacementMegadriveUrl || "/src/assets/images/campus_placement_megadrive_1794927483546.jpg",
  aiInterviewCoachingStudio: aiInterviewCoachingStudioUrl || "/src/assets/images/ai_interview_coaching_studio_1794927483943.jpg",
  coreEngineeringPsuRailway: coreEngineeringPsuRailwayUrl || "/src/assets/images/core_engineering_psu_railway_1794927485128.jpg",
  cybersecurityCloudCommand: cybersecurityCloudCommandUrl || "/src/assets/images/cybersecurity_cloud_command_1794927488158.jpg",
  universityMouPartnership: universityMouPartnershipUrl || "/src/assets/images/university_mou_partnership_1794927487846.jpg",
  panIndiaNetworkGlass: panIndiaNetworkGlassUrl || "/src/assets/images/pan_india_network_glass_1795317316507.jpg",
  genaiNeuralPrism: genaiNeuralPrismUrl || "/src/assets/images/genai_neural_prism_1795317314397.jpg",
  arohiVoiceAurora: arohiVoiceAuroraUrl || "/src/assets/images/arohi_voice_aurora_1795317312905.jpg",
  remoteTechEditorial: remoteTechEditorialUrl || "/src/assets/images/remote_tech_editorial_1795317315514.jpg",
  placementOfferMilestone: placementOfferMilestoneUrl || "/src/assets/images/placement_offer_milestone_1795317317176.jpg",
} as const;

export function getProgramCoverImage(iconType: string): string {
  switch (iconType) {
    case "ai":
      return BRANDING_IMAGES.trackItCloudAiLab;
    case "genai":
      return BRANDING_IMAGES.genaiNeuralPrism;
    case "cyber":
      return BRANDING_IMAGES.cybersecurityCloudCommand;
    case "cloud":
      return BRANDING_IMAGES.panIndiaNetworkGlass;
    case "bigdata":
      return BRANDING_IMAGES.arohiVoiceAurora;
    case "marketing":
      return BRANDING_IMAGES.remoteTechEditorial;
    case "finance":
      return BRANDING_IMAGES.trackBankingFinanceHub;
    case "bizds":
      return BRANDING_IMAGES.placementOfferMilestone;
    case "certds":
      return BRANDING_IMAGES.hybridClassroomMentorship;
    case "engds":
      return BRANDING_IMAGES.coreEngineeringPsuRailway;
    default:
      return BRANDING_IMAGES.genaiNeuralPrism;
  }
}
