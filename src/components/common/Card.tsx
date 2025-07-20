import React from 'react';
import './Card.css';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardSize = 'small' | 'medium' | 'large';

export interface CardProps {
  variant?: CardVariant;
  size?: CardSize;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
  isDisabled?: boolean;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  className = '',
  onClick,
  isClickable = false,
  isDisabled = false,
}) => {
  const baseClass = 'card';
  const variantClass = `card--${variant}`;
  const sizeClass = `card--${size}`;
  const clickableClass = (isClickable || onClick) ? 'card--clickable' : '';
  const disabledClass = isDisabled ? 'card--disabled' : '';

  const combinedClassName = [
    baseClass,
    variantClass,
    sizeClass,
    clickableClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!isDisabled && (onClick || isClickable)) {
      onClick?.();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={combinedClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable || onClick ? 0 : undefined}
      role={isClickable || onClick ? 'button' : undefined}
      aria-disabled={isDisabled}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`card__header ${className}`}>
      {children}
    </div>
  );
};

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`card__body ${className}`}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`card__footer ${className}`}>
      {children}
    </div>
  );
};

export { CardHeader, CardBody, CardFooter };
export default Card; 