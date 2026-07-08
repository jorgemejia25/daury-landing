import SurveyButton from "../atoms/SurveyButton";

type SurveyNavigationProps = {
  canGoBack: boolean;
  isLastStep: boolean;
  loading: boolean;
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
};

export default function SurveyNavigation({
  canGoBack,
  isLastStep,
  loading,
  nextLabel,
  onBack,
  onNext,
}: SurveyNavigationProps) {
  return (
    <div className="flex justify-between gap-3.5 flex-wrap">
      <SurveyButton variant="ghost" onClick={onBack} disabled={!canGoBack || loading}>
        Atrás
      </SurveyButton>
      <SurveyButton onClick={onNext} disabled={loading}>
        {loading ? "Enviando..." : nextLabel ?? (isLastStep ? "Enviar respuestas" : "Continuar")}
        <svg className="arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </SurveyButton>
    </div>
  );
}