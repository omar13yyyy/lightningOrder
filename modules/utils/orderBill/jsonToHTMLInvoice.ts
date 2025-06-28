import { TotalResolved } from "../../../apps/partners-stores-managers-dashboards-service/src/types/order";

function generateInvoiceHTML(order: TotalResolved, lang: 'ar' | 'en'): string {
  const items = lang === 'ar' ? order.orderAR : order.orderEn;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const align = lang === 'ar' ? 'right' : 'left';
  const deliveryNoteTitle = lang === 'ar' ? 'ملاحظات التوصيل' : 'Delivery Note';
  const totalTitle = lang === 'ar' ? 'الإجمالي' : 'Total';
  const qtyLabel = lang === 'ar' ? 'الكمية' : 'Qty';
  const noteLabel = lang === 'ar' ? 'ملاحظة' : 'Note';
  const modifiersLabel = lang === 'ar' ? 'الإضافات' : 'Modifiers';

  const rows = items.map(item => `
    <tr>
      <td><strong>${item.item_name}</strong> - ${item.size_name}</td>
      <td>${item.size_price.toFixed(2)}</td>
      <td>${item.count}</td>
      <td>${item.note}</td>
    </tr>
    ${item.modifiers.map(mod => `
      <tr>
        <td colspan="4" style="padding-${align}: 20px;">
          <strong>${mod.title}</strong>
          <ul>
            ${mod.items.map(mi => `
              <li>${mi.name} × ${mi.number} (${mi.price.toFixed(2)})</li>
            `).join('')}
          </ul>
        </td>
      </tr>
    `).join('')}
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${dir}">
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font-family: sans-serif;
        direction: ${dir};
        text-align: ${align};
        padding: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        vertical-align: top;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
    <title>فاتورة</title>
  </head>
  <body>
    <h2>${lang === 'ar' ? 'فاتورة الطلب' : 'Order Invoice'}</h2>
    <table>
      <thead>
        <tr>
          <th>${lang === 'ar' ? 'المنتج' : 'Item'}</th>
          <th>${lang === 'ar' ? 'السعر' : 'Price'}</th>
          <th>${qtyLabel}</th>
          <th>${noteLabel}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <p><strong>${deliveryNoteTitle}:</strong> ${order.delivery_note}</p>
    <h3>${totalTitle}: ${order.total_price.toFixed(2)}</h3>
  </body>
  </html>
  `;
}
