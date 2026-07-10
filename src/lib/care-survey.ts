export type SurveyChoice = {
  value: string;
  label: string;
};

export type CareSurveyPayload = {
  locale: string;
  hasManagedCare: "yes" | "no" | "";
  careTarget: string;
  caredPersonAge: string;
  familyCaregivers: string;
  coordinationFrequency: string;
  organizationMethod: string;
  organizationOther: string;
  organizationAppName: string;
  careChallenges: string[];
  careChallengesOther: string;
  priorCareAppUse: "yes" | "no" | "";
  priorCareAppName: string;
  hadIncident: "yes" | "no" | "";
  incidentStory: string;
  currentlyPaysCare: "yes" | "no" | "";
  paidCareDetails: string;
  carePayer: string;
  appTrust: "yes" | "no" | "maybe" | "";
  trustConcerns: string[];
  trustConcernsOther: string;
  appInterest: "yes" | "no" | "maybe" | "";
  interestNoReason: string;
  interestRequirements: string[];
  interestRequirementOther: string;
  whatsappPreference: string;
  essentialFeatures: string[];
  essentialFeaturesOther: string;
  discoveryChannel: string;
  discoveryOther: string;
  conditionDuration: string;
  priceTooExpensive: string;
  priceExpensiveButPay: string;
  priceBargain: string;
  priceTooCheap: string;
  closingExperience: string;
  completedPath: string[];
};

export const careTargetOptions: SurveyChoice[] = [
  { value: "personal", label: "Es mi cuidado personal" },
  { value: "third_party", label: "Cuidé a otra persona" },
];

export const caredPersonAgeOptions: SurveyChoice[] = [
  { value: "under_18", label: "Menos de 18" },
  { value: "18_40", label: "18 a 40" },
  { value: "41_60", label: "41 a 60" },
  { value: "61_plus", label: "61 o más" },
];

export const familyCaregiverOptions: SurveyChoice[] = [
  { value: "only_me", label: "Solo yo" },
  { value: "2_3", label: "2 a 3 personas" },
  { value: "4_plus", label: "4 personas o más" },
];

export const coordinationFrequencyOptions: SurveyChoice[] = [
  { value: "daily", label: "A diario" },
  { value: "several_times_week", label: "Varias veces por semana" },
  { value: "weekly", label: "Una vez por semana" },
  { value: "occasional", label: "De forma ocasional" },
];

export const organizationMethodOptions: SurveyChoice[] = [
  { value: "paper", label: "Papel/agenda física" },
  { value: "whatsapp", label: "Grupo de WhatsApp familiar" },
  { value: "memory", label: "Memoria (nada por escrito)" },
  { value: "app", label: "Ya uso una app" },
  { value: "other", label: "Otro" },
];

export const careChallengeOptions: SurveyChoice[] = [
  { value: "medication_schedules", label: "Recordar horarios de medicamentos" },
  { value: "medical_appointments", label: "Coordinar citas médicas" },
  { value: "doctor_instructions", label: "Entender las instrucciones del médico" },
  { value: "family_sharing", label: "Compartir información con otros familiares que también cuidan" },
  { value: "lack_of_time", label: "Falta de tiempo" },
  { value: "care_costs", label: "Costos del cuidado" },
  { value: "other", label: "Otro" },
];

export const carePayerOptions: SurveyChoice[] = [
  { value: "myself", label: "Yo mismo/a" },
  { value: "family_guatemala", label: "Otro familiar en Guatemala" },
  { value: "family_abroad", label: "Familiar en el extranjero" },
  { value: "shared", label: "Se dividiría entre varios" },
  { value: "not_sure", label: "No sabría decir" },
];

export const trustConcernOptions: SurveyChoice[] = [
  { value: "traditional_preference", label: "Prefiero el papel/lo tradicional" },
  { value: "medical_data_privacy", label: "Me preocupa la privacidad de los datos médicos" },
  { value: "offline_reliability", label: "No confío en que funcione sin internet" },
  { value: "internet_stability", label: "No tengo/no confío en tener internet estable" },
  { value: "delicate_information", label: "Es información muy delicada para depender de una app" },
  { value: "constant_use", label: "No sé si la usaría de forma constante" },
  { value: "other", label: "Otro" },
];

export const interestRequirementOptions: SurveyChoice[] = [
  { value: "offline", label: "Que funcione sin necesidad de internet" },
  { value: "privacy_guarantees", label: "Garantías claras de privacidad de los datos médicos" },
  { value: "family_onboarding", label: "Que alguien de la familia me ayude a usarla al inicio" },
  { value: "known_reference", label: "Verla funcionando con alguien que conozco (referencia o testimonio)" },
  { value: "low_cost", label: "Que fuera gratis o muy económica al inicio" },
  { value: "easy_to_use", label: "Que sea fácil de usar" },
  { value: "other", label: "Otro" },
];

export const whatsappPreferenceOptions: SurveyChoice[] = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
  { value: "prefer_app", label: "Prefiero una app aparte" },
];

export const essentialFeatureOptions: SurveyChoice[] = [
  { value: "medication_reminders", label: "Recordatorios de medicamentos" },
  { value: "medical_calendar", label: "Calendario de citas médicas" },
  { value: "prescription_history", label: "Registro/historial de recetas" },
  { value: "scan_prescriptions", label: "Escanear recetas con la cámara" },
  { value: "family_sharing", label: "Compartir información con otros familiares" },
  { value: "emergency_contacts", label: "Contactos de emergencia" },
  { value: "doctor_reports", label: "Reportes para el médico" },
  { value: "other", label: "Otro" },
];

export const discoveryChannelOptions: SurveyChoice[] = [
  { value: "social_media", label: "Redes sociales" },
  { value: "doctor_clinic", label: "Recomendación del médico o clínica" },
  { value: "family_friend", label: "Recomendación de un familiar o amigo" },
  { value: "pharmacy", label: "Farmacia" },
  { value: "other", label: "Otro" },
];

export const conditionDurationOptions: SurveyChoice[] = [
  { value: "temporary", label: "Temporal" },
  { value: "long_term", label: "Largo plazo / crónico" },
  { value: "not_sure", label: "No estoy seguro/a" },
];

export const yesNoOptions: SurveyChoice[] = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
];

export const trustOptions: SurveyChoice[] = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
  { value: "maybe", label: "Tal vez" },
];

export const interestOptions = trustOptions;

export const emptyCareSurveyPayload: CareSurveyPayload = {
  locale: "es",
  hasManagedCare: "",
  careTarget: "",
  caredPersonAge: "",
  familyCaregivers: "",
  coordinationFrequency: "",
  organizationMethod: "",
  organizationOther: "",
  organizationAppName: "",
  careChallenges: [],
  careChallengesOther: "",
  priorCareAppUse: "",
  priorCareAppName: "",
  hadIncident: "",
  incidentStory: "",
  currentlyPaysCare: "",
  paidCareDetails: "",
  carePayer: "",
  appTrust: "",
  trustConcerns: [],
  trustConcernsOther: "",
  appInterest: "",
  interestNoReason: "",
  interestRequirements: [],
  interestRequirementOther: "",
  whatsappPreference: "",
  essentialFeatures: [],
  essentialFeaturesOther: "",
  discoveryChannel: "",
  discoveryOther: "",
  conditionDuration: "",
  priceTooExpensive: "",
  priceExpensiveButPay: "",
  priceBargain: "",
  priceTooCheap: "",
  closingExperience: "",
  completedPath: [],
};
