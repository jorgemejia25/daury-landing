import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  hint?: string;
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

const controlStyle = {
  width: "100%",
  border: "1px solid var(--survey-border-strong)",
  background: "var(--survey-surface)",
  color: "var(--survey-ink)",
  outline: "none",
  font: "inherit",
  fontSize: 15,
  lineHeight: 1.45,
  transition: "border-color 0.25s var(--ease), box-shadow 0.25s var(--ease)",
};

export default function SurveyTextField(props: SurveyTextFieldProps) {
  const { label, hint, multiline } = props;

  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span className="mono" style={{ color: "var(--survey-faint)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </span>
      {multiline ? (
        <TextareaControl {...(props as TextareaProps)} />
      ) : (
        <InputControl {...(props as InputProps)} />
      )}
      {hint && <span style={{ color: "var(--survey-faint)", fontSize: 13, lineHeight: 1.4 }}>{hint}</span>}
    </label>
  );
}

function TextareaControl(props: TextareaProps) {
  const textareaProps: Partial<TextareaProps> = { ...props };
  const style = textareaProps.style;
  delete textareaProps.label;
  delete textareaProps.hint;
  delete textareaProps.multiline;
  delete textareaProps.style;

  return (
    <textarea
      {...(textareaProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      style={{
        ...controlStyle,
        minHeight: 112,
        padding: "14px 16px",
        borderRadius: 18,
        resize: "vertical",
        ...style,
      }}
    />
  );
}

function InputControl(props: InputProps) {
  const inputProps: Partial<InputProps> = { ...props };
  const style = inputProps.style;
  delete inputProps.label;
  delete inputProps.hint;
  delete inputProps.multiline;
  delete inputProps.style;

  return (
    <input
      {...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
      style={{
        ...controlStyle,
        minHeight: 50,
        padding: "12px 16px",
        borderRadius: 999,
        ...style,
      }}
    />
  );
}
