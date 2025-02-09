import React from 'react';
import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #8e44ad, #3498db);
    font-family: 'Poppins', sans-serif;
    color: white;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 32px;
    text-align: center;
    margin-bottom: 20px;
`;

const Button = styled.button`
    background: #ff6b6b;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin: 10px;
    transition: 0.3s;
    
    &:hover {
        background: #ff4757;
    }
`;

const Input = styled.input`
    width: 300px;
    padding: 12px;
    margin: 8px 0;
    border-radius: 8px;
    font-size: 16px;
    text-align: center;
`;

const PlanContainer = styled.div`
    margin-top: 20px;
    background: rgba(255, 255, 255, 0.2);
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    backdrop-filter: blur(10px);
`;

function App() {
    const [income, setIncome] = useState("");
    const [expenses, setExpenses] = useState("");
    const [debts, setDebts] = useState([]);
    const [extraPayment, setExtraPayment] = useState(0);
    const [plan, setPlan] = useState(null);

    const addDebt = () => setDebts([...debts, { name: "", balance: "", interest: "", payment: "" }]);

    const handleChange = (index, field, value) => {
        const newDebts = [...debts];
        newDebts[index][field] = value;
        setDebts(newDebts);
    };

    const calculatePlan = async () => {
        try {
            const response = await axios.post("http://localhost:5001/generate-repayment-plan", {
                income,
                expenses,
                debts,
                extraPayment
            });
            setPlan(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
      <Container>
        <Title>🧭 Fortuna's Compass</Title>
    <h2>💰 An AI-Powered Debt Repayment Planner 💰</h2>

    <h3>Enter Your Financial Details</h3>
    <Input type="number" placeholder="💵 Monthly Income ($)" value={income} onChange={(e) => setIncome(e.target.value)} />
    <Input type="number" placeholder="📉 Monthly Expenses ($)" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
    <Input type="number" placeholder="💰 Savings ($)" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} />

    <Button onClick={addDebt}>➕ Add Debt</Button>

    {debts.map((debt, index) => (
        <div key={index}>
            <Input type="text" placeholder="Debt Name" onChange={(e) => handleChange(index, "name", e.target.value)} />
            <Input type="number" placeholder="Balance ($)" onChange={(e) => handleChange(index, "balance", e.target.value)} />
            <Input type="number" placeholder="Interest Rate (%)" onChange={(e) => handleChange(index, "interest", e.target.value)} />
            <Input type="number" placeholder="Minimum Payment ($)" onChange={(e) => handleChange(index, "payment", e.target.value)} />
        </div>
    ))}

    <Button onClick={calculatePlan}>📊 Get AI Repayment Plan</Button>

    {plan && (
    <PlanContainer>
        <h2>📅 Monthly Plans</h2>

        {/* Display Error Message */}
        {plan.error ? (
            <div style={{ color: "red", fontWeight: "bold" }}>
                🚨 {plan.error}
            </div>
        ) : (
            <>
                {/* Tabular format for repayment plans */}
                <div style={{ display: "flex", gap: "40px", justifyContent: "space-around" }}>
                    {/* Debt Snowball Plan */}
                    <table border="1" style={{ borderCollapse: "collapse", width: "30%" }}>
                        <thead>
                            <tr>
                                <th colSpan="2">🏔️ Debt Snowball Plan</th>
                            </tr>
                            <tr>
                                <th>Month</th>
                                <th>Payments</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Months</td>
                                <td>{plan.snowballPlan.total_months}</td>
                            </tr>
                            <tr>
                                <td>Total Interest Paid</td>
                                <td>${plan.snowballPlan.total_interest_paid}</td>
                            </tr>
                            {plan.snowballPlan.sets.map((set) => {
                                const combinedPayments = set.payments.reduce((acc, payment) => {
                                    acc[payment.name] = (acc[payment.name] || 0) + payment.monthly_payment;
                                    return acc;
                                }, {});
                                return (
                                    <tr key={set.set_number}>
                                        <td>Month {set.set_number}</td>
                                        <td>
                                            {Object.entries(combinedPayments).map(([name, amount]) => (
                                                <div key={name}>
                                                    {name}: ${amount.toFixed(2)}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Debt Avalanche Plan */}
                    <table border="1" style={{ borderCollapse: "collapse", width: "30%" }}>
                        <thead>
                            <tr>
                                <th colSpan="2">📈 Debt Avalanche Plan</th>
                            </tr>
                            <tr>
                                <th>Month</th>
                                <th>Payments</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Months</td>
                                <td>{plan.avalanchePlan.total_months}</td>
                            </tr>
                            <tr>
                                <td>Total Interest Paid</td>
                                <td>${plan.avalanchePlan.total_interest_paid}</td>
                            </tr>
                            {plan.avalanchePlan.sets.map((set) => {
                                const combinedPayments = set.payments.reduce((acc, payment) => {
                                    acc[payment.name] = (acc[payment.name] || 0) + payment.monthly_payment;
                                    return acc;
                                }, {});
                                return (
                                    <tr key={set.set_number}>
                                        <td>Month {set.set_number}</td>
                                        <td>
                                            {Object.entries(combinedPayments).map(([name, amount]) => (
                                                <div key={name}>
                                                    {name}: ${amount.toFixed(2)}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Debt Avalanche Special Plan */}
                    <table border="1" style={{ borderCollapse: "collapse", width: "30%" }}>
                        <thead>
                            <tr>
                                <th colSpan="2">🔥 Debt Avalanche Special Plan</th>
                            </tr>
                            <tr>
                                <th>Month</th>
                                <th>Payments</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Months</td>
                                <td>{plan.avalancheSpecialPlan.total_months}</td>
                            </tr>
                            <tr>
                                <td>Total Interest Paid</td>
                                <td>${plan.avalancheSpecialPlan.total_interest_paid}</td>
                            </tr>
                            {plan.avalancheSpecialPlan.sets.map((set) => {
                                const combinedPayments = set.payments.reduce((acc, payment) => {
                                    acc[payment.name] = (acc[payment.name] || 0) + payment.monthly_payment;
                                    return acc;
                                }, {});
                                return (
                                    <tr key={set.set_number}>
                                        <td>Month {set.set_number}</td>
                                        <td>
                                            {Object.entries(combinedPayments).map(([name, amount]) => (
                                                <div key={name}>
                                                    {name}: ${amount.toFixed(2)}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* AI Explanations */}
                <div style={{ marginTop: "40px" }}>
                    <h2>📅 AI-Generated Explanations</h2>

                    {/* Debt Snowball Plan */}
                    <div>
                        <h3>🏔️ Debt Snowball Plan (Smallest Balance First)</h3>
                        <p>{plan.snowballPlan.ai_explanation}</p>
                    </div>

                    {/* Debt Avalanche Plan */}
                    <div>
                        <h3>📈 Debt Avalanche Plan (Highest Interest Rate First)</h3>
                        <p>{plan.avalanchePlan.ai_explanation}</p>
                    </div>

                    {/* Debt Avalanche Special Plan */}
                    <div>
                        <h3>🔥 Debt Avalanche Special Plan (Highest Interest Amount First)</h3>
                        <p>{plan.avalancheSpecialPlan.ai_explanation}</p>
                    </div>
                </div>
            </>
        )}
    </PlanContainer>
)}

</Container>


  );
  
}

export default App;
