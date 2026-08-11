import { test, expect } from "vitest";

import { mount } from "@vue/test-utils";
import App from "../../App.vue";

test("Deve criar uma conta", async () => {
  const wrapper = mount(App, {});
  expect(wrapper.get(".span-step").text()).toBe("1");
  await wrapper.get(".button-next").trigger("click");
  expect(wrapper.get(".span-step").text()).toBe("2");
});
