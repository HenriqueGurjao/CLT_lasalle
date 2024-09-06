import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

describe("home Page", () => {
  
  it("renders the home page", () => {
    render(<Home />);
    expect(screen.getByText("Templates")).toBeInTheDocument();
  });
})
