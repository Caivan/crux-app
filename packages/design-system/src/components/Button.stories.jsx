import { Button } from './Button.jsx';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Log a send', variant: 'primary' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    icon: { control: false },
  },
};

export default meta;

export const Primary = {};
export const Secondary = { args: { variant: 'secondary', children: 'Cancel' } };
export const WithIcon = { args: { icon: '＋' } };
export const ButtonSet = {
  render: () => <div className="storybook-row"><Button>Log a send</Button><Button variant="secondary">Cancel</Button><Button icon="＋">Add a problem</Button></div>,
};
