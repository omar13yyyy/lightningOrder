type OrderRow = {
  item_type: 'item' | 'modifier';
  parent_item_id: number;
  name_ar: string;
  name_en: string;
  unit_price: number;
  quantity: number;
  price_after_discount: number;
};

type InvoiceOptions = {
  width?: string;
  fontSize?: string;  
  fontFamily?: string;
  direction?: 'rtl' | 'ltr';
  title?: string;
};

export function generateInvoiceHTML(orderDetails: OrderRow[], options: InvoiceOptions = {}): string {
  const {
    width = '80mm',
    fontSize = '14px',
    fontFamily = 'Arial, sans-serif',
    direction = 'rtl',
    title = 'فاتورة الطلب',
  } = options;

  let total = 0;

  // تنظيم الأصناف والإضافات حسب الصنف الأب
  const grouped: Record<number, { item: OrderRow | null; modifiers: OrderRow[] }> = {};

  for (const row of orderDetails) {
    if (row.item_type === 'item') {
      grouped[row.parent_item_id] = {
        item: row,
        modifiers: [],
      };
    } else if (row.item_type === 'modifier') {
      if (!grouped[row.parent_item_id]) {
        grouped[row.parent_item_id] = { item: null, modifiers: [] };
      }
      grouped[row.parent_item_id].modifiers.push(row);
    }
  }

  const rows = Object.values(grouped)
    .map(({ item, modifiers }) => {
      if (!item) return '';
      total += item.price_after_discount;
      let html = `
        <tr>
          <td colspan="2"><strong>${item.name_ar} / ${item.name_en}</strong></td>
          <td>${item.unit_price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>${item.price_after_discount.toFixed(2)}</td>
        </tr>`;

      for (const mod of modifiers) {
        total += mod.price_after_discount;
        html += `
        <tr style="font-size: 13px; color: #555;">
          <td></td>
          <td>+ ${mod.name_ar} / ${mod.name_en}</td>
          <td>${mod.unit_price.toFixed(2)}</td>
          <td>${mod.quantity}</td>
          <td>${mod.price_after_discount.toFixed(2)}</td>
        </tr>`;
      }

      return html;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="ar" dir="${direction}">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      width: ${width};
      font-family: ${fontFamily};
      font-size: ${fontSize};
      margin: 0 auto;
      padding: 10px;
      direction: ${direction};
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      border-bottom: 1px dashed #ccc;
      padding: 5px;
      text-align: center;
    }
    h2 {
      text-align: center;
      margin-bottom: 5px;
    }
    .total {
      font-size: 16px;
      font-weight: bold;
      text-align: end;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h2>${title}</h2>
  <table>
    <thead>
      <tr>
        <th colspan="2">المنتج</th>
        <th>سعر الوحدة</th>
        <th>الكمية</th>
        <th>الإجمالي</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  <div class="total">total: ${total.toFixed(2)} SP</div>
</body>
</html>
  `;
}
