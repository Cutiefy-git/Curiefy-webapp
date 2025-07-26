// src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderPlacedEmail, sendNewOrderNotification, sendOrderDispatchedEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'order-placed':
        await sendOrderPlacedEmail(data);
        await sendNewOrderNotification(data);
        break;
      
      case 'order-dispatched':
        await sendOrderDispatchedEmail(data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}