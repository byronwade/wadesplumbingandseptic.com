describe("Header Component", () => {
	beforeEach(() => {
		// Visit the home page before each test case
		cy.visit("http://localhost:3002/");
	});

	it("should render the logo correctly", () => {
		cy.get("h1").contains("Wades Plumbing & Septic");
	});

	it("should have a functional Home link", () => {
		cy.get("a").contains("Home").click();
		cy.url().should("eq", "http://localhost:3002/");
	});

	it("should have a functional Services link", () => {
		cy.get("a").contains("Services").click();
		cy.url().should("eq", "http://localhost:3002/services");
	});

	it("should display menu when menu button is clicked", () => {
		cy.get("button").contains("Expert Tips").click();
		cy.get("button").contains("Expert Tips").should("be.visible");
	});

	// Add more tests as needed...
});
