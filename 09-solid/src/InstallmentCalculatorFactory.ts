import { FreeInstallmentCalculator, PriceInstallmentCalculator, SACInstallmentCalculator } from "./InstallmentCalculator.ts";

export default class InstallmentCalculatorFactory {
    static create (type: string) {
        if (type === "PRICE") return new PriceInstallmentCalculator();
        if (type === "SAC") return new SACInstallmentCalculator();
        if (type === "FREE") return new FreeInstallmentCalculator();
        throw new Error("Invalid type");
    }
}