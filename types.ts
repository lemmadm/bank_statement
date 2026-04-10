export interface Transaction {
  id: string;
  date: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number | null;
  category: string;
}

export interface FilterState {
    startDate: string;
    endDate: string;
    description: string;
    minDebit: string;
    maxDebit: string;
    minCredit: string;
    maxCredit: string;
    category: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    key: keyof Transaction;
    direction: SortDirection;
}
