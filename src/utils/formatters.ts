export function formatBatchName(idOrName?: string): string {
  if (!idOrName) return '';
  const val = idOrName.toLowerCase();
  if (val.includes('2021') || val.includes('centurion')) return '2021';
  if (val.includes('2022') || val.includes('valiant')) return '2022';
  if (val.includes('2023') || val.includes('invincible')) return '2023';
  if (val.includes('2024') || val.includes('titan')) return '2024';
  if (val.includes('2025') || val.includes('igniter') || val.includes('fresher')) return '2025';
  if (val.includes('postgrad') || val.includes('resident') || val.includes('intern')) return 'Residents & Interns';
  return idOrName;
}
