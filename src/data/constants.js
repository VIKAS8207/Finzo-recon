export const BANKS = [
  ['HDFC Bank', 'HD'],
  ['ICICI Bank', 'IC'],
  ['State Bank of India', 'SB'],
  ['Axis Bank', 'AX'],
  ['Kotak Mahindra Bank', 'KM'],
  ['IDFC FIRST Bank', 'IF'],
  ['Yes Bank', 'YB'],
  ['Bank of Baroda', 'BB'],
  ['Punjab National Bank', 'PN'],
  ['Canara Bank', 'CB'],
  ['Standard Chartered', 'SC'],
  ['IndusInd Bank', 'II'],
  ['Federal Bank', 'FB'],
  ['Union Bank of India', 'UB'],
]

export const ENTITIES = [
  'Finzo Holdings Pvt Ltd',
  'Finzo Retail India',
  'Finzo Logistics',
  'Finzo Manufacturing',
  'Finzo Services LLP',
  'Finzo Exports',
]

export const TYPES = ['Current', 'Collection', 'Payroll', 'Operating', 'Escrow', 'Overdraft', 'Savings']

export const PURPOSE = [
  'Vendor payments',
  'Customer receipts',
  'Payroll',
  'Tax and GST',
  'Petty cash float',
  'Capex',
  'Treasury sweep',
  'Marketplace payouts',
]

export const VENDORS = [
  'Sharma Steels',
  'Patel Logistics',
  'Mehta Packaging',
  'Iyer Textiles',
  'Bose Chemicals',
  'Kapoor Foods',
  'Reddy Polymers',
  'Gupta Electricals',
]

export const CUSTOMERS = [
  'Apex Retail',
  'Nova Traders',
  'Zenith Stores',
  'Urban Mart',
  'Lakshmi Agencies',
  'Orbit Distributors',
]

export const STATUS = {
  reconciled: 'Reconciled',
  progress: 'In progress',
  notstarted: 'Not started',
  discrepancy: 'Discrepancy',
}

export const STATUS_KEYS = Object.keys(STATUS)

// Tailwind background class for each reconciliation state (bars, legends)
export const STATUS_BG = {
  reconciled: 'bg-emerald-500',
  progress: 'bg-violet-600',
  notstarted: 'bg-neutral-300',
  discrepancy: 'bg-rose-500',
}

export const RULE_ACCOUNTS = [
  'Bank charges',
  'GST on bank charges',
  'Interest income',
  'Salary',
  'Customer receipt',
  'Vendor payment',
  'Other expense',
]

export const PAGE_SIZE = 24

export const SAMPLE_STATEMENT = `Date,Narration,Ref No,Withdrawal Amt,Deposit Amt,Closing Balance
02/11/2026,NEFT DR SHARMA STEELS,NEFT24110211,125000.00,,2468000.00
02/11/2026,BANK CHARGES NEFT/RTGS,CHG0211,354.00,,2467646.00
03/11/2026,RTGS CR APEX RETAIL,RTGS24110388,,310500.00,2778146.00
04/11/2026,NEFT DR PATEL LOGISTICS,NEFT24110412,88250.00,,2689896.00
05/11/2026,INTEREST CREDIT,INT1105,,4120.00,2694016.00
06/11/2026,RTGS CR NOVA TRADERS,RTGS24110609,,157000.00,2851016.00
07/11/2026,NEFT DR MEHTA PACKAGING,NEFT24110733,64100.00,,2786916.00
09/11/2026,STANDING INSTRUCTION DEBIT,SI0911,12500.00,,2774416.00`

// Statement import: our field -> header keywords used to guess the column
export const IMPORT_FIELDS = [
  ['date', 'Date', ['date']],
  ['desc', 'Description', ['narr', 'desc', 'particular']],
  ['ref', 'Reference', ['ref', 'chq', 'utr']],
  ['out', 'Withdrawal', ['withdraw', 'debit', 'dr amt']],
  ['in', 'Deposit', ['deposit', 'credit', 'cr amt']],
  ['bal', 'Balance', ['balance']],
]
