import React, { forwardRef } from 'react';
import './Input.css';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'url';
export type InputSize = 'small' | 'medium' | 'large';
export type InputState = 'default' | 'success' | 'error' | 'warning';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  size?: InputSize;
  state?: InputState;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  size = 'medium',
  state = 'default',
  label,
  placeholder,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = state === 'error' || errorText;
  const currentState = hasError ? 'error' : state;

  const baseClass = 'input-wrapper';
  const sizeClass = `input-wrapper--${size}`;
  const stateClass = `input-wrapper--${currentState}`;
  const disabledClass = isDisabled ? 'input-wrapper--disabled' : '';
  const readonlyClass = isReadOnly ? 'input-wrapper--readonly' : '';

  const combinedClassName = [
    baseClass,
    sizeClass,
    stateClass,
    disabledClass,
    readonlyClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {isRequired && <span className="input__required" aria-label="必須">*</span>}
        </label>
      )}
      
      <div className="input__container">
        {leftIcon && (
          <span className="input__icon input__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className="input__field"
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={isRequired}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError && errorText ? `${inputId}-error` :
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <span className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      
      {hasError && errorText && (
        <div id={`${inputId}-error`} className="input__error" role="alert">
          {errorText}
        </div>
      )}
      
      {!hasError && helperText && (
        <div id={`${inputId}-helper`} className="input__helper">
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 