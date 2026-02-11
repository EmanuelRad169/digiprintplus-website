/**
 * Example test file
 * This ensures Jest configuration is working correctly
 */

describe("Jest Setup", () => {
  it("should run tests", () => {
    expect(true).toBe(true);
  });

  it("should have jest-dom matchers available", () => {
    const element = document.createElement("div");
    element.textContent = "Hello";
    document.body.appendChild(element);
    expect(element).toBeInTheDocument();
    document.body.removeChild(element);
  });
});
