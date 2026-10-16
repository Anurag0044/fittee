import PDFDocument from 'pdfkit';
import { OrderService } from './order.service';

export class InvoiceService {
  static async generateTaxInvoicePdf(orderIdOrNumber: string): Promise<Buffer> {
    const order = await OrderService.getOrder(orderIdOrNumber);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 36,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title & Business Header
      doc.fontSize(18).font('Helvetica-Bold').text('TAX INVOICE', { align: 'right' });
      doc.fontSize(12).font('Helvetica-Bold').text('FITTEE APPAREL PRIVATE LIMITED');
      doc.fontSize(9).font('Helvetica').text('Tribal Heritage Streetwear Hub, Ashok Nagar, Ranchi, Jharkhand - 834002');
      doc.text('GSTIN: 20AAACF1942L1Z4 | State Code: 20 (Jharkhand)');
      doc.text('Customer Support: billing@fittee.in | https://fittee.in');
      doc.moveDown(1.2);

      // 2-Column Info Card
      const boxY = doc.y;
      doc.rect(36, boxY, 523, 75).stroke('#E7E5DF');

      // Left: Billed to
      doc.fontSize(8.5).font('Helvetica-Bold').text('BILLED TO / SHIP TO:', 46, boxY + 8);
      doc.font('Helvetica-Bold').fontSize(10).text(order.shippingAddress?.fullName || order.customerName, 46, boxY + 20);
      doc.font('Helvetica').fontSize(8.5).text(order.shippingAddress?.addressLine1 || '', 46, boxY + 34);
      doc.text(
        `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`,
        46,
        boxY + 46
      );
      doc.text(`Phone: ${order.shippingAddress?.phone || order.customerPhone} | Customer: ${order.customerCode}`, 46, boxY + 58);

      // Right: Invoice Metadata
      const invNumber = `INV-2026-${(order.orderNumber || '8942').replace(/[^0-9]/g, '')}`;
      doc.fontSize(8.5).font('Helvetica-Bold').text('INVOICE DETAILS:', 340, boxY + 8);
      doc.font('Helvetica').fontSize(8.5).text(`Invoice No: ${invNumber}`, 340, boxY + 20);
      doc.text(`Order No: ${order.orderNumber}`, 340, boxY + 32);
      doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 340, boxY + 44);
      doc.text(`Place of Supply: ${order.shippingAddress?.state || 'Jharkhand'}`, 340, boxY + 56);

      doc.y = boxY + 85;

      // Items Table Header
      const tableTop = doc.y;
      doc.rect(36, tableTop, 523, 22).fill('#F5F4EF');
      doc.fillColor('#161714').font('Helvetica-Bold').fontSize(8.5);
      doc.text('Item Description', 46, tableTop + 6);
      doc.text('HSN Code', 260, tableTop + 6);
      doc.text('Qty', 340, tableTop + 6);
      doc.text('Unit Price', 400, tableTop + 6);
      doc.text('Total (INR)', 480, tableTop + 6);

      // Items Table Rows
      let rowY = tableTop + 28;
      doc.font('Helvetica').fontSize(8.5);
      for (const item of order.items || []) {
        doc.text(`${item.productTitle} (${item.size}, ${item.colorName})`, 46, rowY);
        doc.text('61091000', 260, rowY);
        doc.text(`${item.quantity}`, 340, rowY);
        doc.text(`₹${item.unitPrice}`, 400, rowY);
        doc.text(`₹${item.totalPrice}`, 480, rowY);
        rowY += 18;
      }

      // Calculations and Tax Breakdown
      doc.y = rowY + 10;
      doc.strokeColor('#E7E5DF').moveTo(36, doc.y).lineTo(559, doc.y).stroke();
      doc.moveDown(0.8);

      const totX = 340;
      const valX = 480;
      const subtotal = order.subtotal || order.totalAmount;
      const cgst = Math.round(order.totalAmount * 0.025);
      const sgst = Math.round(order.totalAmount * 0.025);

      doc.fontSize(8.5).font('Helvetica');
      doc.text('Subtotal:', totX, doc.y);
      doc.text(`₹${subtotal}`, valX, doc.y);
      doc.moveDown(0.4);

      if (order.discountAmount > 0) {
        doc.text('Festive Discount:', totX, doc.y);
        doc.text(`-₹${order.discountAmount}`, valX, doc.y);
        doc.moveDown(0.4);
      }

      doc.text('CGST (2.5%):', totX, doc.y);
      doc.text(`₹${cgst}`, valX, doc.y);
      doc.moveDown(0.4);

      doc.text('SGST (2.5%):', totX, doc.y);
      doc.text(`₹${sgst}`, valX, doc.y);
      doc.moveDown(0.4);

      doc.font('Helvetica-Bold').fontSize(11);
      doc.text('Total Invoice Amount:', totX, doc.y);
      doc.text(`₹${order.totalAmount}`, valX, doc.y);
      doc.moveDown(1.5);

      // Footer
      doc.fontSize(8).font('Helvetica').fillColor('#6B6A63').text(
        'This is a computer-generated tax invoice and requires no physical signature. Goods once sold are covered under the FITTEE 7-Day Heritage Quality Guarantee.',
        36,
        doc.y,
        { align: 'center', width: 523 }
      );

      doc.end();
    });
  }
}
