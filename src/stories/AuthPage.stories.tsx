import type { Meta } from '@storybook/react';
import AuthPage from '../components/AuthPage';

const meta: Meta<typeof AuthPage> = {
    title: 'Components/AuthPage',
    component: AuthPage,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = () => <AuthPage />;
