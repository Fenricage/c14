import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Modal from './Modal';
import { mockFn, withProvider, mockStore } from '../../utils/storybook';
import { createStoreWithMiddlewares } from '../../app/store';
import { widgetModalStyles } from '../../theme/components';

const store = createStoreWithMiddlewares(mockStore);

export default {
  component: Modal,
  decorators: [withProvider.bind(null, store)],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: 'This is modal children',
  onClickClose: mockFn,
  isOpen: true,
  parentSelector: () => document.body,
  title: 'Modal title',
  style: widgetModalStyles,
};
