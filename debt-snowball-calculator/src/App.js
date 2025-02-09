import React from 'react';
// import { useState, useEffect } from "react";
// import axios from "axios";

// import styled from "styled-components";

// // Styled Components with modern UI

// const Container = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     min-height: 100vh;
//     background: linear-gradient(135deg, #8e44ad, #3498db);
//     font-family: 'Poppins', sans-serif;
//     color: white;
//     padding: 20px;
// `;

// const Title = styled.h1`
//     font-size: 32px;
//     font-weight: 600;
//     text-align: center;
//     margin-bottom: 20px;
// `;

// const Button = styled.button`
//     background: #ff6b6b;
//     color: white;
//     border: none;
//     padding: 12px 20px;
//     font-size: 18px;
//     border-radius: 8px;
//     cursor: pointer;
//     margin: 10px;
//     transition: all 0.3s ease-in-out;
//     box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    
//     &:hover {
//         background: #ff4757;
//         transform: scale(1.05);
//     }
// `;

// const Input = styled.input`
//     width: 100%;
//     padding: 12px;
//     margin: 8px 0;
//     border: 2px solid #ddd;
//     border-radius: 8px;
//     font-size: 16px;
//     text-align: center;
//     transition: all 0.3s ease-in-out;
    
//     &:focus {
//         border-color: #ff6b6b;
//         outline: none;
//         transform: scale(1.02);
//     }
// `;

// const DebtContainer = styled.div`
//     background: white;
//     padding: 20px;
//     border-radius: 12px;
//     box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
//     margin: 12px;
//     width: 320px;
//     color: #333;
//     text-align: center;
// `;

// const PlanContainer = styled.div`
//     margin-top: 20px;
//     background: rgba(255, 255, 255, 0.2);
//     padding: 20px;
//     border-radius: 12px;
//     width: 400px;
//     text-align: center;
//     backdrop-filter: blur(10px);
//     box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
// `;

// const MethodDisplay = styled.h2`
//     background: rgba(0, 0, 0, 0.2);
//     padding: 10px;
//     border-radius: 8px;
//     font-size: 20px;
//     font-weight: bold;
//     margin-top: 15px;
// `;

// function App() {
//     const [debts, setDebts] = useState([]);
//     const [extraPayment, setExtraPayment] = useState(0);
//     const [plan, setPlan] = useState(null);
//     const [method, setMethod] = useState("");

//     const addDebt = () => setDebts([...debts, { name: "", balance: "", interest: "", payment: "" }]);

//     const handleChange = (index, field, value) => {
//       const newDebts = [...debts];
//       newDebts[index][field] = field === "balance" || field === "payment" ? Number(value) : value;
//       setDebts(newDebts);
//     };
  

//     const calculatePlan = async () => {
//         try {
//             const response = await axios.post("http://localhost:5001/calculate-debt", { debts, extraPayment });
//             setPlan(response.data.result);
//             setMethod(response.data.method);
//         } catch (error) {
//             console.error("Error calculating debt plan:", error);
//         }
//     };
//     useEffect(() => {
//       console.log("Repayment Plan:", plan);
//   }, [plan]);
  

//     return (
//         <Container>
//             <Title>💰 AI-Powered Debt Repayment Planner</Title>
//             <Button onClick={addDebt}>➕ Add Debt</Button>

//             {debts.map((debt, index) => (
//                 <DebtContainer key={index}>
//                     <Input type="text" placeholder="Name (e.g., Credit Card)" onChange={(e) => handleChange(index, "name", e.target.value)} />
//                     <Input type="number" placeholder="Balance ($)" onChange={(e) => handleChange(index, "balance", e.target.value)} />
//                     <Input type="number" placeholder="Interest Rate (%)" onChange={(e) => handleChange(index, "interest", e.target.value)} />
//                     <Input type="number" placeholder="Minimum Payment ($)" onChange={(e) => handleChange(index, "payment", e.target.value)} />
//                 </DebtContainer>
//             ))}

//             <Input type="number" placeholder="💵 Extra Payment (if any)" onChange={(e) => setExtraPayment(e.target.value)} />
//             <Button onClick={calculatePlan}>📊 Calculate Best Strategy</Button>

//             {method && <MethodDisplay>🤖 AI Suggests: {method.toUpperCase()} Method</MethodDisplay>}

//             {plan && (
//                 <PlanContainer>
//                     <h2>📅 Your Repayment Plan</h2>
//                     {plan.map((step, index) => (
//                         <div key={index}>
//                             <p>
//                                 Month {step.month}: Paid <strong>${Number(step.totalPaid).toLocaleString()}</strong>
//                             </p>

//                             <p>Remaining Balances:</p>
//                               <ul>
//                                   {step.debts.map((debt, index) => (
//                                       <li key={index}>
//                                           {debt.name}: ${Number(debt.balance).toLocaleString()}
//                                       </li>
//                                   ))}
//                               </ul>
//                         </div>
//                     ))}
//                 </PlanContainer>
//             )}
//         </Container>
//     );
// }

// export default App;


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
    <Title>💰 AI-Powered Debt Repayment Planner</Title>

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
