import type Contract from "./Contract.ts";
import type { Installment } from "./ContractService.ts";

export default interface InstallmentCalculator {
    calculate (contract: Contract): Installment[];
}

export class PriceInstallmentCalculator implements InstallmentCalculator {

    calculate(contract: Contract): Installment[] {
        const installments: Installment[] = [];
        let balance = contract.getFinancedAmount();
        const factor = Math.pow(1 + contract.getMonthlyInterestRate(), contract.numberOfInstallments);
        const fixedAmount = (contract.getMonthlyInterestRate() === 0) ? (contract.getFinancedAmount()/contract.numberOfInstallments) : (contract.getFinancedAmount() * (contract.getMonthlyInterestRate() * factor) / (factor - 1));
        for (let installmentNumber = 1; installmentNumber <= contract.numberOfInstallments; installmentNumber++) {
            const interest = balance * contract.getMonthlyInterestRate();
            const amortization = installmentNumber === contract.numberOfInstallments ? balance : fixedAmount - interest;
            const amount = amortization + interest;
            balance -= amortization;
            installments.push({
                installmentNumber,
                amount: Math.round(amount * 100) / 100,
                interest: Math.round(interest * 100) / 100,
                amortization: Math.round(amortization * 100) / 100,
                balance: Math.round(Math.max(balance, 0) * 100) / 100
            });
        }
        return installments;
    }

}

export class SACInstallmentCalculator implements InstallmentCalculator {

    calculate(contract: Contract): Installment[] {
        const installments: Installment[] = [];
        let balance = contract.getFinancedAmount();
        const fixedAmortization = contract.getFinancedAmount() / contract.numberOfInstallments;
        for (let installmentNumber = 1; installmentNumber <= contract.numberOfInstallments; installmentNumber++) {
            const interest = balance * contract.getMonthlyInterestRate();
            const amortization = installmentNumber === contract.numberOfInstallments ? balance : fixedAmortization;
            const amount = amortization + interest;
            balance -= amortization;
            installments.push({
                installmentNumber,
                amount: Math.round(amount * 100) / 100,
                interest: Math.round(interest * 100) / 100,
                amortization: Math.round(amortization * 100) / 100,
                balance: Math.round(Math.max(balance, 0) * 100) / 100
            });
        }
        return installments;
    }

}

export class FreeInstallmentCalculator implements InstallmentCalculator {

    calculate(contract: Contract): Installment[] {
        const installments: Installment[] = [];
        let balance = contract.getFinancedAmount();
        const amortization = contract.getFinancedAmount()/contract.numberOfInstallments;
        for (let installmentNumber = 1; installmentNumber <= contract.numberOfInstallments; installmentNumber++) {
            balance -= amortization;
            installments.push({
                installmentNumber,
                amount: Math.round(Math.max(amortization, 0) * 100) / 100,
                interest: 0,
                amortization: Math.round(Math.max(amortization, 0) * 100) / 100,
                balance: Math.round(Math.max(balance, 0) * 100) / 100
            });
        }
        return installments;
    }

}
