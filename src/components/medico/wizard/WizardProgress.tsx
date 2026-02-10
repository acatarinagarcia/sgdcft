import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardStep } from './types';

interface WizardProgressProps {
  currentStep: WizardStep;
  labels: string[];
}

export function WizardProgress({ currentStep, labels }: WizardProgressProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {labels.map((label, i) => {
          const stepNum = (i + 1) as WizardStep;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all border-2',
                    isCompleted && 'bg-primary text-primary-foreground border-primary',
                    isCurrent && 'border-primary text-primary bg-primary/10',
                    !isCompleted && !isCurrent && 'border-border text-muted-foreground bg-background'
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center max-w-[100px]',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-3 mt-[-20px]',
                    isCompleted ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
