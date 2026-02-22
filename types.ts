
import React from 'react';

export interface QualificationResult {
  isQualified: boolean;
  type: string;
  reason: string;
  recommendations: string[];
}

export interface ScheduleItem {
  event: string;
  date: string;
  isCompleted?: boolean;
}

export interface UnitType {
  name: string;
  area: string;
  totalUnits: number;
}

/**
 * Augment the global JSX namespace to include 'iconify-icon' for custom elements.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        icon?: string;
        width?: string | number;
        height?: string | number;
        flip?: string;
        rotate?: string | number;
        mode?: string;
        class?: string;
        className?: string;
      }, HTMLElement>;
    }
  }
}

/**
 * Modern React JSX Recognition
 */
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        icon?: string;
        width?: string | number;
        height?: string | number;
        flip?: string;
        rotate?: string | number;
        mode?: string;
        class?: string;
        className?: string;
      }, HTMLElement>;
    }
  }
}

export {};
