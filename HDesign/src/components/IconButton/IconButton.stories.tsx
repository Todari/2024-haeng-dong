/** @jsxImportSource @emotion/react */
import type {Meta, StoryObj} from '@storybook/react';

import IconButton from '@components/IconButton/IconButton';
import Icon from '@components/Icon/Icon';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      description: '',
      control: {type: 'select'},
      options: ['large', 'medium', 'small'],
    },
    variants: {
      description: '',
      control: {type: 'select'},
      options: ['none', 'primary', 'secondary', 'tertiary', 'destructive'],
    },
    children: {
      description: '',
      control: {type: 'select'},
      options: [
        <Icon iconType="inputDelete" />,
        <Icon iconType="buljusa" />,
        <Icon iconType="rightChevron" />,
        <Icon iconType="search" />,
        <Icon iconType="error" />,
        <Icon iconType="trash" />,
      ],
    },
  },
  args: {
    size: 'medium',
    variants: 'destructive',
    children: <Icon iconType="trash" />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
