import { Column } from '@react-email/column';
import { Img } from '@react-email/img';
import { Row } from '@react-email/row';
import { Text } from '@react-email/text';
import React from 'react';

interface OrderItemProps {
  imageUrl: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  imageUrl,
  name,
  quantity,
  price,
  total,
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Row className="border-b border-gray-200 py-5">
      <Column className="w-20">
        <Img
          src={imageUrl}
          alt={name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </Column>
      <Column className="align-top pl-4">
        <Text className="text-sm font-semibold text-gray-900 m-0 mb-2">
          {name}
        </Text>
        <Text className="text-xs text-gray-600 m-0">
          Quantity: {quantity} × {formatCurrency(price)}
        </Text>
      </Column>
      <Column className="w-24 text-right align-top">
        <Text className="text-sm font-semibold text-gray-900 m-0">
          {formatCurrency(total)}
        </Text>
      </Column>
    </Row>
  );
};
