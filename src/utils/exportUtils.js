import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  if (!data || data.length === 0) return;
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (data, filename, title = 'Report') => {
  if (!data || data.length === 0) return;
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  // Prepare table data
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => row[header]));
  
  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [25, 118, 210],
      textColor: 255,
    },
  });
  
  doc.save(`${filename}.pdf`);
};

export const exportAlarmReport = (alarms, format = 'pdf') => {
  const processedData = alarms.map(alarm => ({
    'Alarm ID': alarm.id,
    'Severity': alarm.severity,
    'Message': alarm.message,
    'Source': alarm.source,
    'Status': alarm.status,
    'Created': new Date(alarm.created_at).toLocaleString(),
    'Acknowledged': alarm.acknowledged_at ? new Date(alarm.acknowledged_at).toLocaleString() : 'No',
  }));
  
  const filename = `alarm-report-${new Date().toISOString().split('T')[0]}`;
  
  switch (format) {
    case 'csv':
      exportToCSV(processedData, filename);
      break;
    case 'excel':
      exportToExcel(processedData, filename, 'Alarms');
      break;
    case 'pdf':
      exportToPDF(processedData, filename, 'Alarm Report');
      break;
    default:
      exportToPDF(processedData, filename, 'Alarm Report');
  }
};

export const exportBuildingReport = (building, consumption, devices, format = 'pdf') => {
  const reportData = [
    {
      'Building Name': building.name,
      'Address': building.address,
      'Total Devices': devices?.length || 0,
      'Active Devices': devices?.filter(d => d.is_active).length || 0,
      'Energy Consumption (kWh)': Object.values(consumption || {}).reduce((sum, val) => sum + val, 0),
      'Simulation Status': building.is_simulating ? 'Active' : 'Inactive',
      'Created': new Date(building.created_at).toLocaleDateString(),
    }
  ];
  
  const filename = `building-report-${building.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;
  
  switch (format) {
    case 'csv':
      exportToCSV(reportData, filename);
      break;
    case 'excel':
      exportToExcel(reportData, filename, 'Building Report');
      break;
    case 'pdf':
      exportToPDF(reportData, filename, `Building Report: ${building.name}`);
      break;
    default:
      exportToPDF(reportData, filename, `Building Report: ${building.name}`);
  }
};