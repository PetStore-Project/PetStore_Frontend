import { jsPDF } from 'jspdf';

// Export CSV logic
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

// Download Invoice HTML
export const downloadInvoiceService = (
  order: any,
  formatMoney: (n: number) => string,
  formatDate: (d: string) => string
) => {
  const formatCurrency = formatMoney;
  const formatDateStr = formatDate;

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
        .logo-sub { font-size: 12px; color: #64748b; font-weight: 600; margin-top: 4px; }
        .invoice-details { text-align: right; }
        .section-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .info-value { font-size: 14px; color: #0f172a; font-weight: 600; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        thead { background: #f8fafc; }
        th { text-align: left; padding: 14px 16px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
        td { padding: 16px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
        .text-right { text-align: right; }
        .totals { margin-top: 30px; }
        .total-row { display: flex; justify-content: space-between; padding: 12px 16px; font-size: 14px; font-weight: 600; color: #64748b; }
        .total-row.grand { background: #0f172a; color: white; font-size: 16px; font-weight: 700; border-radius: 8px; margin-top: 8px; }
        .footer { margin-top: 60px; padding-top: 30px; border-top: 2px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8; }
        .status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #d1fae5; color: #065f46; margin-top: 8px; }
        @media print { body { padding: 0; background: white; } .invoice { box-shadow: none; } }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div>
            <div class="logo">PetStore+</div>
            <div class="logo-sub">Premium Pet Supplies</div>
          </div>
          <div class="invoice-details">
            <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">INVOICE #${order._id.slice(-6).toUpperCase()}</div>
            <div style="font-size: 13px; color: #64748b;">${formatDateStr(order.createdAt)}</div>
            ${order.isPaid ? '<div class="status-badge">PAID</div>' : ''}
          </div>
        </div>

        <div class="info-grid">
          <div>
            <div class="section-title">Bill To</div>
            <div class="info-value">
              ${order.user.firstName} ${order.user.lastName}<br>
              ${order.user.email}<br>
              ${order.user.phone || order.shippingAddress.phone || 'N/A'}
            </div>
          </div>
          <div>
            <div class="section-title">Shipping Address</div>
            <div class="info-value">
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </div>
          </div>
        </div>

        <div class="section-title">Order Items</div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems.map((item: any) => `
              <tr>
                <td style="font-weight: 600;">${item.name}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${formatCurrency(item.price)}</td>
                <td class="text-right">${formatCurrency(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatCurrency(order.itemsPrice || order.totalPrice)}</span>
          </div>
          <div class="total-row">
            <span>Tax</span>
            <span>${formatCurrency(order.taxPrice || 0)}</span>
          </div>
          <div class="total-row">
            <span>Shipping</span>
            <span>${formatCurrency(order.shippingPrice || 0)}</span>
          </div>
          <div class="total-row grand">
            <span>Total Amount</span>
            <span>${formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        <div style="margin-top: 40px;">
          <div class="info-grid">
            <div>
              <div class="section-title">Payment Method</div>
              <div class="info-value">${order.paymentMethod}</div>
            </div>
            <div>
              <div class="section-title">Payment Date</div>
              <div class="info-value">${order.paidAt ? formatDateStr(order.paidAt) : 'Pending'}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          Thank you for your purchase!<br>
          Questions? Contact us at support@petstore.com<br>
          <strong>PetStore+</strong> • Phnom Penh, Cambodia
        </div>
      </div>
    </body>
    </html>
  `;

  // Download
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${order._id.slice(-6).toUpperCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate Revenue Report PDF
export const generateFinancialReportService = (
  filtered: any[],
  range: string,
  formatMoney: (n: number) => string
) => {
  if (filtered.length === 0) return;

  // Calculate dynamic statistics from real orders
  const totalRevenue = filtered.reduce((sum, o) => sum + (o.total || o.totalPrice || 0), 0);
  const paidOrders = filtered.filter(o => o.isPaid);
  const paidRevenue = paidOrders.reduce((sum, o) => sum + (o.total || o.totalPrice || 0), 0);
  const pendingRevenue = totalRevenue - paidRevenue;

  const pendingOrdersList = filtered.filter(o => o.status === 'Pending');
  const processingOrdersList = filtered.filter(o => o.status === 'Processing');
  const shippedOrdersList = filtered.filter(o => o.status === 'Shipped');
  const deliveredOrdersList = filtered.filter(o => o.status === 'Delivered');
  const cancelledOrdersList = filtered.filter(o => o.status === 'Cancelled');

  const avgOrderValue = filtered.length > 0 ? totalRevenue / filtered.length : 0;

  // Group by month (optional, keeping minimal as per reference logic structure focus)

  // Top customers
  const customerRevenue: Record<string, number> = {};
  filtered.forEach(o => {
    const name = o.user ? `${o.user.firstName} ${o.user.lastName}` : (o.customer || 'Guest');
    customerRevenue[name] = (customerRevenue[name] || 0) + (o.total || o.totalPrice || 0);
  });
  const topCustomers = Object.entries(customerRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Create PDF using jsPDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PetStore+ Revenue Report', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Range: ${range} • Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 30, { align: 'center' });

  y = 55;
  doc.setTextColor(0, 0, 0);

  // Revenue Overview
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('REVENUE OVERVIEW', 15, y);
  y += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Expected Revenue:', 15, y);
  doc.text('Collected (Paid):', 80, y);
  doc.text('Pending:', 145, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(formatMoney(totalRevenue), 15, y);
  doc.setTextColor(5, 150, 105);
  doc.text(formatMoney(paidRevenue), 80, y);
  doc.setTextColor(217, 119, 6);
  doc.text(formatMoney(pendingRevenue), 145, y);

  y += 12;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Orders:', 15, y);
  doc.text('Avg Order Value:', 80, y);
  doc.text('Paid Orders:', 145, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(String(filtered.length), 15, y);
  doc.text(formatMoney(avgOrderValue), 80, y);
  doc.text(String(paidOrders.length), 145, y);

  y += 18;

  // Order Status
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('ORDER STATUS BREAKDOWN', 15, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Status', 15, y);
  doc.text('Count', 70, y);
  doc.text('Percentage', 100, y);
  doc.text('Revenue', 145, y);
  y += 3;
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y, 190, y);
  y += 7;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  const statuses = [
    { name: 'Pending', orders: pendingOrdersList },
    { name: 'Processing', orders: processingOrdersList },
    { name: 'Shipped', orders: shippedOrdersList },
    { name: 'Delivered', orders: deliveredOrdersList },
    { name: 'Cancelled', orders: cancelledOrdersList }
  ];

  statuses.forEach(s => {
    const pct = filtered.length ? ((s.orders.length / filtered.length) * 100).toFixed(1) : '0';
    const rev = s.orders.reduce((sum, o) => sum + (o.total || o.totalPrice || 0), 0);
    doc.text(s.name, 15, y);
    doc.text(String(s.orders.length), 70, y);
    doc.text(`${pct}%`, 100, y);
    doc.text(formatMoney(rev), 145, y);
    y += 7;
  });

  y += 12;


  // Top Customers
  if (topCustomers.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('TOP CUSTOMERS', 15, y);
    y += 10;

    doc.setFontSize(10);
    doc.text('Customer', 15, y);
    doc.text('Total Spent', 130, y);
    y += 3;
    doc.line(15, y, 190, y);
    y += 7;

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    topCustomers.forEach(([name, revenue]) => {
      doc.text(name.substring(0, 40), 15, y);
      doc.text(formatMoney(revenue), 130, y);
      y += 7;
    });
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('This report was automatically generated by PetStore+ Admin Dashboard', pageWidth / 2, 280, { align: 'center' });
  doc.text(`© ${new Date().getFullYear()} PetStore+ • All Rights Reserved`, pageWidth / 2, 287, { align: 'center' });

  // Save PDF with proper filename
  doc.save(`PetStore_Revenue_Report_${range.replace(/ /g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};