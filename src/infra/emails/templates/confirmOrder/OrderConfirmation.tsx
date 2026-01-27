import { Hr } from '@react-email/hr';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import React from 'react';

import { Button } from '../../components/Button';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { Layout } from '../../components/Layout';
import { OrderItem } from '../../components/OrderItem';
import { OrderSummary } from '../../components/OrderSummary';

export interface OrderConfirmationProps {
  customerName: string;
  orderId: string;
  orderDate: string;
  items: Array<{
    imageUrl: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  estimatedDelivery?: string;
  trackingUrl?: string;
  orderDetailsUrl: string;
  storeName?: string;
  logoUrl?: string;
  supportEmail?: string;
  websiteUrl?: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  customerName,
  orderId,
  orderDate,
  items,
  subtotal,
  shipping,
  discount,
  total,
  shippingAddress,
  estimatedDelivery,
  trackingUrl,
  orderDetailsUrl,
  storeName = 'IG Gifts',
  logoUrl,
  supportEmail = 'suporte@ig-gifts.ian.dev.br',
  websiteUrl = 'https://ig-gifts.ian.dev.br',
}) => {
  const formatZipCode = (zipCode: string): string => {
    return zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout preview={`Pedido #${orderId} confirmado - ${storeName}`}>
      <Header storeName={storeName} logoUrl={logoUrl} />

      <Section className="bg-white px-8 py-10">
        <div className="text-center mb-8">
          <table style={{ width: '100%', marginBottom: '16px' }}>
            <tr>
              <td style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-block',
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '50%',
                  textAlign: 'center',
                  lineHeight: '64px',
                  fontSize: '32px'
                }}>
                  ✓
                </div>
              </td>
            </tr>
          </table>
          <Text className="text-2xl font-bold text-gray-900 m-0 mb-2">
            Order Confirmed!
          </Text>
          <Text className="text-base text-gray-600 m-0">
            Hello, {customerName}! We've received your order and are already
            preparing everything with great care.
          </Text>
        </div>

        <div className="bg-red-50 rounded-lg px-6 py-5 mb-8">
          <table style={{ width: '100%', marginBottom: '12px' }}>
            <tr>
              <td>
                <Text className="text-sm text-gray-700 m-0">Order number</Text>
              </td>
              <td style={{ textAlign: 'right' }}>
                <Text className="text-sm font-bold text-gray-900 m-0">
                  #{orderId}
                </Text>
              </td>
            </tr>
          </table>
          <table style={{ width: '100%' }}>
            <tr>
              <td>
                <Text className="text-sm text-gray-700 m-0">Order date</Text>
              </td>
              <td style={{ textAlign: 'right' }}>
                <Text className="text-sm font-semibold text-gray-900 m-0">
                  {formatDate(orderDate)}
                </Text>
              </td>
            </tr>
          </table>
        </div>

        <Section className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4 mt-0">
            Order Items
          </Text>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-2">
              {items.map((item, index) => (
                <OrderItem
                  key={index}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  quantity={item.quantity}
                  price={item.price}
                  total={item.total}
                />
              ))}
            </div>
          </div>

          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
          />
        </Section>

        <Section className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4 mt-0">
            Shipping Address
          </Text>
          <div className="bg-gray-50 rounded-lg px-6 py-5">
            <Text className="text-sm text-gray-900 m-0 mb-2">
              {shippingAddress.street}, {shippingAddress.number}
              {shippingAddress.complement && ` - ${shippingAddress.complement}`}
            </Text>
            <Text className="text-sm text-gray-900 m-0 mb-2">
              {shippingAddress.neighborhood}
            </Text>
            <Text className="text-sm text-gray-900 m-0">
              {shippingAddress.city} - {shippingAddress.state},{' '}
              {formatZipCode(shippingAddress.zipCode)}
            </Text>

            {estimatedDelivery && (
              <>
                <Hr className="border-gray-300 my-4" />
                <Text className="text-sm text-gray-700 m-0">
                  <span className="font-semibold">Estimated delivery:</span>{' '}
                  {formatDate(estimatedDelivery)}
                </Text>
              </>
            )}
          </div>
        </Section>

        <Section className="text-center mb-8">
          <Button href={orderDetailsUrl} variant="primary">
            View Order Details
          </Button>

          {trackingUrl && (
            <div className="mt-4">
              <Button href={trackingUrl} variant="secondary">
                Track Order
              </Button>
            </div>
          )}
        </Section>

        <Section className="bg-blue-50 border-l-4 border-blue-400 rounded px-6 py-5">
          <Text className="text-sm text-gray-800 m-0 mb-3">
            <strong>Next steps:</strong>
          </Text>
          <Text className="text-sm text-gray-700 m-0 mb-2">
            • You will receive an email once payment is confirmed
          </Text>
          <Text className="text-sm text-gray-700 m-0 mb-2">
            • After payment confirmation, your order will be prepared and
            shipped
          </Text>
          <Text className="text-sm text-gray-700 m-0">
            • We will send the tracking code once the order is dispatched
          </Text>
        </Section>
      </Section>

      <Footer
        storeName={storeName}
        supportEmail={supportEmail}
        websiteUrl={websiteUrl}
      />
    </Layout>
  );
};

export default OrderConfirmation;
