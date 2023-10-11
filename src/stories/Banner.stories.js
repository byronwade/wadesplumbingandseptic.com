import Banner from "../components/ui/Banner";

export default {
	title: "Components/Banner",
	component: Banner,
	argTypes: {
		backgroundColor: {
			options: ["default", "green", "red"],
			control: { type: "color" },
		},
	},
};

// Templates
const Template = (args) => <Banner {...args} />;

// Default Banner
export const Default = Template.bind({});
Default.args = {
	message: "Default banner message goes here.",
};

// Green Alert
export const GreenAlert = Template.bind({});
GreenAlert.args = {
	backgroundColor: "green",
	message: "Great news! We have expanded our services.",
};

// Red Alert
export const RedAlert = Template.bind({});
RedAlert.args = {
	backgroundColor: "red",
	message: "Attention: We will be closed on public holidays.",
};

// Custom Content
export const CustomContent = Template.bind({});
CustomContent.args = {
	message: (
		<span>
			<strong>Special Offer:</strong> Get a 10% discount this summer!
		</span>
	),
};
