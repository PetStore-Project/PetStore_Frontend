import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DashboardStats {
    revenue: number;
    orders: number;
    processingOrders: number;
    pendingOrders: number;
    newCustomers: number;
}

interface PromoStats {
    active: number;
    totalRedemptions: number;
    estimatedSavings: number;
    revenue: number;
}

// Generate Dashboard Analytics PDF
export const generateDashboardReportService = (
    stats: DashboardStats,
    topProducts: any[],
    topProductsFilter: string,
    promoStats: PromoStats,
    formatMoney: (n: number) => string
) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(0, 77, 41); // PetStore Green
    doc.text('PetStore+ Analytics Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // 1. Sales Overview
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('1. Sales Overview', 14, 45);

    const salesData = [
        ['Total Revenue', formatMoney(stats.revenue), 'Total Orders', stats.orders.toString()],
        ['Processing Orders', stats.processingOrders.toString(), 'Pending Orders', stats.pendingOrders.toString()],
        ['Avg Order Value', stats.orders > 0 ? formatMoney(stats.revenue / stats.orders) : '$0.00', 'New Customers', stats.newCustomers.toString()]
    ];

    autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value', 'Metric', 'Value']],
        body: salesData,
        theme: 'striped',
        headStyles: { fillColor: [0, 146, 0] },
        styles: { fontSize: 10 }
    });

    // 2. Top Products
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text(`2. Top Selling Products (${topProductsFilter})`, 14, finalY);

    const productData = topProducts.map(p => [p.name, p.qty, p.percent + '%']);

    if (productData.length === 0) {
        productData.push(['No sales data for this period', '-', '-']);
    }

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Product Name', 'Quantity Sold', 'Popularity']],
        body: productData,
        theme: 'grid',
        headStyles: { fillColor: [0, 146, 0] },
    });

    // 3. Promotions
    finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('3. Promotion Effectiveness', 14, finalY);

    const promoData = [
        ['Active Campaigns', promoStats.active],
        ['Total Redemptions', promoStats.totalRedemptions],
        ['Impact Sales', formatMoney(promoStats.revenue || 0)],
        ['Est. Savings Given', formatMoney(promoStats.estimatedSavings)]
    ];

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Metric', 'Value']],
        body: promoData,
        theme: 'striped',
        headStyles: { fillColor: [0, 146, 0] }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
    }

    doc.save('petstore-analytics-report.pdf');
};
