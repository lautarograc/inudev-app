import type { Meta, StoryObj } from '@storybook/react';
import TodoTree from '../components/TodoTree';
import { mockData } from '../__mocks__/mockData';

const meta: Meta<typeof TodoTree> = {
    title: 'Components/TodoTree',
    component: TodoTree,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

type Story = StoryObj<typeof TodoTree>;

export const Default: Story = {
    args: {
        todos: mockData,
    },
};
