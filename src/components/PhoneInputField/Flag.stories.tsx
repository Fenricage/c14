import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Flag from './Flag';
import Countries from './countries';

export default {
  component: Flag,
  argTypes: {
    country: { control: 'select', options: Countries },
  },
} as ComponentMeta<typeof Flag>;

const Template: ComponentStory<typeof Flag> = (args) => <Flag {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  country: Countries[0],
};
