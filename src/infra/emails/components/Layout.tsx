import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Preview } from '@react-email/preview';
import { Tailwind } from '@react-email/tailwind';
import React from 'react';

import { tailwindConfig } from './tailwind.config';

interface LayoutProps {
  children: React.ReactNode;
  preview: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, preview }) => {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Preview>{preview}</Preview>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {children}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
