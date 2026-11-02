export type ReferralTone = 'peer' | 'alumni' | 'formal';

export interface ReferralPitchParams {
  company: string;
  role: string;
  recipientName?: string;
  tone?: ReferralTone;
  candidateName?: string;
  skills?: string;
}

export function cleanCompanyName(company: string): string {
  return company
    .replace(/\b(Inc\.?|LLC|Ltd\.?|Corp\.?|Corporation|Technologies|Tech)\b/gi, '')
    .trim();
}

/**
 * Returns a LinkedIn People search URL strictly filtered to 1st-degree connections at the target company
 */
export function getLinkedIn1stDegreeSearchUrl(company: string): string {
  const clean = cleanCompanyName(company);
  const encodedKeywords = encodeURIComponent(clean);
  // network=["F"] restricts to 1st degree connections
  return `https://www.linkedin.com/search/results/people/?keywords=${encodedKeywords}&network=%5B%22F%22%5D`;
}

/**
 * Returns a LinkedIn People search URL filtered to 1st and 2nd-degree connections
 */
export function getLinkedIn2ndDegreeSearchUrl(company: string): string {
  const clean = cleanCompanyName(company);
  const encodedKeywords = encodeURIComponent(clean);
  // network=["F","S"] restricts to 1st and 2nd degree connections
  return `https://www.linkedin.com/search/results/people/?keywords=${encodedKeywords}&network=%5B%22F%22%2C%22S%22%5D`;
}

/**
 * Returns general company people directory on LinkedIn
 */
export function getLinkedInCompanyPeopleUrl(company: string): string {
  const clean = cleanCompanyName(company);
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(clean)}`;
}

/**
 * Direct link to open LinkedIn Messaging inbox
 */
export function getLinkedInMessagingUrl(): string {
  return 'https://www.linkedin.com/messaging/';
}

/**
 * High-signal default templates for LinkedIn referral outreach
 */
export function getDefaultReferralTemplate({
  company,
  role,
  recipientName,
  tone = 'peer',
  candidateName,
  skills,
}: ReferralPitchParams): string {
  const name = recipientName?.trim() || 'there';
  const cleanComp = cleanCompanyName(company);
  const signature = candidateName ? `\n\nBest,\n${candidateName}` : '';
  const skillsMention = skills ? ` My background is in ${skills}.` : '';

  if (tone === 'peer') {
    return (
      `Hi ${name}, hope you are doing well! I saw an opening for ${role} at ${cleanComp} and am very excited about it.${skillsMention} ` +
      `Given your experience there, I would love to get your perspective on the team. Would you be open to submitting an internal referral for me? Happy to share my resume and the job link!` +
      signature
    );
  }

  if (tone === 'alumni') {
    return (
      `Hi ${name}, noticed we share a mutual connection / alumni network! I am currently looking into the ${role} opening at ${cleanComp}.${skillsMention} ` +
      `Your team and work at ${cleanComp} really caught my eye. Would you be comfortable referring me or sharing a few insights on the engineering culture? Appreciate your time!` +
      signature
    );
  }

  // Formal / Professional
  return (
    `Hi ${name}, hope this note finds you well. I am applying for the ${role} position at ${cleanComp}.${skillsMention} ` +
    `I saw that you work at ${cleanComp} and wanted to reach out directly. Would you be open to referring me internally or pointing me to the hiring manager? Thank you for your consideration!` +
    signature
  );
}
