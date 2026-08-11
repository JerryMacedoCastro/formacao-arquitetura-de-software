import { test, expect } from "vitest";

import { mount } from "@vue/test-utils";
import App from "../../App.vue";

test("Deve criar uma conta", () => {
  const wrapper = mount(App, {});
  expect(wrapper.text()).toContain("branas.io");
});
