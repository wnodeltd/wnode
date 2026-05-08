export interface AffiliateData {
  address: string | null;
  phone: string | null;
  email: string | null;
  referrer: string | null;
  founderTree: string | null;
}

export const emptyAffiliateData: AffiliateData = {
  address: null,
  phone: null,
  email: null,
  referrer: null,
  founderTree: null,
};
