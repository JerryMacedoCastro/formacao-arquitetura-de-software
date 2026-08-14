import crypto from "crypto";
import type ContractData from "./ContractData.ts";

export default class ContractService {

    constructor (readonly contractData: ContractData) {
    }

    async processContract (input: any): Promise<any> {
        if (!input.customerName) {
            throw new Error("Invalid customer name");
        }
        if (!input.propertyValue || input.propertyValue <= 0) {
            throw new Error("Invalid property value");
        }
        if (input.downPayment === undefined || input.downPayment < 0 || input.downPayment >= input.propertyValue) {
            throw new Error("Invalid down payment");
        }
        if (!input.interestRate || input.interestRate <= 0) {
            throw new Error("Invalid interest rate");
        }
        if (!Number.isInteger(input.numberOfInstallments) || input.numberOfInstallments <= 0) {
            throw new Error("Invalid number of installments");
        }
        if (input.type !== "PRICE" && input.type !== "SAC") {
            throw new Error("Invalid financing type");
        }
    
        const contract: any = {...input};
        contract.contractId = crypto.randomUUID();
        contract.financedAmount = input.propertyValue - input.downPayment;
        contract.monthlyInterestRate = input.interestRate / 100;
        contract.installments = [] as Installment[];
        let balance = contract.financedAmount;
    
        if (input.type === "PRICE") {
            const factor = Math.pow(1 + contract.monthlyInterestRate, input.numberOfInstallments);
            const fixedAmount = contract.financedAmount * (contract.monthlyInterestRate * factor) / (factor - 1);
            for (let installmentNumber = 1; installmentNumber <= input.numberOfInstallments; installmentNumber++) {
                const interest = balance * contract.monthlyInterestRate;
                const amortization = installmentNumber === input.numberOfInstallments ? balance : fixedAmount - interest;
                const amount = amortization + interest;
                balance -= amortization;
                contract.installments.push({
                    installmentNumber,
                    amount: Math.round(amount * 100) / 100,
                    interest: Math.round(interest * 100) / 100,
                    amortization: Math.round(amortization * 100) / 100,
                    balance: Math.round(Math.max(balance, 0) * 100) / 100
                });
            }
        }
    
        if (input.type === "SAC") {
            const fixedAmortization = contract.financedAmount / input.numberOfInstallments;
            for (let installmentNumber = 1; installmentNumber <= input.numberOfInstallments; installmentNumber++) {
                const interest = balance * contract.monthlyInterestRate;
                const amortization = installmentNumber === input.numberOfInstallments ? balance : fixedAmortization;
                const amount = amortization + interest;
                balance -= amortization;
                contract.installments.push({
                    installmentNumber,
                    amount: Math.round(amount * 100) / 100,
                    interest: Math.round(interest * 100) / 100,
                    amortization: Math.round(amortization * 100) / 100,
                    balance: Math.round(Math.max(balance, 0) * 100) / 100
                });
            }
        }
    
        await this.contractData.saveContractAndInstallments(contract);
    
        return {
            contractId: contract.contractId,
            financedAmount: contract.financedAmount,
            type: input.type,
            installments: contract.installments
        }
    
    }
}

type Installment = { installmentNumber: number, amount: number, interest: number, amortization: number, balance: number };

