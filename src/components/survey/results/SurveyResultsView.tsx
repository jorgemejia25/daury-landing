"use client";

import SurveyResultsDashboard from "./SurveyResultsDashboard";
import SurveyResultsGate from "./SurveyResultsGate";

export default function SurveyResultsView() {
  return (
    <SurveyResultsGate>
      {({ records, onReset }) => (
        <SurveyResultsDashboard records={records} onReset={onReset} />
      )}
    </SurveyResultsGate>
  );
}