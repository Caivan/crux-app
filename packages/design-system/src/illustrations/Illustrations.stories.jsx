import { Avatar, BoulderIcon, ChalkBagIcon, CrewIcon, HoldIcon } from '../components/Illustration.jsx';
import { climberColors } from './index.js';

const grades = ['Green', 'Yellow', 'Blue', 'Red', 'Gray', 'Black'];

const meta = { title: 'Illustrations/Climbing', tags: ['autodocs'] };
export default meta;

export const GradeHolds = {
  render: () => <div className="storybook-row">{grades.map((grade) => <div className="storybook-stack" style={{ justifyItems: 'center' }} key={grade}><HoldIcon grade={grade} /><span>{grade}</span></div>)}</div>,
};

export const RouteAndGear = {
  render: () => <div className="storybook-row"><BoulderIcon grade="Blue" /><ChalkBagIcon /><CrewIcon /></div>,
};

export const MemberAvatars = {
  render: () => <div className="storybook-row storybook-avatar">{['Maya', 'You', 'Jonas', 'Leo', 'Ivancho'].map((name, index) => <div className="storybook-stack" style={{ justifyItems: 'center' }} key={name}><Avatar person={{ name, color: index % climberColors.length }} /><span>{name}</span></div>)}</div>,
};
