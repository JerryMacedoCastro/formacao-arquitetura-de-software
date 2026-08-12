import SignupForm from "@/entities/SignupForm";
import { test, expect, beforeEach } from "vitest";

test("Deve validar o progresso no preenchimento da tela de criação da conta", async () => {
  const form = new SignupForm();
  expect(form.step).toBe(1);
  expect(form.getProgress()).toBe(0);
  form.name = "John Doe";
  expect(form.getProgress()).toBe(25);
  form.email = "john.doe@gmail.com";
  expect(form.getProgress()).toBe(50);
  form.document = "11111111111";
  expect(form.getProgress()).toBe(75);
  form.password = "asdQWE123"
  expect(form.getProgress()).toBe(75);
  form.confirmPassword = "asdQWE";
  expect(form.getProgress()).toBe(75);
  form.confirmPassword = "asdQWE123";
  expect(form.getProgress()).toBe(100);
});

test("Deve validar o fluxo de mensagens de erro de preenchimento da tela de criação da conta", async () => {
    const form = new SignupForm();
    form.next();
    expect(form.error).toBe("Preencha o nome");
    form.name = "John Doe";
    form.next();
    expect(form.error).toBe("Preencha o email");
    form.email = "john.doe@gmail.com";
    form.next();
    expect(form.error).toBe("Preencha o documento");
    form.document = "11111111111";
    form.next();
    form.confirm();
    expect(form.error).toBe("Preencha a senha");
    form.password = "asdQWE123"
    form.confirm();
    expect(form.error).toBe("Preencha a confirmação da senha");
    form.confirmPassword = "asdQWE"
    form.confirm();
    expect(form.error).toBe("A senha e a confirmação da senha devem ser iguais");
    form.confirmPassword = "asdQWE123"
    form.confirm();
    expect(form.error).toBe("");
});
