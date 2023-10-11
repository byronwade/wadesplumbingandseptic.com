import Button from "../components/ui/Button";

export default {
	title: "Components/Button",
	component: Button,
	argTypes: {
		variant: {
			options: ["default", "primary", "secondary"],
			control: { type: "radio" },
		},
		size: {
			options: ["small", "medium", "large"],
			control: { type: "radio" },
		},
	},
};

export const Accessible = () => <button>Accessible button</button>;

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: "Default Button",
};

export const Primary = Template.bind({});
Primary.args = {
	variant: "primary",
	children: "Primary Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
	variant: "secondary",
	children: "Secondary Button",
};

export const Small = Template.bind({});
Small.args = {
	size: "small",
	children: "Small Button",
};

export const Large = Template.bind({});
Large.args = {
	size: "large",
	children: "Large Button",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
	icon: (
		<span role="img" aria-label="emoji">
			🚀
		</span>
	),
	children: "Button with Icon",
};

export const Loading = Template.bind({});
Loading.args = {
	loading: true,
	children: "Loading Button",
};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
	children: "Disabled Button",
};

export const LinkButton = Template.bind({});
LinkButton.args = {
	href: "/contact",
	children: "Link Button",
};
