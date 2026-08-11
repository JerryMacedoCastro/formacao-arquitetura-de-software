import { test, expect } from "vitest";

import { mount } from "@vue/test-utils";
import App from "../../App.vue";

test("Deve validar o fluxo de preenchimento da tela de criação da conta", async () => {
  const wrapper = mount(App, {});
  expect(wrapper.get(".span-step").text()).toBe("1");
  expect(wrapper.get(".span-progress").text()).toBe("0%");
  await wrapper.get(".input-name").setValue("John Joe");
  expect(wrapper.get(".span-progress").text()).toBe("25%");
  await wrapper.get(".input-email").setValue("john.doe@gmail.com");
  expect(wrapper.get(".span-progress").text()).toBe("50%");
  await wrapper.get(".input-document").setValue("11111111111");
  expect(wrapper.get(".span-progress").text()).toBe("75%");
  await wrapper.get(".button-next").trigger("click");
  expect(wrapper.get(".span-step").text()).toBe("2");
  await wrapper.get(".input-password").setValue("asdQWE123");
  expect(wrapper.get(".span-progress").text()).toBe("75%");
  await wrapper.get(".input-confirm-password").setValue("asdQWE123");
  expect(wrapper.get(".span-progress").text()).toBe("100%");
});

test("Deve validar a visibilidade dos elementos da tela de criação de conta", async () => {
  const wrapper = mount(App, {});
  expect(wrapper.get(".span-step").text()).toBe("1");
  expect(wrapper.find(".input-name").exists()).toBe(true);
  expect(wrapper.find(".input-email").exists()).toBe(true);
  expect(wrapper.find(".input-document").exists()).toBe(true);
  expect(wrapper.find(".input-password").exists()).toBe(false);
  expect(wrapper.find(".input-confirm-password").exists()).toBe(false);
  expect(wrapper.find(".button-next").exists()).toBe(true);
  expect(wrapper.find(".button-previous").exists()).toBe(false);
  await wrapper.get(".button-next").trigger("click");
  expect(wrapper.get(".span-step").text()).toBe("2");
  expect(wrapper.find(".input-name").exists()).toBe(false);
  expect(wrapper.find(".input-email").exists()).toBe(false);
  expect(wrapper.find(".input-document").exists()).toBe(false);
  expect(wrapper.find(".input-password").exists()).toBe(true);
  expect(wrapper.find(".input-confirm-password").exists()).toBe(true);
  expect(wrapper.find(".button-next").exists()).toBe(false);
  expect(wrapper.find(".button-previous").exists()).toBe(true);
  await wrapper.get(".button-previous").trigger("click");
  expect(wrapper.get(".span-step").text()).toBe("1");
  expect(wrapper.find(".input-name").exists()).toBe(true);
  expect(wrapper.find(".input-email").exists()).toBe(true);
  expect(wrapper.find(".input-document").exists()).toBe(true);
  expect(wrapper.find(".input-password").exists()).toBe(false);
  expect(wrapper.find(".input-confirm-password").exists()).toBe(false);
  expect(wrapper.find(".button-next").exists()).toBe(true);
  expect(wrapper.find(".button-previous").exists()).toBe(false);
});
