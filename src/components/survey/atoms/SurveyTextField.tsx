import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  hint?: ReactNode;
};

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

type SurveyTextFieldProps = InputProps | TextareaProps;

const controlClasses =
  "w-full border border-[var(--survey-border-strong)] bg-[var(--survey-surface)] text-[var(--survey-ink)] outline-none font-[inherit] text-[15px] leading-[1.45] transition-[border-color,box-shadow] duration-300 ease-[var(--ease)]";

export default function SurveyTextField(props: SurveyTextFieldProps) {
  const { label, hint, multiline } = props;

  return (
    <label className="grid gap-2">
      <span className="mono text-[var(--survey-faint)] text-[11px] tracking-[0.12em] uppercase">
        {label}
      </span>
      {multiline ? (
        <TextareaControl {...(props as TextareaProps)} />
      ) : (
        <InputControl {...(props as InputProps)} />
      )}
      {hint && <span className="text-[var(--survey-faint)] text-[13px] leading-[1.4]">{hint}</span>}
    </label>
  );
}

function TextareaControl(props: TextareaProps) {
  const textareaProps: Partial<TextareaProps> = { ...props };
  delete textareaProps.label;
  delete textareaProps.hint;
  delete textareaProps.multiline;

  return (
    <textarea
      {...(textareaProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      className={`${controlClasses} min-h-[112px] px-3.5 py-3.5 rounded-[18px] resize-y`}
    />
  );
}

function InputControl(props: InputProps) {
  const inputProps: Partial<InputProps> = { ...props };
  delete inputProps.label;
  delete inputProps.hint;
  delete inputProps.multiline;

  return (
    <input
      {...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
      className={`${controlClasses} min-h-[50px] px-4 py-3 rounded-full`}
    />
  );
}