import { Hr } from '@react-email/hr';
import { Link } from '@react-email/link';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import React from 'react';

interface FooterProps {
  storeName?: string;
  supportEmail?: string;
  websiteUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  storeName = 'IG Gifts',
  supportEmail = 'suporte@ig-gifts.ian.dev.br',
  websiteUrl = 'https://ig-gifts.ian.dev.br',
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Section className="bg-white rounded-b-lg px-8 py-6">
      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm text-gray-600 text-center mb-4">
        Need help? Contact us at{' '}
        <Link
          href={`mailto:${supportEmail}`}
          className="text-red-600 underline"
        >
          {supportEmail}
        </Link>
      </Text>

      <Text className="text-xs text-gray-500 text-center mb-2">
        © {currentYear} {storeName}. All rights reserved.
      </Text>

      <Text className="text-xs text-gray-500 text-center m-0">
        <Link href={websiteUrl} className="text-gray-500 underline">
          Visit our store
        </Link>
        {' • '}
        <Link href={`${websiteUrl}/privacy-policy`} className="text-gray-500 underline">
          Privacy Policy
        </Link>
        {' • '}
        <Link href={`${websiteUrl}/terms`} className="text-gray-500 underline">
          Terms of Use
        </Link>
      </Text>
    </Section>
  );
};
