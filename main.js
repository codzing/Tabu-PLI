const MAX_row = 50;
const MAX_col = 50;

function gentable() {
    const row = parseInt(document.getElementById("totconst").value, 10)+1;
    const col = parseInt(document.getElementById("totvar").value, 10) + 1;

    let table = '<table id="tabledat">';
    table += '<tr>';
    for (let j = 0; j < col; j++) {
        if (j < col - 1) {
            table += `<th scope="col">x[${j + 1}]</th>`;
        } else {
            table += `<th scope="col">Operator</th>`;
            table += `<th scope="col">Value</th>`;
        }
    }
    table += '</tr>';

    for (let i = 0; i < row; i++) {
        table += '<tr>';
        for (let j = 0; j < col; j++) {
            if (j < col - 1) {
                table += '<td><input type="number" step="1" placeholder="input value"></td>';
            } else if (j == col - 1) {
                table += `<td>
                            <select>
                                <option value="<">&lt;</option>
                                <option value=">">&gt;</option>
                                <option value="<=">&lt;=</option>
                                <option value=">=">&gt;=</option>
                                <option value="=">=</option>
                                <option value="!=">!=</option>
                            </select>
                          </td>`;
                table += '<td><input type="number" step="1" placeholder="input value"></td>';
            }
        }
        table += '</tr>';
    }

    table += '</table>';

    document.getElementById("gentab").innerHTML = table;
}


class Solution {
    constructor() {
        this.data = new Array(MAX_row).fill(0);
        this.feasible = true;
    }
}

// fungsi untuk mengecek apakah solusi feasible
function isFeasible(solution, konstan, tanda, boundary, varCount, bound) {
    let result = new Array(bound).fill(0);
    let feasible = true;

    for (let i = 0; i < bound; i++) {
        result[i] = 0;
        for (let j = 0; j < varCount; j++) {
            result[i] += solution[j] * konstan[i][j];
        }

        if (tanda[i] === ">=" && result[i] < boundary[i]) {
            feasible = false;
            break;
        } else if (tanda[i] === "<=" && result[i] > boundary[i]) {
            feasible = false;
            break;
        } else if (tanda[i] === "<" && result[i] >= boundary[i]) {
            feasible = false;
            break;
        } else if (tanda[i] === ">" && result[i] <= boundary[i]) {
            feasible = false;
            break;
        } else if (tanda[i] === "=" && result[i] !== boundary[i]) {
            feasible = false;
            break;
        } else if (tanda[i] === "!=" && result[i] === boundary[i]) {
            feasible = false;
            break;
        }
    }

    return feasible;
}

// fungsi menampilkan solusi
function outSolution(solution, varCount) {
    let result = "{";
    for (let i = 0; i < varCount; i++) {
        result += solution[i];
        if (i < varCount - 1) {
            result += ", ";
        }
    }
    result += "}";
    console.log(result);
}

function initialSolution(solution, varCount, ind) {
    for (let i = 0; i < varCount; i++) {
        solution.data[i] = (i === ind) ? 1 : 0;
    }
}

// fungsi menghitung z
function value(cost, solution, varCount) {
    let result = 0;
    for (let i = 0; i < varCount; i++) {
        result += cost[i] * solution[i];
    }
    return result;
}

// fungsi mengcopy solusi
function newSol(newSolution, solution, varCount) {
    for (let i = 0; i < varCount; i++) {
        newSolution[i] = solution[i];
    }
}

// fungsi menentukan nilai z terbesar
function maksZ(values, index) {
    let value = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < index; i++) {
        value = Math.max(value, values[i]);
    }
    return value;
}

// fungsi membandingkan dua solusi
function isEqual(solution1, solution2, varCount) {
    for (let i = 0; i < varCount; i++) {
        if (solution1[i] !== solution2[i]) {
            return false;
        }
    }
    return true;
}

// fungsi menghapus solusi
function deleteSol(solution, varCount) {
    for (let i = 0; i < varCount; i++) {
        solution[i] = null;  // Menggunakan null sebagai nilai kosong
    }
}

//menentukan nilai dari solusi
function valuetab(cost, tabu, varCount){
    let result = 0;
    for(let i = 0; i < varCount; i++){
        result += cost[i] * tabu[i];
    }
    return result;
}

function main() {
    const readline = require('readline-sync');
    let jumVar;
    let solusi = new Solution();
    let cost = new Array(MAX_row).fill(0);
    let valuetabu = new Array(MAX_row).fill(0);

    jumVar = parseInt(readline.question("Masukkan jumlah variabel : "));

    for (let i = 0; i < jumVar; i++) {
        cost[i] = parseFloat(readline.question(`Masukkan cost -${i + 1} : `));
    }

    console.log("\nFungsi tujuannya : \nMax Z = ");
    let funcStr = "Max Z = ";
    for (let i = 0; i < jumVar; i++) {
        funcStr += `${cost[i]}x[${i + 1}] `;
        if (i < jumVar - 1) {
            funcStr += "+ ";
        }
    }
    console.log(funcStr);

    // Langkah 1
    let jumBts;
    let constraint = Array.from({ length: MAX_row }, () => new Array(MAX_col).fill(0));
    let batasan = new Array(MAX_col).fill(0);
    let opr = new Array(MAX_col).fill("");

    jumBts = parseInt(readline.question("Masukkan jumlah batasan : "));
    console.log("");

    for (let i = 0; i < jumBts; i++) {
        console.log(`Masukkan batasan ke -${i + 1} : \n`);

        for (let j = 0; j < jumVar; j++) {
            constraint[i][j] = parseFloat(readline.question(`Masukkan konstanta x[${j + 1}] : `));

            if (j == jumVar - 1) {
                opr[i] = readline.question("pilih (<,>,<=,>=,=,!=) : ");
                batasan[i] = parseFloat(readline.question("Masukkan nilai batasan : "));
            }
        }
    }

    console.log("\nBatasan : \n");
    for (let i = 0; i < jumBts; i++) {
        let constraintStr = `${i + 1}. `;
        for (let j = 0; j < jumVar; j++) {
            constraintStr += `${constraint[i][j]}x[${j + 1}]`;
            if (j < jumVar - 1) {
                constraintStr += " + ";
            } else {
                constraintStr += `${opr[i]}${batasan[i]}`;
            }
        }
        console.log(constraintStr);
    }

    let cek, indeks = 0, temp, TabuList = Array.from({ length: MAX_row }, () => new Array(MAX_col).fill(0)), zero = new Array(MAX_row).fill(0), iter = 0, bestSolution = Array.from({ length: MAX_row }, () => new Array(MAX_col).fill(0));
    let bestValue = new Array(MAX_row).fill(0);
    // definisi solusi kosong
    deleteSol(zero, jumVar);  // Menginisialisasi solusi kosong dengan -1

    // iterasi
    for (let ind = 0; ind < jumVar; ind++) {
        // insisialisasi solusi
        initialSolution(solusi, jumVar, ind);
        while (true) {
            indeks = 0;
            console.log(`Solusi awal S${iter} : `);
            outSolution(solusi.data, jumVar);
            // pencarian tetangga
            for (let i = 0; i < jumVar - 1; i++) {
                for (let j = i + 1; j < jumVar; j++) {
                    temp = solusi.data[j];
                    solusi.data[j] = solusi.data[i];
                    console.log(`S${i},${j} : `);
                    outSolution(solusi.data, jumVar);
                    console.log(`z = ${value(cost, solusi.data, jumVar)}`);
                    if (!isFeasible(solusi.data, constraint, opr, batasan, jumVar, jumBts)) {
                        solusi.feasible = false;
                        console.log("(infeasible)");
                    } else {
                        solusi.feasible = true;
                    }
                    if (solusi.feasible) {
                        bestValue[indeks] = value(cost, solusi.data, jumVar);
                        newSol(bestSolution[indeks], solusi.data, jumVar);
                        indeks++;
                    }
                    solusi.data[j] = temp;
                    console.log("");
                }
            }

            for (let i = 0; i < indeks; i++) {
                if (value(cost, bestSolution[i], jumVar) == maksZ(bestValue, indeks)) {
                    newSol(solusi.data, bestSolution[i], jumVar);
                }
            }
            cek = 0;
            for (let i = 0; i < iter; i++) {
                if (isEqual(TabuList[i], solusi.data, jumVar)) {
                    cek++;
                }
            }
            if (cek == 0) {
                newSol(TabuList[iter], solusi.data, jumVar);
            }
            console.log("\ntabu list :\n");
            for (let i = 0; i < iter + 1; i++) {
                outSolution(TabuList[i], jumVar);
            }
            console.log("");
            iter++;
            if (cek == iter || isEqual(TabuList[iter - 1], zero, jumVar)) {
                break;
            }
            outSolution(solusi.data, jumVar);
        }
    }

selesao:
    for (let i = 0; i < iter; i++) {
        valuetabu[i] = valuetab(cost, TabuList[i], jumVar);
    }
    for (let i = 0; i < iter; i++) {
        if (value(cost, TabuList[i], jumVar) == maksZ(valuetabu, iter)) {
            newSol(solusi.data, TabuList[i], jumVar);
        }
    }

    console.log("solusi terbaik : ");
    outSolution(solusi.data, jumVar);
    console.log(`z = ${maksZ(valuetabu, iter)}`);
}

main();