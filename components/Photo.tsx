import React from 'react';
import Image from 'next/image';

/**
 * Site photography.
 *
 * All files are served from /public/images rather than a stock-photo CDN, so
 * the marketing pages have no third-party image dependency. Sourced from Pexels
 * (Pexels License: free for commercial use, no attribution required) and each
 * one checked to confirm it shows what it claims to and carries no identifiable
 * third-party branding — a real hospital's signage on our own marketing page
 * would imply a customer relationship we do not have.
 */

export type PhotoVariant =
  | 'hero'
  | 'dental'
  | 'surgical'
  | 'specialty'
  | 'enterprise'
  | 'team'
  | 'integration'
  | 'analysis'
  | 'outreach'
  | 'recovered'
  | 'security'
  | 'dashboard'
  | 'practice'
  | 'cs-documentation'
  | 'cs-frequency'
  | 'cs-cob'
  | 'cs-timely'
  | 'dental-detail'
  | 'surgical-detail'
  | 'specialty-detail'
  | 'enterprise-detail';

const ALT: Record<PhotoVariant, string> = {
  hero: 'Dental clinicians reviewing patient information on a tablet in a modern practice',
  dental: 'Dentist and assistant treating a patient in a modern dental clinic',
  surgical: 'Sterile operating room equipped for surgery',
  specialty: 'Physician reviewing health documentation with a patient at a desk',
  enterprise: 'Exterior of a modern multi-storey hospital building',
  team: 'Clinical staff in scrubs at a practice reception area',
  integration: 'Hands sorting through printed invoices on a desk',
  analysis: 'Laptop screen showing revenue analytics and charts',
  outreach: 'Practice staff reviewing documents at a clinic reception desk',
  recovered: 'Hands reviewing financial reports and calculating figures',
  security: 'Organised office desk with laptop and payment terminal',
  dashboard: 'Laptop displaying financial graphs beside printed reports',
  practice: 'Interior of a modern dental practice treatment room',
  'cs-documentation': 'Gloved hands holding a tablet showing a panoramic dental radiograph',
  'cs-frequency': 'Dental chair and equipment in a bright treatment room',
  'cs-cob': 'Billing paperwork marked paid and due beside a calculator',
  'cs-timely': 'Aged claim paperwork being sorted with a calculator and laptop',
  'dental-detail': 'Modern dental office with instruments and equipment laid out',
  'surgical-detail': 'Surgical team operating in a bright sterile theatre',
  'specialty-detail': 'Two clinicians in scrubs discussing patient notes in a corridor',
  'enterprise-detail': 'Healthcare staff walking through a modern medical facility',
};

export function Photo({
  variant,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  variant: PhotoVariant;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={`/images/${variant}.jpg`}
      alt={ALT[variant]}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}
