import type { SurveyChoice } from "@/lib/care-survey";
import SurveyOption from "../atoms/SurveyOption";

type SurveyChoiceGroupProps = {
  options: SurveyChoice[];
  value?: string;
  values?: string[];
  multiple?: boolean;
  onChange: (value: string | string[]) => void;
};

export default function SurveyChoiceGroup({
  options,
  value = "",
  values = [],
  multiple = false,
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

    onChange([...values, nextValue]);
  };

  return (
    <div className="grid gap-2.5">
      {options.map((option) => {
        const selected = multiple ? values.includes(option.value) : value === option.value;

        return (
          <SurveyOption
            key={option.value}
            selected={selected}
            onClick={() => selectValue(option.value)}
          >
            {option.label}
          </SurveyOption>
        );
      })}
    </div>
  );
}
