describe("Jobs Page Tests", () => {
	// Before each test, we'll visit the jobs page
	beforeEach(() => {
		cy.visit("http://localhost:3002/about-us/jobs"); // Update this if the path is different
	});

	it("should load job listings", () => {
		cy.get("h3").its("length").should("be.gt", 0); // Ensure there's at least one job listed
	});

	it("should display job details when clicked", () => {
		// Assuming that the title of the job is wrapped in an <h3> element and links to the job details.
		cy.get("h3").first().click();

		// Check for the presence of job details here, you can check for a specific element or content.
		cy.get("div").should("contain.text", "Benefits"); // Replace this with appropriate selectors or text.
	});

	it("should have a working apply button", () => {
		cy.get("a").contains("Apply Now").should("be.visible").click();
		// Add further assertions to check the behavior after clicking the apply button
	});
});
