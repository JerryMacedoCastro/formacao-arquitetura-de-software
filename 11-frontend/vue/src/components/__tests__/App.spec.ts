import { test, expect } from "vitest";

import { mount } from "@vue/test-utils";
import App from "../../App.vue";

test("Deve criar uma conta", async () => {
  const wrapper = mount(App, {});
  expect(wrapper.get(".span-step").text()).toBe("1");
  expect(wrapper.get(".span-progress").text()).toBe("0%");
  await wrapper.get(".input-name").setValue("John Joe");
  expect(wrapper.get(".span-progress").text()).toBe("25%");
  await wrapper.get(".button-next").trigger("click");
  expect(wrapper.get(".span-step").text()).toBe("2");
});
