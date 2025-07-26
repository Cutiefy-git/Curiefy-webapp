// src/lib/email.ts
import nodemailer from 'nodemailer';

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderValue: number;
  cartItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  orderId?: string;
  contact?: string;
  deliveryCharges?: number;
  discountApplied?: number;
  paymentReceived?: number;
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const getOrderPlacedTemplate = (data: OrderEmailData): string => {
  const itemsList = data.cartItems
    .map(item => `<li>${item.name} x${item.quantity} - ₹${item.price}</li>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #2C2C2C; }
          h1 { color: #D4AF37; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #F8D4DC; padding: 20px; text-align: center; }
          .content { background-color: #FFF8F4; padding: 20px; }
          ul { list-style-type: none; padding: 0; }
          li { padding: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for your order, ${data.customerName}!</h1>
          </div>
          <div class="content">
            <p>We've received your order with value ₹${data.orderValue}.</p>
            <ul>${itemsList}</ul>
            <p>We will contact you shortly for payment details.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const getNewOrderNotificationTemplate = (data: OrderEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Order from ${data.customerName}</h1>
          <p>Order ID: ${data.orderId}</p>
          <p>Value: ₹${data.orderValue}</p>
          <p>Contact: ${data.contact}, ${data.customerEmail}</p>
        </div>
      </body>
    </html>
  `;
};

const getOrderDispatchedTemplate = (data: OrderEmailData): string => {
  const itemsRows = data.cartItems
    .map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #2C2C2C; }
          h1 { color: #D4AF37; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #F8D4DC; padding: 20px; text-align: center; }
          .content { background-color: #FFF8F4; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #FAD6C4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your order is on its way, ${data.customerName}!</h1>
          </div>
          <div class="content">
            <table>
              <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
              ${itemsRows}
            </table>
            <p>Subtotal: ₹${data.orderValue}</p>
            <p>Delivery Charges: ₹${data.deliveryCharges || 0}</p>
            <p>Discount: ₹${data.discountApplied || 0}</p>
            <p><strong>Total Paid: ₹${data.paymentReceived}</strong></p>
            <p>Thank you for shopping with Cutiefy!</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Email sending functions
export const sendOrderPlacedEmail = async (data: OrderEmailData): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.customerEmail,
      subject: 'Order Confirmation - Cutiefy',
      html: getOrderPlacedTemplate(data),
    });
  } catch (error) {
    console.error('Failed to send order placed email:', error);
    throw error;
  }
};

export const sendNewOrderNotification = async (data: OrderEmailData): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order - ${data.customerName}`,
      html: getNewOrderNotificationTemplate(data),
    });
  } catch (error) {
    console.error('Failed to send new order notification:', error);
    throw error;
  }
};

export const sendOrderDispatchedEmail = async (data: OrderEmailData): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.customerEmail,
      subject: 'Order Dispatched - Cutiefy',
      html: getOrderDispatchedTemplate(data),
    });
  } catch (error) {
    console.error('Failed to send order dispatched email:', error);
    throw error;
  }
};