import type { SurveyChoice } from "@/lib/care-survey";
import SurveyOption from "../atoms/SurveyOption";

type SurveyChoiceGroupProps = {
  options: SurveyChoice[];
  value?: string;
  values?: string[];
  multiple?: boolean;
  maxSelections?: number;
  onChange: (value: string | string[]) => void;
};

export default function SurveyChoiceGroup({
  options,
  value = "",
  values = [],
  multiple = false,
  maxSelections,
  onChange,
}: SurveyChoiceGroupProps) {
  const selectValue = (nextValue: string) => {
    if (!multiple) {
      onChange(nextValue);
      return;
    }

    const selected = values.includes(nextValue);
    if (selected) {
      onChange(values.filter((currentValue) => currentValue !== nextValue));
      return;
    }

    if (maxSelections && values.length >= maxSelections) {
      return;
    }

    onChange([...values, nextValue]);
  };

  return (
    <div className="grid gap-2.5">
      {options.map((option) => {
        const selected = multiple ? values.includes(option.value) : value === option.value;
        const disabled = Boolean(multiple && maxSelections && values.length >= maxSelections && !selected);

        return (
          <SurveyOption
            key={option.value}
            selected={selected}
            disabled={disabled}
            onClick={() => selectValue(option.value)}
          >
            {option.label}
          </SurveyOption>
        );
      })}
    </div>
  );
}