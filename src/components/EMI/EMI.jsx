import React, { useState, useEffect } from 'react';
import './EMI.css'

const EmiCalculator = () => {
  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emiTable, setEmiTable] = useState([]);
  const [calculationHistory, setCalculationHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('emiHistory')) || [];
    setCalculationHistory(history);
  }, []);

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case 'principal':
        setPrincipal(event.target.value);
        break;
      case 'interest':
        setInterest(event.target.value);
        break;
      case 'duration':
        setDuration(event.target.value);
        break;
      default:
        break;
    }
  };

  const calculateEmi = () => {
    const r = interest / (12 * 100);
    const n = duration;
    const emi = principal * r * (1 + r) ** n / ((1 + r) ** n - 1);
    return emi.toFixed(2);
  };

  const generateEmiTable = () => {
    let emiTableData = [];
    let remainingPrincipal = principal;
    for (let i = 1; i <= duration; i++) {
      const emi = calculateEmi();
      const interests = (interest / 12 / 100) * remainingPrincipal;
      const principal = emi - interest;
      remainingPrincipal -= principal;
      emiTableData.push({
        month: i,
        emi: emi,
        principal: principal.toFixed(2),
        interest: interests.toFixed(2),
        remainingPrincipal: remainingPrincipal.toFixed(2)
      });
    }
    setEmiTable(emiTableData);
    const currentHistory = [
      ...calculationHistory,
      {
        principal: principal,
        interest: interest,
        duration: duration,
        emiTableData: emiTableData
      }
    ];
    localStorage.setItem('emiHistory', JSON.stringify(currentHistory));
    setCalculationHistory(currentHistory);
  };

  return (
    <div className='divDisplay'>
      <form className="regForm">
        <label htmlFor="principal">Principal Amount:</label>
        <input
          type="number"
          id="principal"
          name="principal"
          value={principal}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="interest">Rate of Interest:</label>
        <input
          type="number"
          id="interest"
          name="interest"
          value={interest}
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="duration">Duration (in months):</label>
                <input
          type="number"
          id="duration"
          name="duration"
          value={duration}
          onChange={handleInputChange}
        />
        <br />
        <button type="button" onClick={generateEmiTable}>
          Submit
        </button>
      </form>
      <br />
      {emiTable.length > 0 && (
        <table style={{ border: "1px solid black" }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>EMI</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Remaining Principal</th>
            </tr>
          </thead>
          <tbody>
            {emiTable.map((data, index) => (
              <tr key={index}>
                <td>{data.month}</td>
                <td>{data.emi}</td>
                <td>{data.principal}</td>
                <td>{data.interest}</td>
                <td>{data.remainingPrincipal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <br />
      {calculationHistory.length > 0 && (
        <div>
          <h3>Calculation History</h3>
          <ul>
            {calculationHistory.map((history, index) => (
              <li key={index}>
                Principal: {history.principal}, Interest: {history.interest},
                Duration: {history.duration}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmiCalculator;

