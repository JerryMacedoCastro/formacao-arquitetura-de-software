import type Installment from "./Installment.ts";
import InstallmentCalculatorFactory from "./InstallmentCalculatorFactory.ts";

export default class Contract {
    installments: Installment[] = [];

    constructor (readonly contractId: string, readonly customerName: string, readonly propertyValue: number, readonly downPayment: number, readonly interestRate: number, readonly numberOfInstallments: number, readonly type: string) {
        if (!customerName) throw new Error("Invalid customer name");
        if (!propertyValue || propertyValue <= 0) throw new Error("Invalid property value");
        if (downPayment === undefined || downPayment < 0 || downPayment >= propertyValue) throw new Error("Invalid down payment");
        if (interestRate < 0) throw new Error("Invalid interest rate");
        if (!Number.isInteger(numberOfInstallments) || numberOfInstallments <= 0) throw new Error("Invalid number of installments");
        if (type !== "PRICE" && type !== "SAC" && type !== "FREE") throw new Error("Invalid financing type");
    }

    static create (customerName: string, propertyValue: number, downPayment: number, interestRate: number, numberOfInstallments: number, type: string) {
        const contractId = crypto.randomUUID();
        return new Contract(contractId, customerName, propertyValue, downPayment, interestRate, numberOfInstallments, type);
    }

    getFinancedAmount () {
        return this.propertyValue - this.downPayment;
    }

    getMonthlyInterestRate () {
        return this.interestRate / 100
    }

    calculateInstallments () {
        const installmentCalculator = InstallmentCalculatorFactory.create(this.type);
        this.installments = installmentCalculator.calculate(this);
    }
}