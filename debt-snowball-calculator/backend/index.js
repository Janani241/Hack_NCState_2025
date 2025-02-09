require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config({ path: "./backend/.env" });


const API_KEY = process.env.GEMINI_API_KEY;
console.log("GEMINI_API_KEY:", API_KEY);



// *********************HIGHEST INTEREST RATE FIRST********************************
const calculateDebtAvalanchePlan = (debts, income, expenses, savings) => {
    console.log("\ncalculateDebtAvalanchePlan\n")
    try { 
    let budget = income - expenses - savings; // Monthly available budget
    let totalMonths = 0;
    let sets = [];
    let totalInterestPaid = 0;
    let previousTotalDebt = debts.reduce((sum, d) => sum + d.balance, 0);

    if (budget <= 0) {
        console.error("🚨 Error: Not enough funds to make payments.");
        return { error: "Not enough funds to make payments." };
    }

    console.log("📌 Initial Input Debts:", JSON.stringify(debts, null, 2));
    console.log(`📊 Monthly Budget Available: ${budget}`);

    while (debts.some(debt => debt.balance > 0)) {
        totalMonths++;
        let remainingBudget = budget;
        let set = { set_number: totalMonths, payments: [] };

        console.log(`\n📅 Month ${totalMonths}:`);
        console.log(`💰 Starting Budget: ${remainingBudget}`);

        // 1️⃣ Apply interest before making payments
        debts.forEach(debt => {
            if (debt.balance > 0) {
                let monthlyInterest = (debt.interest / 100 / 12) * debt.balance;
                debt.balance += monthlyInterest;
                totalInterestPaid += monthlyInterest;
                console.log(`🧮 Interest added for ${debt.name}: $${monthlyInterest.toFixed(2)}`);
            }
        });

        // 2️⃣ Ensure minimum payments
        let totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
        if (totalMinimumPayments > budget) {
            console.error("🚨 ERROR: Budget cannot cover minimum payments.");
            return { error: "Budget insufficient to cover minimum payments." };
        }

        debts.forEach(debt => {
            if (debt.balance > 0) {
                let minPayment = Math.min(debt.minimumPayment, debt.balance);
                debt.balance -= minPayment;
                remainingBudget -= minPayment;
                set.payments.push({ name: debt.name, monthly_payment: minPayment });

                console.log(`✅ Minimum payment to ${debt.name}: $${minPayment.toFixed(2)}`);
            }
        });

        console.log(`📉 Budget after minimum payments: ${remainingBudget.toFixed(2)}`);

        // 3️⃣ Distribute remaining budget to highest-interest debts
        debts.sort((a, b) => b.interest - a.interest);

        while (remainingBudget > 0) {
            let unpaidDebts = debts.filter(debt => debt.balance > 0);
            if (unpaidDebts.length === 0) break;

            let extraPayment = Math.min(remainingBudget, unpaidDebts[0].balance);
            unpaidDebts[0].balance -= extraPayment;
            remainingBudget -= extraPayment;
            set.payments.push({ name: unpaidDebts[0].name, monthly_payment: extraPayment });

            console.log(`🚀 Extra payment to ${unpaidDebts[0].name}: $${extraPayment.toFixed(2)}`);
        }

        console.log(`🏁 Budget after extra payments: ${remainingBudget.toFixed(2)}`);
        console.log("📊 Remaining Debts:", JSON.stringify(debts, null, 2));

        sets.push(set);

        // Stop if debts aren't reducing
        let totalDebtNow = debts.reduce((sum, d) => sum + d.balance, 0);
        if (totalDebtNow >= previousTotalDebt) {
            console.error("🚨 ERROR: No debt progress. Repayment plan may be infeasible.");
            return { error: "Debt is not reducing. Increase budget or lower interest rates." };
        }
        previousTotalDebt = totalDebtNow;
    }

    console.log(`\n🎉 All debts cleared in ${totalMonths} months!`);
    console.log(`💸 Total Interest Paid: $${totalInterestPaid.toFixed(2)}`);

    return {
        total_months: totalMonths,
        total_interest_paid: totalInterestPaid.toFixed(2),
        sets: sets,
    };
}
    catch (error) {
        // Pass the error message for the frontend to display
        return { error: error.message };
    }
};

// *********************HIGHEST INTEREST AMOUNT FIRST********************************
const calculateDebtAvalancheSpecialPlan = (debts, income, expenses, savings) => {
    console.log("\calculateDebtAvalancheSpecialPlan\n")
    try {
    let budget = income - expenses-savings; // Monthly available budget
    let totalMonths = 0;
    let sets = [];
    let totalInterestPaid = 0;
    let previousTotalDebt = debts.reduce((sum, d) => sum + d.balance, 0);

    if (budget <= 0) {
        if (totalMinimumPayments > budget) {
            console.error("🚨 ERROR: Budget cannot cover minimum payments.");
            return {
                error: "Your budget is insufficient to cover the minimum payments. Please adjust your income, expenses, or savings.",
            };
        }
    }

    console.log("📌 Initial Input Debts:", JSON.stringify(debts, null, 2));
    console.log(`📊 Monthly Budget Available: ${budget}`);

    while (debts.some(debt => debt.balance > 0)) {
        totalMonths++;
        let remainingBudget = budget;
        let set = { set_number: totalMonths, payments: [] };

        console.log(`\n📅 Month ${totalMonths}:`);
        console.log(`💰 Starting Budget: ${remainingBudget}`);

        // 1️⃣ Apply interest and calculate interest amounts
        debts.forEach(debt => {
            if (debt.balance > 0) {
                let monthlyInterest = (debt.interest / 100 / 12) * debt.balance;
                debt.interestAmount = monthlyInterest; // Store interest amount for sorting
                debt.balance += monthlyInterest;
                totalInterestPaid+=monthlyInterest
                console.log(`🧮 Interest added for ${debt.name}: $${monthlyInterest.toFixed(2)}`);
            }
        });

        // 2️⃣ Ensure minimum payments
        let totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
        if (totalMinimumPayments > budget) {
            console.error("🚨 ERROR: Budget cannot cover minimum payments.");
            return { error: "Budget insufficient to cover minimum payments." };
        }

        debts.forEach(debt => {
            if (debt.balance > 0) {
                let minPayment = Math.min(debt.minimumPayment, debt.balance);
                debt.balance -= minPayment;
                remainingBudget -= minPayment;
                set.payments.push({ name: debt.name, monthly_payment: minPayment });

                console.log(`✅ Minimum payment to ${debt.name}: $${minPayment.toFixed(2)}`);
            }
        });

        console.log(`📉 Budget after minimum payments: ${remainingBudget.toFixed(2)}`);

        // 3️⃣ Sort debts by interest amount (highest first)
        debts.sort((a, b) => b.interestAmount - a.interestAmount);

        // 4️⃣ Distribute remaining budget based on interest amount
        while (remainingBudget > 0) {
            let unpaidDebts = debts.filter(debt => debt.balance > 0);
            if (unpaidDebts.length === 0) break;

            let extraPayment = Math.min(remainingBudget, unpaidDebts[0].balance);
            unpaidDebts[0].balance -= extraPayment;
            remainingBudget -= extraPayment;
            set.payments.push({ name: unpaidDebts[0].name, monthly_payment: extraPayment });

            console.log(`🚀 Extra payment to ${unpaidDebts[0].name}: $${extraPayment.toFixed(2)}`);
        }

        console.log(`🏁 Budget after extra payments: ${remainingBudget.toFixed(2)}`);
        console.log("📊 Remaining Debts:", JSON.stringify(debts, null, 2));

        sets.push(set);

        // Stop if debts aren't reducing
        let totalDebtNow = debts.reduce((sum, d) => sum + d.balance, 0);
        if (totalDebtNow >= previousTotalDebt) {
            console.error("🚨 ERROR: No debt progress. Repayment plan may be infeasible.");
            return { error: "Debt is not reducing. Increase budget or lower interest rates." };
        }
        previousTotalDebt = totalDebtNow;
    }

    console.log(`\n🎉 All debts cleared in ${totalMonths} months!`);
    console.log(`Total Interest Paid: $${totalInterestPaid.toFixed(2)}`); // Add this line to log total_interest_paid: totalInterestPaid.toFixed(2),
    return {
        total_months: totalMonths,
        total_interest_paid: totalInterestPaid.toFixed(2),
        sets: sets,
    };
}
catch (error) {
    // Pass the error message for the frontend to display
    return { error: error.message };
}
};

// *********************LOWEST INTEREST RATE FIRST********************************
const calculateDebtSnowballPlan = (debts, income, expenses, savings) => {
    console.log("\calculateDebtSnowballPlan\n")
    try {
    let budget = income - expenses - savings; // Monthly available budget
    let totalMonths = 0;
    let sets = [];
    let totalInterestPaid = 0;
    let previousTotalDebt = debts.reduce((sum, d) => sum + d.balance, 0);

    if (budget <= 0) {
        console.error("🚨 Error: Not enough funds to make payments.");
        return { error: "Not enough funds to make payments." };
    }

    console.log("📌 Initial Input Debts:", JSON.stringify(debts, null, 2));
    console.log(`📊 Monthly Budget Available: ${budget}`);

    while (debts.some(debt => debt.balance > 0)) {
        totalMonths++;
        let remainingBudget = budget;
        let set = { set_number: totalMonths, payments: [] };

        console.log(`\n📅 Month ${totalMonths}:`);
        console.log(`💰 Starting Budget: ${remainingBudget}`);

        // 1️⃣ Apply interest before making payments
        debts.forEach(debt => {
            if (debt.balance > 0) {
                let monthlyInterest = (debt.interest / 100 / 12) * debt.balance;
                debt.balance += monthlyInterest;
                totalInterestPaid += monthlyInterest;
                console.log(`🧮 Interest added for ${debt.name}: $${monthlyInterest.toFixed(2)}`);
            }
        });

        // 2️⃣ Ensure minimum payments for all debts
        let totalMinimumPayments = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
        if (totalMinimumPayments > budget) {
            console.error("🚨 ERROR: Budget cannot cover minimum payments.");
            return { error: "Budget insufficient to cover minimum payments." };
        }

        debts.forEach(debt => {
            if (debt.balance > 0) {
                let minPayment = Math.min(debt.minimumPayment, debt.balance);
                debt.balance -= minPayment;
                remainingBudget -= minPayment;
                set.payments.push({ name: debt.name, monthly_payment: minPayment });

                console.log(`✅ Minimum payment to ${debt.name}: $${minPayment.toFixed(2)}`);
            }
        });

        console.log(`📉 Budget after minimum payments: ${remainingBudget.toFixed(2)}`);

        // 3️⃣ Sort debts by balance (smallest first)
        debts.sort((a, b) => a.balance - b.balance);

        // 4️⃣ Allocate remaining budget to the smallest balance
        while (remainingBudget > 0) {
            let unpaidDebts = debts.filter(debt => debt.balance > 0);
            if (unpaidDebts.length === 0) break;

            let smallestDebt = unpaidDebts[0];
            let extraPayment = Math.min(remainingBudget, smallestDebt.balance);
            smallestDebt.balance -= extraPayment;
            remainingBudget -= extraPayment;
            set.payments.push({ name: smallestDebt.name, monthly_payment: extraPayment });

            console.log(`🚀 Extra payment to ${smallestDebt.name}: $${extraPayment.toFixed(2)}`);
        }

        console.log(`🏁 Budget after extra payments: ${remainingBudget.toFixed(2)}`);
        console.log("📊 Remaining Debts:", JSON.stringify(debts, null, 2));

        sets.push(set);

        // Stop if debts aren't reducing
        let totalDebtNow = debts.reduce((sum, d) => sum + d.balance, 0);
        if (totalDebtNow >= previousTotalDebt) {
            console.error("🚨 ERROR: No debt progress. Repayment plan may be infeasible.");
            return { error: "Debt is not reducing. Increase budget or lower interest rates." };
        }
        previousTotalDebt = totalDebtNow;
    }

    console.log(`\n🎉 All debts cleared in ${totalMonths} months!`);
    console.log(`📊 Total Interest Paid: $${totalInterestPaid.toFixed(2)}`);

    return {
        total_months: totalMonths,
        total_interest_paid: totalInterestPaid.toFixed(2),
        sets: sets,
    };
}
catch (error) {
    // Pass the error message for the frontend to display
    return { error: error.message };
}
};

const genAI = new GoogleGenerativeAI(API_KEY);

const generateGeminiExplanation = async (plan, strategyName) => {
    const prompt = `
You are a financial advisor helping users understand their debt repayment plan. Here's the repayment strategy: "${strategyName}".

Plan Overview:
- Total Months to Repay: ${plan.total_months}
- Total Interest Paid: $${plan.total_interest_paid}
- Debt List: ${JSON.stringify(plan.sets)}

Provide the following in plain text, no markdown or formatting:
1. A brief explanation of how this strategy works.
2. A list of key benefits of this strategy.
3. A few quick tips to improve financial planning based on the debt sets of the user. Customize the output for each person.
Do not show amounts in the output. Give the name of the debt instead.
give me one paragraph only 300 words. no bullet points/numbered lists. no need to mention the plan name.
`;


    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Response from Gemini API:", text);

        if (!text) {
            throw new Error("Empty response from Gemini API.");
        }

        return text.trim();
    } catch (error) {
        console.error("Error generating Gemini explanation:", error);
        return "Failed to generate AI explanation. Please try again.";
    }
};



app.post("/generate-repayment-plan", async (req, res) => {
    try {
        let { debts, income, expenses, extraPayment } = req.body;

        if (!debts || debts.length === 0 || !income || !expenses) {
            console.error("🚨 Error: Invalid input data", req.body);
            return res.status(400).json({ error: "Invalid input data" });
        }

        const normalizedDebts = debts.map(debt => ({
            name: debt.name,
            balance: parseFloat(debt.balance),
            minimumPayment: parseFloat(debt.minimumPayment || debt.payment || 0),
            interest: parseFloat(debt.interest || 0),
        }));

        // Call each repayment plan calculation
        const snowballPlan = calculateDebtSnowballPlan(
            JSON.parse(JSON.stringify(normalizedDebts)), 
            income,
            expenses,
            extraPayment
        );

        const avalanchePlan = calculateDebtAvalanchePlan(
            JSON.parse(JSON.stringify(normalizedDebts)), 
            income,
            expenses,
            extraPayment
        );

        const avalancheSpecialPlan = calculateDebtAvalancheSpecialPlan(
            JSON.parse(JSON.stringify(normalizedDebts)), 
            income,
            expenses,
            extraPayment
        );

        const snowballExplanation = await generateGeminiExplanation(snowballPlan, "Debt Snowball Plan");
        const avalancheExplanation = await generateGeminiExplanation(avalanchePlan, "Debt Avalanche Plan");
        const avalancheSpecialExplanation = await generateGeminiExplanation(avalancheSpecialPlan, "Debt Avalanche Special Plan");

        res.json({
            snowballPlan: { ...snowballPlan, ai_explanation: snowballExplanation },
            avalanchePlan: { ...avalanchePlan, ai_explanation: avalancheExplanation },
            avalancheSpecialPlan: { ...avalancheSpecialPlan, ai_explanation: avalancheSpecialExplanation },
        });
    } catch (err) {
        console.error("❌ Error generating repayment plans:", err);
        res.status(500).json({ error: err.message });
    }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

