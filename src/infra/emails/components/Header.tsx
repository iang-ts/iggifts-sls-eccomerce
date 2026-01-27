import { Img } from '@react-email/img';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import React from 'react';

interface HeaderProps {
  storeName?: string;
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  storeName = 'IG Gifts',
  logoUrl,
}) => {
  return (
    <Section className="bg-white rounded-t-lg px-8 py-6 border-b-4 border-red-600">
      <div className="text-center">
        {logoUrl ? (
          <Img
            src={logoUrl}
            alt={storeName}
            className="mx-auto h-12 w-auto"
          />
        ) : (
          <Text className="text-2xl font-bold text-red-600 m-0">
            {storeName}
          </Text>
        )}
      </div>
    </Section>
  );
};
