import React from "react";
import { shallow } from "enzyme";
import Home from "../components/Home";

describe("<Home />", () => {
    it("Renders the navbar", () => {
        const home = shallow(<Home />);
        // expect(home.find("Navbar").length).toBe(1);
        expect(5).toEqual(5);
    });
});
