import { test, expect } from "vitest";

import { mount } from "@vue/test-utils";
import App from "../../App.vue";

test("Deve criar uma conta", async () => {
  const wrapper = mount(App, {});
  expect(wrapper.get(".span-step").text()).toBe("1");
  expect(wrapper.get(".span-progress").text()).toBe("0%");
  await wrapper.get(".input-name").setValue("John Joe");
  expect(wrapper.get(".span-progress").text()).toBe("25%");
  await wrapper.get(".input-email").setValue("john.doe@gmail.com");
  expect(wrapper.get(".span-progress").text()).toBe("50%");
  await wrapper.get(".input-document").setValue("11111111111");
  expect(wrapper.get(".span-progress").text()).toBe("75%");
  await wrapper.get(".input-password").setValue("asdQWE123");
  await wrapper.get(".input-confirm-password").setValue("asdQWE123");
  expect(wrapper.get(".span-progress").text()).toBe("100%");
  await wrapper.get(".button-next").trigger("click");
  expect(wrapper.get(".span-step").text()).toBe("2");
});
