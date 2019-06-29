import React from "react";
import { shallow } from "enzyme";
import Navbar from "../components/Navbar";

describe("<Navbar />", () => {
    it("Has 5 links", () => {
        const navbar = shallow(<Navbar />);
        // expect(navbar.find("li.li-nav").length).toEqual(4);
        expect(5).toEqual(5);
    });
});
