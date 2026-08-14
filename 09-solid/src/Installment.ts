export default class Installment {

    constructor (readonly installmentNumber: number, readonly amount: number, readonly interest: number, readonly amortization: number, readonly balance: number) {
    }
}
