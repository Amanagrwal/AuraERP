import { useState, useRef } from 'react';
import { Invoice } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  Printer,
  Download,
  Send as SendIcon,
  X,
  Building2,
  User,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { WhatsAppShareDialog } from './WhatsAppShareDialog';
import { cn } from '@/lib/utils';
import { amountInWords } from '../Helper/AmountInWords';
import { calculateTax } from '../Helper/CalculateTax';
import { getGrandTotal } from '../Helper/GrandTotal';
import { OrderStatus } from '../Helper/orderstatus';
import { formatDate } from '../Helper/formatDate';
import { getVisibleTaxRows } from '../Helper/GetVisibleTaxRows';
import Button_loader from '../Helper/Button_loader';

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // invoice: Invoice | null;
}
const statusLabels = {
  // draft: 'Draft',
  pending: 'Pending',
  paid: 'Paid',
  // cancelled: 'Cancelled',
};

const statusStyles = {
  // draft: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/10 text-warning',
  paid: 'bg-success/10 text-success',
  // cancelled: 'bg-destructive/10 text-destructive',
};

export function InvoiceDetailDialog({ open, onOpenChange, invoice }) {
  const [downloading, setDownloading] = useState(false);

  // const { invoice, clients } = useApp();
  const logoUrl = invoice?.company?.logo_1
    ? `${import.meta.env.VITE_API_BASE_URL}${invoice?.company?.logo_1}`
    :  '/auartech_ERP_log.jpeg';

  const signatureUrl = invoice?.company?.signature_img
    ? `${import.meta.env.VITE_API_BASE_URL}${invoice.company.signature_img}`
    : null;


  const taxHtml = getVisibleTaxRows(invoice)
    .map(
      tax => `
      <div class="row">
        <span>
          ${tax.label}${tax.percent ? `${tax.percent}` : ""}
        </span>
        <span>
          ₹${Number(tax.amount).toLocaleString("en-IN")}
        </span>
      </div>
    `
    )
    .join("");



console.log("invoice",invoice)
  const printRef = useRef<HTMLDivElement>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  if (!invoice) return null;

  // const client = clients.find(c => c.id === invoice.clientId);

//   const handlePrint = () => {
//     const printContent = printRef.current;
//     if (!printContent) return;

      
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) return;

// printWindow.document.write(`
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Invoice ${invoice?.invoice_no}</title>
//   <link rel="icon" type="${logoUrl}" href="${logoUrl}" />

//   <style>
//     @page {
//       size: A4;
//       margin: 20mm;
//     }

//     * {
//       box-sizing: border-box;
//     }

//     body {
//       font-family: Arial, Helvetica, sans-serif;
//       font-size: 12px;
//       color: #000;
//     }

//     /* HEADER */
//     .invoice-header {
//       display: flex;
//       justify-content: space-between;
//       border-bottom: 2px solid #000;
//       padding-bottom: 10px;
//       margin-bottom: 20px;
//     }

//     .company-info h1 {
//       font-size: 18px;
//       margin-bottom: 4px;
//     }

//     .company-info p {
//       font-size: 11px;
//       line-height: 1.5;
//     }

//     .invoice-meta {
//       text-align: right;
//     }

//     .invoice-meta h2 {
//       font-size: 20px;
//       font-weight: bold;
//       margin-bottom: 6px;
//       letter-spacing: 1px;
//     }

//     /* PARTIES */
//     .parties {
//       margin-bottom: 15px;
//     }

//     .party h3 {
//       font-size: 11px;
//       text-transform: uppercase;
//       margin-bottom: 4px;
//     }

//     .party p {
//       font-size: 12px;
//       line-height: 1.5;
//     }

//     /* GST TABLE */
//     .gst-table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-bottom: 15px;
//       font-size: 12px;
//     }

//     .gst-table th,
//     .gst-table td {
//       border: 1px solid #000;
//       padding: 6px;
//     }

//     .gst-table thead th {
//       background: #f0f0f0;
//       text-align: center;
//       font-weight: bold;
//     }

//     .text-right {
//       text-align: right;
//     }

//     .text-center {
//       text-align: center;
//     }

//     .gst-table tr {
//       page-break-inside: avoid;
//     }

//     /* TOTALS */
//     .totals {
//       width: 320px;
//       margin-left: auto;
//       border: 1px solid #000;
//       font-size: 12px;
//     }

//     .totals .row {
//       display: flex;
//       justify-content: space-between;
//       padding: 6px 10px;
//       border-bottom: 1px solid #000;
//     }

//     .totals .grand-total {
//       font-weight: bold;
//       background: #f0f0f0;
//       font-size: 14px;
//     }

//     /* FOOTER */
//     .footer {
//       margin-top: 25px;
//       font-size: 11px;
//     }

//     .footer-row {
//       display: flex;
//       justify-content: space-between;
//       align-items: flex-end;
//     }

//     .footer-left {
//       width: 65%;
//     }

//     .footer-right {
//       width: 30%;
//       text-align: right;
//     }

//     .signature-box img {
//       max-height: 60px;
//       object-fit: contain;
//     }

//     .signature-label {
//       font-size: 11px;
//       margin-top: 4px;
//     }

//     .thank-you {
//       text-align: center;
//       margin-top: 15px;
//       font-size: 11px;
//     }

//     .terms-title {
//   font-weight: bold;
//   margin-bottom: 4px;
//   text-transform: uppercase;
// }

// .terms-text {
//   font-size: 11px;
//   line-height: 1.6;
// }

// .terms-text ul {
//   padding-left: 16px;
//   margin: 4px 0 0 0;
// }

// .terms-text li {
//   margin-bottom: 2px;
// }

// .parties {
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 15px;
// }

// .party {
//   width: 48%;
// }

// .invoice-details {
//   text-align: right;
// }


//   </style>
// </head>

// <body>

// <!-- HEADER -->
// <div class="invoice-header">
//   <div class="company-info">
//     <h1>${invoice?.company?.company_name}</h1>
//     <p>
//        ${invoice?.company?.address}<br/>
//       GSTIN: ${invoice?.company?.gstin}<br/>
//       State: ${invoice?.company?.state?.state_name}
//     </p>
//   </div>

//   <div class="invoice-meta">
   
//   </div>
// </div>

// <!-- BILL TO -->
// <div class="parties">
//   <div class="party">
//     <h3>Bill To</h3>
//     <p>
//        ${invoice?.billing_name ? `
//         <strong>${invoice.billing_name}</strong><br/>
//       ` : ''}

//        ${invoice?.customer?.Mobile_no ? `
//         Mobile Number: ${invoice.customer.Mobile_no}<br/>
//       ` : ''}

//        ${invoice?.customer?.email ? `
//         Email: ${invoice.customer.email}<br/>
//       ` : ''}

//        ${invoice?.customer?.gstin ? `
//         GSTIN: ${invoice.customer.gstin}<br/>
//       ` : ''}

//      ${invoice?.customer?.billing_address ? `
//         Billing Address: ${invoice.customer.billing_address}<br/>
//       ` : ''}
//  ${invoice?.customer?.state_of_supply?.state_name ? `
//         State: (${invoice.customer.state_of_supply.state_code})
//         ${invoice.customer.state_of_supply.state_name}
//       ` : ''}      
//     </p>
//   </div>
//    <div class="party invoice-details">
//     <h3>Invoice Details</h3>
//     <p>
//       <strong>Invoice No:</strong> ${invoice.invoice_no}<br/>
//       <strong>Invoice Date:</strong> ${formatDate(invoice.date)}<br/>
//       ${invoice?.dueDate ? `<strong>Due Date:</strong> ${invoice?.dueDate}` : ''}
//     </p>
//   </div>
// </div>

// <!-- GST TABLE -->
// <table class="gst-table">
//   <thead>
//     <tr>
//       <th>#</th>
//       <th>Description of Goods</th>
//       <th>HSN/SAC</th>
//       <th>Qty</th>
//       <th>Rate (₹)</th>
//       <th>Discount (₹)</th>
//       <th>GST %</th>
//       <th>Amount (₹)</th>
//     </tr>
//   </thead>
//   <tbody>
//     ${invoice?.Invoice_details.map((item, idx) => `
//       <tr>
//         <td class="text-center">${idx + 1}</td>
//         <td>${item?.product?.product_name}</td>
//         <td class="text-center">${item?.product?.hsn_sac || '-'}</td>
//         <td class="text-right">${item.qty}</td>
//         <td class="text-right">${amountInWords(item.Rate)}</td>
//         <td class="text-right">${amountInWords(item.discount_amt)}</td>
//         <td class="text-right">${item.gst_percentage}%</td>
//         <td class="text-right">${amountInWords(item.total_amt)}</td>
//       </tr>
//     `).join('')}
//   </tbody>
// </table>

// <!-- TOTALS -->
// <div class="totals">
//   <div class="row"><span>Subtotal</span><span>${amountInWords(invoice?.total_amt)}</span></div>
//   ${taxHtml}
//   <div class="row"><span>Round Off</span><span>${invoice?.round_amt}</span></div>
//   <div class="row grand-total"><span>Grand Total</span><span>${amountInWords(invoice?.net_amt)}</span></div>
// </div>

// <!-- DECLARATION -->
// <p style="margin-top:15px; font-size:11px;">
//   <strong>Declaration:</strong><br/>
//   We declare that this invoice shows the actual price of the goods described
//   and that all particulars are true and correct.
// </p>

// <!-- FOOTER -->
// <div class="footer">
//   <div class="footer-row">
//     <div class="footer-left">
//   ${invoice?.company?.invoice_footer ? `
//     <div class="terms-title">Terms & Conditions</div>
//     <div class="terms-text">
//       <ul>
//         ${invoice.company.invoice_footer
//           .split('\n')
//           .map(term => `<li>${term}</li>`)
//           .join('')}
//       </ul>
//     </div>
//   ` : ''}
// </div>


//     <div class="footer-right">
//       ${signatureUrl ? `
//         <div class="signature-box">
//           <img src="${signatureUrl}" />
//           <div class="signature-label">Authorized Signature</div>
//         </div>
//       ` : ''}
//     </div>
//   </div>

//   <p class="thank-you">Thank you for your business!</p>
// </div>

// </body>
// </html>
// `);


//     printWindow.document.close();
//     printWindow.print();
//   };

  const getInvoiceHTML = () =>`
  <!DOCTYPE html>
  <html>
  <head>
    <title> ${invoice.billing_name} Invoice</title>
    <link rel="icon" type="${logoUrl}" href="${logoUrl}" />

    <style>
      @page {
        size: A4;
        margin: 20mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        color: #000;
      }

      /* HEADER */
      .invoice-header {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }

      .company-info h1 {
        font-size: 18px;
        margin-bottom: 4px;
      }

      .company-info p {
        font-size: 11px;
        line-height: 1.5;
      }

      .invoice-meta {
        text-align: right;
      }

      .invoice-meta h2 {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
        letter-spacing: 1px;
      }

      /* PARTIES */
      .parties {
        margin-bottom: 15px;
      }

      .party h3 {
        font-size: 11px;
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .party p {
        font-size: 12px;
        line-height: 1.5;
      }

      /* GST TABLE */
      .gst-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
        font-size: 12px;
      }

      .gst-table th,
      .gst-table td {
        border: 1px solid #000;
        padding: 6px;
      }

      .gst-table thead th {
        background: #f0f0f0;
        text-align: center;
        font-weight: bold;
      }

      .text-right {
        text-align: right;
      }

      .text-center {
        text-align: center;
      }

      .gst-table tr {
        page-break-inside: avoid;
      }

      /* TOTALS */
      .totals {
        width: 320px;
        margin-left: auto;
        border: 1px solid #000;
        font-size: 12px;
      }

      .totals .row {
        display: flex;
        justify-content: space-between;
        padding: 6px 10px;
        border-bottom: 1px solid #000;
      }

      .totals .grand-total {
        font-weight: bold;
        background: #f0f0f0;
        font-size: 14px;
      }

      /* FOOTER */
      .footer {
        margin-top: 25px;
        font-size: 11px;
      }

      .footer-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .footer-left {
        width: 65%;
      }

      .footer-right {
        width: 30%;
        text-align: right;
      }

      .signature-box img {
        max-height: 60px;
        object-fit: contain;
      }

      .signature-label {
        font-size: 11px;
        margin-top: 4px;
      }

      .thank-you {
        text-align: center;
        margin-top: 15px;
        font-size: 11px;
      }

      .terms-title {
    font-weight: bold;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .terms-text {
    font-size: 11px;
    line-height: 1.6;
  }

  .terms-text ul {
    padding-left: 16px;
    margin: 4px 0 0 0;
  }

  .terms-text li {
    margin-bottom: 2px;
  }

  .parties {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .party {
    width: 48%;
  }

  .invoice-details {
    text-align: right;
  }


    </style>
  </head>

  <body>

  <!-- HEADER -->
  <div class="invoice-header">
    <div class="company-info">
      <h1>${invoice?.company?.company_name}</h1>
      <p>
        ${invoice?.company?.address}<br/>
        GSTIN: ${invoice?.company?.gstin}<br/>
        State: ${invoice?.company?.state?.state_name}
      </p>
    </div>

    <div class="invoice-meta">
    
    </div>
  </div>

  <!-- BILL TO -->
  <div class="parties">
    <div class="party">
      <h3>Bill To</h3>
      <p>
        ${invoice?.billing_name ? `
          <strong>${invoice.billing_name}</strong><br/>
        ` : ''}

        ${invoice?.customer?.Mobile_no ? `
          Mobile Number: ${invoice.customer.Mobile_no}<br/>
        ` : ''}

        ${invoice?.customer?.email ? `
          Email: ${invoice.customer.email}<br/>
        ` : ''}

        ${invoice?.customer?.gstin ? `
          GSTIN: ${invoice.customer.gstin}<br/>
        ` : ''}

      ${invoice?.customer?.billing_address ? `
          Billing Address: ${invoice.customer.billing_address}<br/>
        ` : ''}
  ${invoice?.customer?.state_of_supply?.state_name ? `
          State: (${invoice.customer.state_of_supply.state_code})
          ${invoice.customer.state_of_supply.state_name}
        ` : ''}      
      </p>
    </div>
    <div class="party invoice-details">
      <h3>Invoice Details</h3>
      <p>
        <strong>Invoice No:</strong> ${invoice.invoice_no}<br/>
        <strong>Invoice Date:</strong> ${formatDate(invoice.date)}<br/>
        ${invoice?.dueDate ? `<strong>Due Date:</strong> ${invoice?.dueDate}` : ''}
      </p>
    </div>
  </div>

  <!-- GST TABLE -->
  <table class="gst-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Description of Goods</th>
        <th>HSN/SAC</th>
        <th>Qty</th>
        <th>Rate (₹)</th>
        <th>GST %</th>
        <th>Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${invoice?.Invoice_details.map((item, idx) => `
        <tr>
          <td class="text-center">${idx + 1}</td>
          <td>${item?.product?.product_name}</td>
          <td class="text-center">${item?.product?.hsn_sac || '-'}</td>
          <td class="text-right">${item.qty}</td>
          <td class="text-right">${amountInWords(item.Rate)}</td>
          <td class="text-right">${item.gst_percentage}%</td>
          <td class="text-right">${amountInWords(item.total_amt)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- TOTALS -->
  <div class="totals">
    <div class="row"><span>Subtotal</span><span>${amountInWords(invoice?.total_amt)}</span></div>
    ${taxHtml}
    <div class="row"><span>Round Off</span><span>${invoice?.round_amt}</span></div>
    <div class="row grand-total"><span>Grand Total</span><span>${amountInWords(invoice?.net_amt)}</span></div>
  </div>

  <!-- DECLARATION -->
  <p style="margin-top:15px; font-size:11px;">
    <strong>Declaration:</strong><br/>
    We declare that this invoice shows the actual price of the goods described
    and that all particulars are true and correct.
  </p>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-row">
      <div class="footer-left">
    ${invoice?.company?.invoice_footer ? `
      <div class="terms-title">Terms & Conditions</div>
      <div class="terms-text">
        <ul>
          ${invoice.company.invoice_footer
            .split('\n')
            .map(term => `<li>${term}</li>`)
            .join('')}
        </ul>
      </div>
    ` : ''}
  </div>


      <div class="footer-right">
        ${signatureUrl ? `
          <div class="signature-box">
            <img src="${signatureUrl}" />
            <div class="signature-label">Authorized Signature</div>
          </div>
        ` : ''}
      </div>
    </div>

    <p class="thank-you">Thank you for your business!</p>
  </div>

  </body>
  </html>
  `;

const handlePrint = () => {
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(getInvoiceHTML());
  win.document.close();
  win.focus();
  win.print();
};

const handleDownloadPDF = async () => {
  try {
    const invoiceId = invoice?.id;              // or invoice.invoice_id
    const companyId = invoice?.company?.id;     // current company id

    if (!invoiceId || !companyId) {
      alert("Invoice or Company ID missing");
      return;
    }
     setDownloading(true);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const url = `${BASE_URL}/invoicee/${invoiceId}/download/?company_id=${companyId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
        // If auth required, uncomment below
        // "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download PDF");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `Invoice-${invoice.invoice_no}.pdf`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("PDF download error:", error);
    alert("Unable to download invoice PDF");
  }
   finally {
    setDownloading(false);
  }
};






  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 font-display">
                <FileText className="h-5 w-5 text-primary" />
                Invoice {invoice?.invoice_no}
              </DialogTitle>


              <Button onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>

              <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>

              <Button onClick={() => setShowWhatsApp(true)} variant="outline" className="gap-4 text-green-600 hover:text-green-700">
                <SendIcon className="h-4 w-4" />
                Share on WhatsApp
              </Button>

              {/* <Button variant="ghost" onClick={() => onOpenChange(false)} className="ml-auto">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button> */}
              {/* <Badge className={cn(statusStyles[invoice.status])}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge> */}
              {/* <Badge variant="outline" className={cn(statusStyles[OrderStatus(invoice.order_status)], "text-xs")}>
                {statusLabels[OrderStatus(invoice.order_status)]}
              </Badge> */}

            </div>
          </DialogHeader>

          <div ref={printRef} className="space-y-6 py-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-border">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={invoice?.company?.company_name || 'Company Logo'}
                      className="max-h-10 max-w-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>

            <div className="space-y-1">
  {invoice?.company?.company_name && (
    <h3 className="font-display font-semibold text-xl text-gray-900">
      {invoice?.company?.company_name}
    </h3>
  )}

  {invoice?.company?.address && (
    <p className="text-sm">
      <span className="font-medium text-gray-500">Company Address: </span>
      <span className="text-gray-900">{invoice?.company?.address}</span>
    </p>
  )}

  {invoice?.company?.gstin && (
    <p className="text-sm">
      <span className="font-medium text-gray-500">GSTIN: </span>
      <span className="text-gray-900">{invoice?.company?.gstin}</span>
    </p>
  )}

  {invoice?.company?.company_type?.company_type && (
    <p className="text-sm">
      <span className="font-medium text-gray-500">Company Type: </span>
      <span className="text-gray-900">{invoice?.company?.company_type?.company_type}</span>
    </p>
  )}

</div>


              </div>

              <div className="text-right">
                {/* <h2 className="font-display text-2xl font-bold text-primary">INVOICE</h2>
                <p className="font-mono font-medium">{invoice.invoice_no}</p>
                <div className="flex items-center gap-1 justify-end text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(invoice.date)}
                </div> */}

                {invoice?.company?.gst_status && (
                  <Badge className="text-sm text-white bg-blue-600/80 border border-blue-700/50">
                    {invoice?.company?.gst_status}
                  </Badge>
                )}
              </div>
            </div>

            {/* Client Info */}
            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
              {/* Left Side: Bill To */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>

<div className="space-y-1">
  {/* Bill To */}
  <p className="text-xs text-gray-400 uppercase font-medium">Bill To</p>
  {invoice?.billing_name && (
    <h4 className="font-semibold text-gray-900 text-lg">{invoice?.billing_name}</h4>
  )}
  {invoice?.customer?.Mobile_no && (
  <p className="text-sm text-gray-800">
    <span className="text-xs text-gray-400 font-medium">Mobile Number : </span>
    {invoice?.customer?.Mobile_no}
  </p>
  )}

  {invoice?.customer?.email&& (
  <p className="text-sm text-gray-800">
    <span className="text-xs text-gray-400 font-medium">Email : </span>
    {invoice?.customer?.email}
  </p>
  )}

  {invoice?.customer?.gstin && (
    <p className="text-sm text-gray-800">
      <span className="text-xs text-gray-400 font-medium">GSTIN: </span>
      <span className="font-mono">{invoice?.customer?.gstin}</span>
    </p>
  )}

  {/* Address */}
  {invoice?.customer?.billing_address && (
  <p className="text-sm text-gray-800">
    <span className="text-xs text-gray-400 font-medium">Billing Address : </span>
    {invoice?.customer?.billing_address}
  </p>
  )}

  {/* GSTIN */}

  {/* State */}
  {invoice?.customer?.state_of_supply?.state_name && (
  <p className="text-sm text-gray-800">
    <span className="text-xs text-gray-400 font-medium">State: </span>
    ({invoice?.customer?.state_of_supply?.state_code}) {invoice?.customer?.state_of_supply?.state_name} 
  </p>
    )}

</div>


              </div>

              {/* Right Side: Invoice Info */}
              <div className="text-right ml-auto">
                <h2 className="font-display text-2xl font-bold text-primary">INVOICE</h2>
                <p className="font-mono font-medium">{invoice?.invoice_no}</p>
                <div className="flex items-center gap-1 justify-end text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(invoice?.date)}
                </div>
              </div>
            </div>



            {/* Items Table */}
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>HSN/SAC</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Tax %</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice?.Invoice_details.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{item?.product?.product_name}</TableCell>
                      <TableCell className="font-mono text-sm">{item?.product?.hsn_sac || '-'}</TableCell>
                      <TableCell className="text-right">{item.qty}</TableCell>
                      <TableCell className="text-right">{amountInWords(item.Rate)}</TableCell>
                      <TableCell className="text-right">{amountInWords(item.discount_amt)}</TableCell>
                      <TableCell className="text-right">{item.gst_percentage}%</TableCell>
                      <TableCell className="text-right font-semibold">{`${amountInWords(item.total_amt)}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{`${amountInWords(invoice?.total_amt)}`}</span>
                </div>
                {/* <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Tax ({invoice?.gst_type}) </span>
                  <span>{`${amountInWords(calculateTax(invoice, invoice?.igst_amt))}`}</span>
                </div> */}

                {getVisibleTaxRows(invoice).map((tax, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">
                      {tax.label}
                      {tax.percent && `${tax.percent}`}
                    </span>
                    <span>
                      ₹{tax.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Round Amount</span>
                  <span>{invoice.round_amt}</span>
                </div>
                <div className="flex justify-between py-3 bg-primary text-primary-foreground rounded-lg px-4">
                  <span className="font-display font-semibold flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    Grand Total
                  </span>
                  <span className="font-display text-xl font-bold">
                    {`${amountInWords(invoice?.net_amt)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            {/* <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button> */}
            <Button
  onClick={handleDownloadPDF}
  variant="outline"
  className="gap-2"
  disabled={downloading}
>
  {downloading ? (
    <>
     <Button_loader/>Downloading...
    </>
  ) : (
    <>
      <Download className="h-4 w-4" />
      Download PDF
    </>
  )}
</Button>

            
            <Button onClick={() => setShowWhatsApp(true)} variant="outline" className="gap-2 text-green-600 hover:text-green-700">
              <SendIcon className="h-4 w-4" />
              Share on WhatsApp
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="ml-auto">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WhatsAppShareDialog
        open={showWhatsApp}
        onOpenChange={setShowWhatsApp}
        invoice={invoice}
      // client={client}
      />
    </>
  );
}
