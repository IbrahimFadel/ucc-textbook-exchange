import React from "react";
import { shallow } from "enzyme";
import Login from "../components/Login";

describe("<Navbar />", () => {
    it("Has 5 links", () => {
        const login = shallow(<Login />);
        expect(login.find("form").length).toEqual(1);
    });
});
