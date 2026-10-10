import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  hoverable?: boolean;
}

export function Card({ padded = true, hoverable, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'surface',
        padded && 'p-5 sm:p-6',
        hoverable && 'transition-shadow hover:shadow-card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-3 flex items-start justify-between gap-3', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-ink-900', className)} {...rest}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mt-1 text-sm text-muted', className)} {...rest}>
      {children}
    </p>
  );
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 flex flex-wrap items-center gap-2', className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-5', className)}>
      {eyebrow ? (
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
    </div>
  );
}
