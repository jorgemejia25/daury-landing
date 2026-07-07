export type SurveyChoice = {
  value: string;
  label: string;
};

export type CareSurveyPayload = {
  locale: string;
  organizationMethod: string;
  organizationOther: string;
  careChallenges: string[];
  careChallengesOther: string;
  hadIncident: "yes" | "no" | "";
  incidentStory: string;
  appTrust: "yes" | "no" | "maybe" | "";
  trustConcerns: string[];
  trustConcernsOther: string;
  appInterest: "yes" | "no" | "maybe" | "";
  interestNoReason: string;
  essentialFeatures: string[];
  essentialFeaturesOther: string;
  priceTooExpensive: string;
  priceExpensiveButPay: string;
  priceBargain: string;
  priceTooCheap: string;
  completedPath: string[];
};

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
  { value: "family_sharing", label: "Compartir información con otros familiares que también cuidan" },
  { value: "lack_of_time", label: "Falta de tiempo" },
  { value: "care_costs", label: "Costos del cuidado" },
  { value: "other", label: "Otro" },
];

export const trustConcernOptions: SurveyChoice[] = [
  { value: "traditional_preference", label: "Prefiero el papel/lo tradicional" },
  { value: "medical_data_privacy", label: "Me preocupa la privacidad de los datos médicos" },
  { value: "offline_reliability", label: "No confío en que funcione sin internet" },
  { value: "delicate_information", label: "Es información muy delicada para depender de una app" },
  { value: "other", label: "Otro" },
];

export const essentialFeatureOptions: SurveyChoice[] = [
  { value: "medication_reminders", label: "Recordatorios de medicamentos" },
  { value: "medical_calendar", label: "Calendario de citas médicas" },
  { value: "prescription_history", label: "Registro/historial de recetas" },
  { value: "family_sharing", label: "Compartir información con otros familiares" },
  { value: "emergency_contacts", label: "Contactos de emergencia" },
  { value: "doctor_reports", label: "Reportes para el médico" },
  { value: "other", label: "Otro" },
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
  organizationMethod: "",
  organizationOther: "",
  careChallenges: [],
  careChallengesOther: "",
  hadIncident: "",
  incidentStory: "",
  appTrust: "",
  trustConcerns: [],
  trustConcernsOther: "",
  appInterest: "",
  interestNoReason: "",
  essentialFeatures: [],
  essentialFeaturesOther: "",
  priceTooExpensive: "",
  priceExpensiveButPay: "",
  priceBargain: "",
  priceTooCheap: "",
  completedPath: [],
};
