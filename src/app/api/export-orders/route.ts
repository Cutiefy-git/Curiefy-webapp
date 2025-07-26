// src/app/api/export-orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // Fetch all dispatched orders
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('status', '==', 'dispatched'));
    const snapshot = await getDocs(q);

    // Create CSV headers
    const headers = [
      'Order ID',
      'Customer Name',
      'Contact',
      'Email',
      'Address',
      'Items',
      'Order Value',
      'Delivery Charges',
      'Discount Applied',
      'Payment Received',
      'Order Date',
      'Dispatch Date'
    ];

    // Create CSV rows
    const rows: string[][] = [];
    
    snapshot.forEach((doc) => {
      const order = doc.data();
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      const dispatchDate = order.dispatchedAt?.toDate ? order.dispatchedAt.toDate() : new Date(order.dispatchedAt);
      
      // Format items
      const items = order.cartItems
        .map((item: any) => `${item.name} x${item.quantity}`)
        .join('; ');
      
      rows.push([
        doc.id,
        order.customerName,
        order.contact,
        order.email,
        `"${order.address.replace(/"/g, '""')}"`, // Escape quotes in address
        `"${items}"`,
        order.orderValue.toString(),
        (order.deliveryCharges || 0).toString(),
        (order.discountApplied || 0).toString(),
        order.paymentReceived.toString(),
        orderDate.toLocaleDateString('en-IN'),
        dispatchDate.toLocaleDateString('en-IN')
      ]);
    });

    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="dispatched-orders-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting orders:', error);
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    );
  }
}