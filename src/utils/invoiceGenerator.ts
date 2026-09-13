import jsPDF from 'jspdf';
import { Order } from '../types';

export function generateOrderInvoicePdf(order: Order): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [212, 175, 55]; // Gold
  const darkColor = [20, 20, 20];
  const textColor = [50, 50, 50];
  const lightBg = [245, 245, 245];

  // Header Banner
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Gold accent strip
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 42, 210, 2, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('RND SPORTS NUTRITION', 14, 18);

  // Brand Subtitle & Location
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(212, 175, 55);
  doc.text('PREMIUM GYM SUPPLEMENTS & ATHLETIC NUTRITION', 14, 24);
  doc.setTextColor(200, 200, 200);
  doc.text('Gohana, Sonipat, Haryana, India - PIN 131301 | Phone: +91 9306667128', 14, 30);
  doc.text('Email: ramannarwal56@gmail.com | FSSAI State Reg: 10824005000123', 14, 35);

  // Invoice Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TAX INVOICE', 196, 18, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: INV-${order.id}`, 196, 25, { align: 'right' });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 196, 31, { align: 'right' });

  // Bill To / Ship To Section
  let y = 54;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, y, 88, 36, 2, 2, 'F');
  doc.roundedRect(108, y, 88, 36, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('BILLED / SHIPPED TO:', 18, y + 6);
  doc.text('ORDER & PAYMENT DETAILS:', 112, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // Customer Address
  doc.text(`Name: ${order.customerName}`, 18, y + 12);
  doc.text(`Phone: +91 ${order.phone}`, 18, y + 17);
  const addr = `${order.shippingAddress.houseBuilding}, ${order.shippingAddress.streetArea}`;
  doc.text(doc.splitTextToSize(addr, 80), 18, y + 22);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`, 18, y + 31);

  // Order Info
  doc.text(`Order ID: ${order.id}`, 112, y + 12);
  doc.text(`Payment Method: ${order.paymentMethod}`, 112, y + 17);
  doc.text(`Payment Status: ${order.paymentStatus}`, 112, y + 22);
  if (order.upiUtr) {
    doc.text(`UPI UTR: ${order.upiUtr}`, 112, y + 27);
  } else {
    doc.text(`Courier: ${order.courierName || 'Delhivery Express'}`, 112, y + 27);
  }
  doc.text(`Tracking #: ${order.trackingNumber || 'Pending Dispatch'}`, 112, y + 32);

  // Items Table Header
  y = 100;
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(14, y, 182, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Item Description', 18, y + 5.5);
  doc.text('SKU', 95, y + 5.5);
  doc.text('Qty', 125, y + 5.5, { align: 'center' });
  doc.text('Price (INR)', 150, y + 5.5, { align: 'right' });
  doc.text('Total (INR)', 190, y + 5.5, { align: 'right' });

  // Items Row
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  order.items.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(14, y, 182, 10, 'F');
    }

    const itemDesc = `${item.name} (${item.flavour || 'Standard'}, ${item.size || '1kg'})`;
    doc.text(doc.splitTextToSize(itemDesc, 75), 18, y + 6);
    doc.text(item.sku || 'RND-SUPP', 95, y + 6);
    doc.text(String(item.quantity), 125, y + 6, { align: 'center' });
    doc.text(`₹${item.price.toFixed(2)}`, 150, y + 6, { align: 'right' });
    doc.text(`₹${item.subtotal.toFixed(2)}`, 190, y + 6, { align: 'right' });

    y += 10;
  });

  // Table bottom line
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 196, y);

  // Calculation Summary
  y += 6;
  const rightX = 145;
  const valX = 192;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  doc.text('Item Subtotal:', rightX, y);
  doc.text(`₹${order.subtotal.toFixed(2)}`, valX, y, { align: 'right' });
  y += 5.5;

  if (order.discount > 0) {
    doc.setTextColor(200, 50, 50);
    doc.text(`Coupon Discount (${order.couponCode || 'PROMO'}):`, rightX, y);
    doc.text(`-₹${order.discount.toFixed(2)}`, valX, y, { align: 'right' });
    y += 5.5;
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  }

  doc.text('Shipping Charge (India Delivery):', rightX, y);
  doc.text(order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge.toFixed(2)}`, valX, y, { align: 'right' });
  y += 5.5;

  doc.text('Integrated GST (18% Incl.):', rightX, y);
  doc.text(`₹${order.taxAmount.toFixed(2)}`, valX, y, { align: 'right' });
  y += 7;

  // Grand Total Box
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.roundedRect(rightX - 5, y - 4, 56, 12, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(212, 175, 55);
  doc.text('TOTAL AMOUNT:', rightX, y + 4);
  doc.text(`₹${order.totalAmount.toFixed(2)}`, valX, y + 4, { align: 'right' });

  // Compliance & Terms Disclaimer Footer
  const footerY = 250;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, footerY, 196, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('MANDATORY HEALTH & PRODUCT NOTICE:', 14, footerY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  const disclaimerText = 'Food supplements are not medicines. Follow the product label and recommended usage. Consult a qualified healthcare professional before use if you have a medical condition, take medication, are pregnant, or are breastfeeding. Products are not intended to diagnose, treat, cure, or prevent any disease.';
  doc.text(doc.splitTextToSize(disclaimerText, 182), 14, footerY + 9);

  doc.text('Official Customer Support & Batch Queries: +91 9306667128 | ramannarwal56@gmail.com | Gohana, Sonipat, Haryana', 14, footerY + 20);
  doc.text('This is a computer-generated tax invoice and requires no physical signature under Indian IT Act 2000.', 14, footerY + 25);

  // Trigger download
  doc.save(`RND_Invoice_${order.id}.pdf`);
}
