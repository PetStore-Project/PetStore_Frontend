import { jsPDF } from 'jspdf';

/**
 * Service to handle CSV Exports
 */
export const exportCSVService = (
  filtered: any[], 
  range: string, 
  formatDate: (d: string) => string
) => {
  if (filtered.length === 0) return false;

  const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Total', 'Order Status', 'Payment Status', 'Payment Method'];
  
  const rows = filtered.map(o => [
    `"#${o.id.slice(-6).toUpperCase()}"`,
    `"${o.customer.replace(/"/g, '""')}"`,
    `"${o.email.replace(/"/g, '""')}"`,
    `"${formatDate(o.date)}"`,
    o.total.toFixed(2),
    `"${o.status}"`,
    o.isPaid ? 'Paid' : 'Unpaid',
    `"${o.paymentMethod}"`
  ]);

  let csvContent = headers.join(',') + '\r\n';
  rows.forEach(row => { 
    csvContent += row.join(',') + '\r\n'; 
  });

  const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `PetStore_Orders_${range.replace(/ /g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};

/**
 * Service to handle HTML Invoice Downloads
 */
export const downloadInvoiceService = (
  order: any, 
  formatMoney: (n: number) => string, 
  formatDate: (d: string) => string
) => {
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice #${order._id.slice(-6).toUpperCase()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; background: #f8fafc; }
          .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 60px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
          .header { display: flex; justify-content: space-between; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 3px solid #0f172a; }
          .logo { font-size: 32px; font-weight: 900; color: #0f172a; }
          .invoice-details { text-align: right; color: #64748b; font-size: 14px; line-height: 1.6; }
          .total-row.grand { background: #0f172a; color: white; font-size: 16px; font-weight: 700; border-radius: 8px; padding: 12px; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div><div class="logo">PetStore+</div></div>
            <div class="invoice-details">
              <div>INVOICE #${order._id.slice(-6).toUpperCase()}</div>
              <div>${formatDate(order.createdAt)}</div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
            <div><strong>Bill To:</strong><br>${order.user.firstName} ${order.user.lastName}<br>${order.user.email}</div>
            <div><strong>Ship To:</strong><br>${order.shippingAddress.address}<br>${order.shippingAddress.city}</div>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="text-align: left; padding: 12px;">Item</th>
                <th style="text-align: right; padding: 12px;">Qty</th>
                <th style="text-align: right; padding: 12px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems.map((item: any) => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${item.name}</td>
                  <td style="text-align: right; padding: 12px; border-bottom: 1px solid #f1f5f9;">${item.quantity}</td>
                  <td style="text-align: right; padding: 12px; border-bottom: 1px solid #f1f5f9;">${formatMoney(item.price)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total-row grand" style="display: flex; justify-content: space-between">
            <span>Total Amount</span>
            <span>${formatMoney(order.totalPrice)}</span>
          </div>
          <div style="margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            PetStore+ • Phnom Penh, Cambodia
          </div>
        </div>
      </body>
    </html>`;

  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${order._id.slice(-6).toUpperCase()}.html`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Service to handle PDF Reports
 */
export const generateFinancialReportService = (
  filtered: any[], 
  range: string, 
  formatMoney: (n: number) => string
) => {
  const totalRevenue = filtered.reduce((sum, o) => sum + (o.total || 0), 0);
  const doc = new jsPDF();
  
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('PetStore+ Revenue Report', 105, 18, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`Revenue Overview for ${range}: ${formatMoney(totalRevenue)}`, 15, 60);
  
  doc.save(`PetStore_Report_${range.replace(/ /g, '_')}.pdf`);
};