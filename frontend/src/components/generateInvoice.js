// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export const generateInvoice = (order) => {
//   const doc = new jsPDF();
//   const isPaid = order.isPaid;
//   const isDelivered = order.isDelivered;
//   const isCOD = order.paymentMethod === 'Cash on Delivery';

//   // --- 1. Header & Branding ---
//   doc.setFont("times", "bold"); 
//   doc.setFontSize(22);
//   doc.text("SARVODAY WATCH CO.", 105, 20, { align: "center" });
  
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("Luxury Timepiece Concierge | Ahmedabad, India", 105, 28, { align: "center" });

//   // --- 2. Dynamic Status Stamp (The COD Logic) ---
//   if (isPaid) {
//     // 1st Priority: If paid, show the Green Official Receipt
//     doc.setDrawColor(0, 128, 0); // Green
//     doc.setLineWidth(0.5);
//     doc.rect(145, 48, 45, 12);
//     doc.setTextColor(0, 128, 0);
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "bold");
//     doc.text("OFFICIAL RECEIPT", 167.5, 54, { align: "center" });
//     doc.setFontSize(8);
//     doc.text("SUCCESSFUL PAID", 167.5, 58, { align: "center" });
//   } else if (isCOD) {
//     // 2nd Priority: If not paid but is COD, show Gold Stamp
//     doc.setDrawColor(212, 175, 55); // Gold
//     doc.setLineWidth(0.5);
//     doc.rect(145, 48, 45, 12);
//     doc.setTextColor(212, 175, 55);
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "bold");
//     doc.text("CASH ON DELIVERY", 167.5, 54, { align: "center" });
//     doc.setFontSize(8);
//     doc.text("PAY ON ARRIVAL", 167.5, 58, { align: "center" });
//   } else {
//     // 3rd Priority: Unpaid online/other
//     doc.setTextColor(200, 0, 0); // Red
//     doc.setFont("helvetica", "bold");
//     doc.text("PAYMENT PENDING", 167.5, 55, { align: "center" });
//   }

//   // Reset for general text
//   doc.setTextColor(0, 0, 0);
//   doc.setDrawColor(0, 0, 0);

//   // --- 3. Invoice Meta Data ---
//   doc.line(20, 42, 190, 42);
//   doc.setFontSize(9);
//   doc.setFont("helvetica", "normal");
//   doc.text(`INVOICE NO: #${order._id.slice(-8).toUpperCase()}`, 20, 50);
//   doc.text(`DATE: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 55);
//   doc.text(`PAYMENT METHOD: ${order.paymentMethod.toUpperCase()}`, 20, 60);
  
//   if (isPaid && order.paidAt) {
//     doc.text(`PAID ON: ${new Date(order.paidAt).toLocaleDateString()}`, 20, 65);
//   }

//   // --- 4. Client Details ---
//   doc.setFontSize(10);
//   doc.text("CONSIGNEE:", 20, 78);
//   doc.setFont("helvetica", "bold");
//   doc.text(String(order.user?.name || "Customer"), 20, 83);
  
//   doc.setFont("helvetica", "normal");
//   const addressLines = [
//     String(order.user?.email || ""),
//     String(order.shippingAddress?.address || ""),
//     `${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}`,
//     String(order.shippingAddress?.country || "")
//   ].filter(line => line && line !== "undefined");
//   doc.text(addressLines, 20, 88);

//   // --- 5. Table of Items ---
//   autoTable(doc, {
//     startY: 110,
//     head: [["Description", "Unit Price", "Qty", "Total Amount"]],
//     body: order.orderItems.map(item => [
//       item.name,
//       `INR ${item.price.toLocaleString()}`,
//       item.quantity,
//       `INR ${(item.quantity * item.price).toLocaleString()}`
//     ]),
//     theme: 'grid',
//     headStyles: { fillColor: [20, 20, 20], textColor: [212, 175, 55], halign: 'center' },
//     columnStyles: { 0: { cellWidth: 80 }, 3: { halign: 'right' } }
//   });

//   // --- 6. Totals ---
//   const finalY = doc.lastAutoTable.finalY + 15;
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "bold");
//   doc.text(`GRAND TOTAL: INR ${order.totalPrice.toLocaleString()}`, 190, finalY, { align: "right" });

//   // --- 7. Footer ---
//   doc.setFontSize(8);
//   doc.setFont("helvetica", "italic");
//   doc.text("This document serves as an official confirmation of your luxury timepiece acquisition.", 105, 280, { align: "center" });
//   doc.text("Sarvoday Watch Co. | Authenticity Guaranteed", 105, 285, { align: "center" });

//   doc.save(`Sarvoday_Invoice_${order._id.slice(-8)}.pdf`);
// };
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order) => {
  const doc = new jsPDF();
  const isPaid = order.isPaid;
  const isShipped = order.isShipped;
  const isDelivered = order.isDelivered;
  
  // UPDATED: Check for both variations of the string
  const isCOD = order.paymentMethod === 'COD' || order.paymentMethod === 'Cash on Delivery';

  // --- 1. Header & Branding ---
  doc.setFont("times", "bold"); 
  doc.setFontSize(22);
  doc.text("SARVODAY WATCH CO.", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Luxury Timepiece Concierge | Ahmedabad, India", 105, 28, { align: "center" });

  // --- 2. Dynamic Status Stamp ---
  if (isPaid) {
    // GREEN STAMP for Success
    doc.setDrawColor(0, 128, 0); 
    doc.setLineWidth(0.5);
    doc.rect(145, 48, 45, 12);
    doc.setTextColor(0, 128, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL RECEIPT", 167.5, 54, { align: "center" });
    doc.setFontSize(8);
    doc.text("PAYMENT SUCCESSFUL", 167.5, 58, { align: "center" });
  } else if (isCOD) {
    // GOLD STAMP for COD
    doc.setDrawColor(212, 175, 55); 
    doc.setLineWidth(0.5);
    doc.rect(145, 48, 45, 12);
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CASH ON DELIVERY", 167.5, 54, { align: "center" });
    doc.setFontSize(8);
    // Logic for Due vs Arriving
    const codSubText = isShipped ? "DUE ON DELIVERY" : "PAY ON ARRIVAL";
    doc.text(codSubText, 167.5, 58, { align: "center" });
  }

  // --- 3. Dynamic Service Note ---
  if (!isPaid && isCOD) {
    doc.setFillColor(245, 245, 245); 
    doc.rect(20, 102, 170, 8, 'F');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("SERVICE NOTE: Please have the exact amount (INR) ready for our logistics partner upon delivery.", 105, 107, { align: "center" });
  }

  // Reset colors for text
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);

  // --- 4. Invoice Meta Data ---
  doc.line(20, 42, 190, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`INVOICE NO: #${order._id.slice(-8).toUpperCase()}`, 20, 50);
  doc.text(`DATE: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 55);
  doc.text(`PAYMENT METHOD: ${order.paymentMethod.toUpperCase()}`, 20, 60);
  
  const currentStatus = isDelivered ? "DELIVERED" : isShipped ? "SHIPPED & IN TRANSIT" : "PROCESSING";
  doc.text(`ORDER STATUS: ${currentStatus}`, 20, 65);

  // --- 5. Client Details ---
  doc.setFontSize(10);
  doc.text("CONSIGNEE:", 20, 78);
  doc.setFont("helvetica", "bold");
  doc.text(String(order.user?.name || "Customer"), 20, 83);
  doc.setFont("helvetica", "normal");
  
  const addressLines = [
    String(order.user?.email || ""),
    String(order.shippingAddress?.address || ""),
    `${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}`
  ].filter(line => line && line !== "undefined" && line !== "");
  
  doc.text(addressLines, 20, 88);

  // --- 6. Table of Items ---
  autoTable(doc, {
    startY: 115, 
    head: [["Description", "Unit Price", "Qty", "Total Amount"]],
    body: order.orderItems.map(item => [
      item.name,
      `INR ${item.price.toLocaleString()}`,
      item.quantity,
      `INR ${(item.quantity * item.price).toLocaleString()}`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [20, 20, 20], textColor: [212, 175, 55], halign: 'center' },
    columnStyles: { 0: { cellWidth: 80 }, 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'right' } }
  });

  // --- 7. Totals ---
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`GRAND TOTAL: INR ${order.totalPrice.toLocaleString()}`, 190, finalY, { align: "right" });

  // --- 8. Footer ---
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for choosing Sarvoday. Please inspect the timepiece and security seal before payment.", 105, 275, { align: "center" });
  
  doc.setFont("helvetica", "bolditalic");
  doc.text("Sarvoday Watch Co. | Authenticity Guaranteed | Ahmedabad, India", 105, 282, { align: "center" });

  doc.save(`Sarvoday_Invoice_${order._id.slice(-8)}.pdf`);
};