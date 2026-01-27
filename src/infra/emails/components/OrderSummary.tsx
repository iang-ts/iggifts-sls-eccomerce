import { Column } from '@react-email/column';
import { Row } from '@react-email/row';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  discount = 0,
  total,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Section className="bg-gray-50 rounded-lg px-6 py-5 mt-6">
      <Row className="mb-3">
        <Column>
          <Text className="text-sm text-gray-700 m-0">Subtotal</Text>
        </Column>
        <Column className="text-right">
          <Text className="text-sm text-gray-900 m-0">
            {formatCurrency(subtotal)}
          </Text>
        </Column>
      </Row>

      <Row className="mb-3">
        <Column>
          <Text className="text-sm text-gray-700 m-0">Shipping</Text>
        </Column>
        <Column className="text-right">
          <Text className="text-sm text-gray-900 m-0">
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </Text>
        </Column>
      </Row>

      {discount > 0 && (
        <Row className="mb-3">
          <Column>
            <Text className="text-sm text-green-600 m-0">Discount</Text>
          </Column>
          <Column className="text-right">
            <Text className="text-sm text-green-600 m-0">
              -{formatCurrency(discount)}
            </Text>
          </Column>
        </Row>
      )}

      <div className="border-t border-gray-300 my-4" />

      <Row>
        <Column>
          <Text className="text-lg font-bold text-gray-900 m-0">Total</Text>
        </Column>
        <Column className="text-right">
          <Text className="text-lg font-bold text-red-600 m-0">
            {formatCurrency(total)}
          </Text>
        </Column>
      </Row>
    </Section>
  );
};
