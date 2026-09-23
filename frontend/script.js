// ============================================================
// CreditPilot AI - Complete JavaScript
// ============================================================


// ============================================================
// LOAN NOMINEE VALIDATION
// ============================================================

function getNomineeDetails() {

    const nomineeNameElement =
        document.getElementById("nomineeName");

    const nomineeRelationElement =
        document.getElementById("nomineeRelation");

    const nomineeAgeElement =
        document.getElementById("nomineeAge");

    const nomineePhoneElement =
        document.getElementById("nomineePhone");


    // Check if nominee fields exist
    if (
        !nomineeNameElement ||
        !nomineeRelationElement ||
        !nomineeAgeElement ||
        !nomineePhoneElement
    ) {

        alert(
            "Nominee fields are missing from HTML."
        );

        return null;
    }


    const nomineeName =
        nomineeNameElement.value.trim();

    const nomineeRelation =
        nomineeRelationElement.value;

    const nomineeAge =
        Number(
            nomineeAgeElement.value
        );

    const nomineePhone =
        nomineePhoneElement.value.trim();


    // ========================================================
    // NAME VALIDATION
    // ========================================================

    if (!nomineeName) {

        alert(
            "Please enter nominee name."
        );

        nomineeNameElement.focus();

        return null;
    }


    if (nomineeName.length < 2) {

        alert(
            "Nominee name must contain at least 2 characters."
        );

        nomineeNameElement.focus();

        return null;
    }


    // ========================================================
    // RELATIONSHIP VALIDATION
    // ========================================================

    if (!nomineeRelation) {

        alert(
            "Please select nominee relationship."
        );

        nomineeRelationElement.focus();

        return null;
    }


    // ========================================================
    // AGE VALIDATION
    // ========================================================

    if (
        !nomineeAge ||
        nomineeAge < 18 ||
        nomineeAge > 100
    ) {

        alert(
            "Nominee age must be between 18 and 100."
        );

        nomineeAgeElement.focus();

        return null;
    }


    // ========================================================
    // PHONE VALIDATION
    // ========================================================

    if (
        !/^[6-9]\d{9}$/.test(nomineePhone)
    ) {

        alert(
            "Please enter a valid 10-digit Indian mobile number."
        );

        nomineePhoneElement.focus();

        return null;
    }


    // ========================================================
    // RETURN NOMINEE
    // ========================================================

    return {

        name:
            nomineeName,

        relationship:
            nomineeRelation,

        age:
            nomineeAge,

        phone:
            nomineePhone

    };

}


// ============================================================
// PREDICT LOAN
// ============================================================

async function predictLoan() {

    const income =
        document.getElementById("income").value;

    const loan =
        document.getElementById("loan").value;

    const score =
        document.getElementById("score").value;

    const result =
        document.getElementById("result");

    const loader =
        document.getElementById("loader");


    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (!income || !loan || !score) {

        result.innerHTML = `

            <div class="prediction-error">

                <h2>
                    ⚠️ Missing Information
                </h2>

                <p>
                    Please fill Income, Loan Amount
                    and Credit Score.
                </p>

            </div>

        `;

        return;
    }


    if (
        Number(income) <= 0 ||
        Number(loan) <= 0
    ) {

        result.innerHTML = `

            <div class="prediction-error">

                <h2>
                    ❌ Invalid Financial Information
                </h2>

                <p>
                    Income and loan amount must be
                    greater than zero.
                </p>

            </div>

        `;

        return;
    }


    // ========================================================
    // CREDIT SCORE VALIDATION
    // ========================================================

    if (
        Number(score) < 300 ||
        Number(score) > 850
    ) {

        result.innerHTML = `

            <div class="prediction-error">

                <h2>
                    ❌ Invalid Credit Score
                </h2>

                <p>
                    Credit score must be between
                    300 and 850.
                </p>

            </div>

        `;

        return;
    }


    // ========================================================
    // NOMINEE VALIDATION
    // ========================================================

    const nominee =
        getNomineeDetails();


    if (!nominee) {

        return;

    }


    // ========================================================
    // SHOW LOADER
    // ========================================================

    if (loader) {

        loader.style.display =
            "flex";

    }


    try {

        // ====================================================
        // API REQUEST
        // ====================================================

        const response =
            await fetch(
                "https://creditpilot-ai-production.up.railway.app/predict",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            income:
                                Number(income),

                            loan_amount:
                                Number(loan),

                            credit_score:
                                Number(score),

                            nominee_name:
                                nominee.name,

                            nominee_relationship:
                                nominee.relationship,

                            nominee_age:
                                nominee.age,

                            nominee_phone:
                                nominee.phone

                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "API Response:",
            data
        );


        // ====================================================
        // HIDE LOADER
        // ====================================================

        if (loader) {

            loader.style.display =
                "none";

        }


        // ====================================================
        // BACKEND ERROR
        // ====================================================

        if (!response.ok) {

            let errorMessage =
                "Prediction failed.";


            if (
                typeof data.detail ===
                "string"
            ) {

                errorMessage =
                    data.detail;

            }

            else if (
                data.detail
            ) {

                errorMessage =
                    JSON.stringify(
                        data.detail,
                        null,
                        2
                    );

            }


            result.innerHTML = `

                <div class="prediction-error">

                    <h2>
                        ❌ Prediction Failed
                    </h2>

                    <p>
                        ${errorMessage}
                    </p>

                </div>

            `;

            return;

        }


        // ====================================================
        // AI EXPLANATION
        // ====================================================

        let explanationHTML =
            "";


        if (
            data.explanation &&
            Array.isArray(data.explanation)
        ) {

            explanationHTML =
                data.explanation
                    .map(
                        item => `

                            <li>
                                📌 ${item}
                            </li>

                        `
                    )
                    .join("");

        }

        else {

            explanationHTML = `

                <li>
                    No explanation available.
                </li>

            `;

        }


        // ====================================================
        // FINANCIAL ADVICE
        // ====================================================

        let adviceHTML =
            "";


        if (
            data.advice &&
            Array.isArray(data.advice)
        ) {

            adviceHTML =
                data.advice
                    .map(
                        item => `

                            <li>
                                💡 ${item}
                            </li>

                        `
                    )
                    .join("");

        }

        else {

            adviceHTML = `

                <li>
                    No advice available.
                </li>

            `;

        }


        // ====================================================
        // PREDICTION STATUS
        // ====================================================

        let predictionTitle;


        if (
            data.prediction ===
            "Approved"
        ) {

            predictionTitle =
                "✅ Loan Approved";

        }

        else {

            predictionTitle =
                "❌ Loan Rejected";

        }


        // ====================================================
        // DEBT TRAP DETECTION
        // ====================================================

        const debtTrapHTML =
            calculateDebtTrap();


        // ====================================================
        // NOMINEE DISPLAY
        // ====================================================

        const nomineeHTML = `

            <div class="nominee-result">

                <h3>
                    👤 Loan Nominee
                </h3>

                <p>

                    <strong>
                        Name:
                    </strong>

                    ${nominee.name}

                </p>

                <p>

                    <strong>
                        Relationship:
                    </strong>

                    ${nominee.relationship}

                </p>

                <p>

                    <strong>
                        Age:
                    </strong>

                    ${nominee.age}

                </p>

                <p>

                    <strong>
                        Mobile:
                    </strong>

                    ${nominee.phone}

                </p>

            </div>

        `;


        // ====================================================
        // FINAL RESULT
        // ====================================================

        result.innerHTML = `

            <div class="prediction-result">

                <h2>
                    ${predictionTitle}
                </h2>


                <h3>

                    Risk Level:
                    ${data.risk_level || "N/A"}

                </h3>


                <hr>


                <p>

                    💳

                    <strong>
                        Credit Score:
                    </strong>

                    ${data.credit_score}

                </p>


                <p>

                    💰

                    <strong>
                        Income:
                    </strong>

                    ₹${Number(
                        data.income
                    ).toLocaleString(
                        "en-IN"
                    )}

                </p>


                <p>

                    🏦

                    <strong>
                        Loan Amount:
                    </strong>

                    ₹${Number(
                        data.loan_amount
                    ).toLocaleString(
                        "en-IN"
                    )}

                </p>


                <p>

                    📈

                    <strong>
                        Approval Probability:
                    </strong>

                    ${
                        data.approval_probability
                        ?? "N/A"
                    }%

                </p>


                <p>

                    🎯

                    <strong>
                        Model Confidence:
                    </strong>

                    ${
                        data.confidence
                        ?? "N/A"
                    }%

                </p>


                <hr>


                <!-- NOMINEE -->

                ${nomineeHTML}


                <hr>


                <!-- AI ANALYSIS -->

                <h3>
                    📊 AI Analysis
                </h3>


                <ul>

                    ${explanationHTML}

                </ul>


                <!-- FINANCIAL ADVICE -->

                <h3>
                    💡 Financial Advice
                </h3>


                <ul>

                    ${adviceHTML}

                </ul>


                <hr>


                <!-- DEBT TRAP -->

                ${debtTrapHTML}


                <hr>


                <p>

                    ${
                        data.saved

                        ?

                        "💾 Prediction saved successfully."

                        :

                        "⚠️ Prediction was not saved."
                    }

                </p>


            </div>

        `;

    }


    // ========================================================
    // SERVER ERROR
    // ========================================================

    catch (error) {

        console.error(
            "Prediction Error:",
            error
        );


        if (loader) {

            loader.style.display =
                "none";

        }


        result.innerHTML = `

            <div class="prediction-error">

                <h2>
                    ❌ Server Connection Failed
                </h2>

                <p>
                    Make sure FastAPI is running.
                </p>

                <p>

                    Backend:

                    <strong>
                        http://127.0.0.1:8000
                    </strong>

                </p>

                <p>

                    Error:

                    ${error.message}

                </p>

            </div>

        `;

    }

}


// ============================================================
// DEBT TRAP DETECTION
// ============================================================

function calculateDebtTrap() {

    const income =
        Number(
            document.getElementById(
                "income"
            ).value
        );


    const loan =
        Number(
            document.getElementById(
                "loan"
            ).value
        );


    const existingEMIInput =
        document.getElementById(
            "existingEMI"
        );


    const existingLoansInput =
        document.getElementById(
            "existingLoans"
        );


    const interestInput =
        document.getElementById(
            "interest"
        );


    const yearsInput =
        document.getElementById(
            "years"
        );


    const existingEMI =
        existingEMIInput
            ? Number(
                existingEMIInput.value
              ) || 0
            : 0;


    const interest =
        interestInput
            ? Number(
                interestInput.value
              ) || 8.5
            : 8.5;


    const years =
        yearsInput
            ? Number(
                yearsInput.value
              ) || 5
            : 5;


    const existingLoans =
        existingLoansInput
            ? Number(
                existingLoansInput.value
              ) || 0
            : 0;


    if (
        income <= 0 ||
        loan <= 0
    ) {

        return `

            <div class="debt-trap-box">

                <h3>
                    🛡️ Debt Trap Detector
                </h3>

                <p>
                    Enter valid income and loan amount
                    to calculate debt risk.
                </p>

            </div>

        `;

    }


    // ========================================================
    // NEW LOAN EMI
    // ========================================================

    const monthlyRate =
        interest /
        12 /
        100;


    const months =
        years * 12;


    let newEMI;


    if (
        monthlyRate === 0
    ) {

        newEMI =
            loan / months;

    }

    else {

        newEMI =
            (
                loan *
                monthlyRate *
                Math.pow(
                    1 + monthlyRate,
                    months
                )
            )
            /
            (
                Math.pow(
                    1 + monthlyRate,
                    months
                ) - 1
            );

    }


    // ========================================================
    // TOTAL DEBT
    // ========================================================

    const totalMonthlyDebt =
        existingEMI +
        newEMI;


    // ========================================================
    // DTI
    // ========================================================

    const dti =
        (
            totalMonthlyDebt /
            income
        ) * 100;


    // ========================================================
    // RISK
    // ========================================================

    let riskLevel;
    let riskIcon;
    let advice;


    if (
        dti < 30
    ) {

        riskLevel =
            "LOW";

        riskIcon =
            "🟢";

        advice =
            "Your estimated debt burden appears manageable.";

    }

    else if (
        dti < 50
    ) {

        riskLevel =
            "MODERATE";

        riskIcon =
            "🟡";

        advice =
            "Be careful with additional borrowing and maintain an emergency fund.";

    }

    else if (
        dti < 60
    ) {

        riskLevel =
            "HIGH";

        riskIcon =
            "🟠";

        advice =
            "Consider reducing the requested loan amount.";

    }

    else {

        riskLevel =
            "DEBT TRAP RISK";

        riskIcon =
            "🔴";

        advice =
            "Your estimated debt burden is very high. Consider reducing the loan amount or existing debt before borrowing.";

    }


    // ========================================================
    // RETURN RESULT
    // ========================================================

    return `

        <div class="debt-trap-box">

            <h3>
                🛡️ Debt Trap Detector
            </h3>


            <p>

                💰

                <strong>
                    Monthly Income:
                </strong>

                ₹${income.toLocaleString(
                    "en-IN"
                )}

            </p>


            <p>

                💳

                <strong>
                    Existing EMI:
                </strong>

                ₹${existingEMI.toLocaleString(
                    "en-IN"
                )}

            </p>


            <p>

                🏦

                <strong>
                    New Loan EMI:
                </strong>

                ₹${newEMI.toFixed(0)}

            </p>


            <p>

                📋

                <strong>
                    Existing Loans:
                </strong>

                ${existingLoans}

            </p>


            <p>

                📊

                <strong>
                    Total Monthly Debt:
                </strong>

                ₹${totalMonthlyDebt.toFixed(0)}

            </p>


            <hr>


            <h3>

                ${riskIcon}

                Debt-to-Income Ratio:

                ${dti.toFixed(1)}%

            </h3>


            <p>

                <strong>
                    Risk Level:
                </strong>

                ${riskLevel}

            </p>


            <p>

                💡

                <strong>
                    AI Recommendation:
                </strong>

                ${advice}

            </p>


            <small>

                Note: DTI thresholds shown here are
                project-level risk heuristics, not
                universal lending rules.

            </small>

        </div>

    `;

}


// ============================================================
// VOICE INPUT
// ============================================================

function startVoice() {

    if (
        !(
            "webkitSpeechRecognition"
            in window
        )
    ) {

        alert(
            "Speech Recognition is not supported in this browser."
        );

        return;

    }


    const recognition =
        new webkitSpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.start();


    recognition.onstart =
        function () {

            console.log(
                "🎤 Listening..."
            );

        };


    recognition.onresult =
        function (event) {

            const text =
                event
                    .results[0][0]
                    .transcript;


            console.log(
                "Voice Input:",
                text
            );


            const numbers =
                text.match(/\d+/g);


            if (
                numbers &&
                numbers.length >= 3
            ) {

                document.getElementById(
                    "income"
                ).value =
                    numbers[0];


                document.getElementById(
                    "loan"
                ).value =
                    numbers[1];


                document.getElementById(
                    "score"
                ).value =
                    numbers[2];


                predictLoan();

            }

            else {

                alert(
                    "Please say three numbers: income, loan amount and credit score."
                );

            }

        };


    recognition.onerror =
        function (event) {

            console.log(
                "Voice Error:",
                event.error
            );


            alert(
                "Voice input failed. Please try again."
            );

        };

}


// ============================================================
// LOGIN
// ============================================================

async function loginUser() {

    const email =
        prompt(
            "Enter Email"
        );


    const password =
        prompt(
            "Enter Password"
        );


    // ========================================================
    // CHECK INPUT
    // ========================================================

    if (
        !email ||
        !password
    ) {

        alert(
            "Email and password are required."
        );

        return;

    }


    try {

        // ====================================================
        // LOGIN API REQUEST
        // ====================================================

        const response =
            await fetch(
                "http://127.0.0.1:8000/login",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            email:
                                email,

                            password:
                                password

                        })

                }
            );


        // ====================================================
        // READ RESPONSE
        // ====================================================

        const data =
            await response.json();


        console.log(
            "Login Response:",
            data
        );


        // ====================================================
        // LOGIN FAILED
        // ====================================================

        if (!response.ok) {

            let errorMessage =
                "Login failed.";


            if (
                typeof data.detail ===
                "string"
            ) {

                errorMessage =
                    data.detail;

            }

            else if (
                data.detail
            ) {

                errorMessage =
                    JSON.stringify(
                        data.detail,
                        null,
                        2
                    );

            }


            alert(
                "❌ Login Failed\n\n" +
                errorMessage
            );


            return;

        }


        // ====================================================
        // LOGIN SUCCESSFUL
        // ====================================================

        console.log(
            "✅ Login successful"
        );


        // ====================================================
        // SAVE USER INFORMATION
        // ====================================================

        localStorage.setItem(
            "user_id",
            data.user_id
        );


        localStorage.setItem(
            "user_name",
            data.name
        );


        localStorage.setItem(
            "user_email",
            data.email
        );


        // ====================================================
        // SUCCESS MESSAGE
        // ====================================================

        alert(
            "✅ Login Successful!\n\n" +
            "Welcome, " +
            data.name
        );


        // ====================================================
        // REDIRECT TO DASHBOARD
        // ====================================================

        window.location.href =
            "dashboard.html";

    }


    // ========================================================
    // CONNECTION ERROR
    // ========================================================

    catch (error) {

        console.error(
            "Login Error:",
            error
        );


        alert(
            "❌ Login Failed\n\n" +
            "Could not connect to FastAPI server.\n\n" +
            "Make sure FastAPI is running."
        );

    }

}


// ============================================================
// THEME
// ============================================================

function toggleTheme() {

    document.body.classList.toggle(
        "light"
    );

}


// ============================================================
// DOWNLOAD REPORT
// ============================================================

function downloadReport() {

    const result =
        document.getElementById(
            "result"
        );


    const report =
        result.innerText;


    if (
        !report.trim() ||
        report ===
        "Waiting for Prediction..."
    ) {

        alert(
            "Please make a prediction first."
        );

        return;

    }


    const blob =
        new Blob(
            [report],
            {
                type:
                    "text/plain"
            }
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        URL.createObjectURL(
            blob
        );


    link.download =
        "CreditPilot_Report.txt";


    link.click();


    URL.revokeObjectURL(
        link.href
    );

}


// ============================================================
// EMI CALCULATOR
// ============================================================

function calculateEMI() {

    const loan =
        parseFloat(
            document.getElementById(
                "loan"
            ).value
        );


    const interest =
        parseFloat(
            document.getElementById(
                "interest"
            ).value
        );


    const years =
        parseFloat(
            document.getElementById(
                "years"
            ).value
        );


    if (
        isNaN(loan) ||
        isNaN(interest) ||
        isNaN(years) ||
        loan <= 0 ||
        interest < 0 ||
        years <= 0
    ) {

        alert(
            "Please enter valid EMI details."
        );

        return;

    }


    const r =
        interest /
        (12 * 100);


    const n =
        years * 12;


    let emi;


    if (
        r === 0
    ) {

        emi =
            loan / n;

    }

    else {

        emi =
            (
                loan *
                r *
                Math.pow(
                    1 + r,
                    n
                )
            )
            /
            (
                Math.pow(
                    1 + r,
                    n
                ) - 1
            );

    }


    const totalPayment =
        emi * n;


    const totalInterest =
        totalPayment -
        loan;


    document.getElementById(
        "emi"
    ).innerHTML =
        "₹ " +
        emi.toFixed(2);


    document.getElementById(
        "interestAmount"
    ).innerHTML =
        "₹ " +
        totalInterest.toFixed(2);


    document.getElementById(
        "totalPayment"
    ).innerHTML =
        "₹ " +
        totalPayment.toFixed(2);

}


// ============================================================
// COMPARE LOANS
// ============================================================

function compareLoans() {

    const loan =
        parseFloat(
            document.getElementById(
                "loan"
            ).value
        );


    const years =
        parseFloat(
            document.getElementById(
                "years"
            ).value
        );


    if (
        isNaN(loan) ||
        isNaN(years) ||
        loan <= 0 ||
        years <= 0
    ) {

        alert(
            "Enter valid Loan Amount and Loan Tenure."
        );

        return;

    }


    // ========================================================
    // BANK DATA
    // ========================================================

    const banks = [

        {
            name:
                "SBI",

            rate:
                8.40
        },

        {
            name:
                "HDFC",

            rate:
                8.60
        },

        {
            name:
                "ICICI",

            rate:
                8.90
        },

        {
            name:
                "Axis Bank",

            rate:
                9.10
        },

        {
            name:
                "Kotak",

            rate:
                9.25
        }

    ];


    // ========================================================
    // BEST BANK
    // ========================================================

    let bestBank =
        banks[0];


    banks.forEach(
        bank => {

            if (
                bank.rate <
                bestBank.rate
            ) {

                bestBank =
                    bank;

            }

        }
    );


    let html =
        "";


    // ========================================================
    // CALCULATE BANK OFFERS
    // ========================================================

    banks.forEach(
        bank => {

            const r =
                bank.rate /
                (12 * 100);


            const n =
                years * 12;


            let emi;


            if (
                r === 0
            ) {

                emi =
                    loan / n;

            }

            else {

                emi =
                    (
                        loan *
                        r *
                        Math.pow(
                            1 + r,
                            n
                        )
                    )
                    /
                    (
                        Math.pow(
                            1 + r,
                            n
                        ) - 1
                    );

            }


            const total =
                emi * n;


            const bestRate =
                bestBank.rate /
                (12 * 100);


            let bestEMI;


            if (
                bestRate === 0
            ) {

                bestEMI =
                    loan / n;

            }

            else {

                bestEMI =
                    (
                        loan *
                        bestRate *
                        Math.pow(
                            1 + bestRate,
                            n
                        )
                    )
                    /
                    (
                        Math.pow(
                            1 + bestRate,
                            n
                        ) - 1
                    );

            }


            const bestTotal =
                bestEMI * n;


            const extraCost =
                total -
                bestTotal;


            html += `

                <div class="bank-card">

                    <h3>
                        🏦 ${bank.name}
                    </h3>


                    <p>

                        Interest Rate:

                        <b>
                            ${bank.rate}%
                        </b>

                    </p>


                    <p>

                        Monthly EMI:

                        <b>
                            ₹${emi.toFixed(0)}
                        </b>

                    </p>


                    <p>

                        Total Payment:

                        ₹${total.toFixed(0)}

                    </p>


                    ${
                        bank.name ===
                        bestBank.name

                        ?

                        `

                        <span class="best">

                            ⭐ AI Recommended

                        </span>

                        `

                        :

                        `

                        <span class="save">

                            ₹${extraCost.toFixed(0)}
                            more expensive

                        </span>

                        `
                    }


                    <br>
                    <br>


                    <button
                        onclick="
                            selectBank(
                                '${bank.name}',
                                ${bank.rate},
                                ${emi.toFixed(0)}
                            )
                        "
                    >

                        ✅ Select Offer

                    </button>

                </div>

            `;

        }
    );


    // ========================================================
    // CARD RESULT
    // ========================================================

    const comparisonResult =
        document.getElementById(
            "comparisonResult"
        );


    if (
        comparisonResult
    ) {

        comparisonResult.innerHTML =
            html;

    }


    // ========================================================
    // TABLE RESULT
    // ========================================================

    const tableBody =
        document.querySelector(
            "#loanTable tbody"
        );


    if (
        tableBody
    ) {

        let tableHTML =
            "";


        banks.forEach(
            bank => {

                const r =
                    bank.rate /
                    (12 * 100);


                const n =
                    years * 12;


                let emi;


                if (
                    r === 0
                ) {

                    emi =
                        loan / n;

                }

                else {

                    emi =
                        (
                            loan *
                            r *
                            Math.pow(
                                1 + r,
                                n
                            )
                        )
                        /
                        (
                            Math.pow(
                                1 + r,
                                n
                            ) - 1
                        );

                }


                const total =
                    emi * n;


                tableHTML += `

                    <tr>

                        <td>
                            ${bank.name}
                        </td>

                        <td>
                            ${bank.rate}%
                        </td>

                        <td>
                            ₹${emi.toFixed(0)}
                        </td>

                        <td>
                            ₹${total.toFixed(0)}
                        </td>

                    </tr>

                `;

            }
        );


        tableBody.innerHTML =
            tableHTML;

    }

}


// ============================================================
// SELECT BANK
// ============================================================

function selectBank(
    name,
    rate,
    emi
) {

    alert(

        `🏦 ${name} selected!\n\n` +

        `Interest Rate: ${rate}%\n` +

        `Monthly EMI: ₹${emi}`

    );

}


// ============================================================
// PAGE LOAD
// ============================================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "✅ CreditPilot AI JavaScript loaded."
        );

        console.log(
            "🛡️ Debt Trap Detection enabled."
        );

        console.log(
            "👤 Loan Nominee Validation enabled."
        );

        console.log(
            "🔐 Login & Dashboard redirect enabled."
        );

    }
);
