'use client'; 

export function downloadCsv(selectedIds: (string | number)[]): void {
  if (selectedIds.length === 0) return;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  
  const idsParam = selectedIds.join(',');

  const downloadUrl = `/api/export-csv?ids=${idsParam}&origin=${encodeURIComponent(currentOrigin)}`;

  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
