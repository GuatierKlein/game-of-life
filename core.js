const pixelMatrix = []
let stateMatrix = []
let nextStateMatrix = [];
const frame = document.getElementById("frame")
let simulationIsOn = false
makeGrid(60, 60)
nextStateMatrix = initStateMatrix(60, 60)
document.getElementById("startBtn").onclick = () => toggleStart()
// document.getElementById("exportBtn").onclick = () => exportCells()
document.getElementById("exportJSONBtn").onclick = () => exportCellsJSON()
document.getElementById("resetBtn").onclick = () => reset()
document.getElementById("createOsc1").onclick = () => createStructure(osc1)
document.getElementById("createGlider").onclick = () => createStructure(glider)
document.getElementById("createGliderGun").onclick = () => createStructure(gliderGun)
document.getElementById("importBtn").onclick = () => importCellsJSON()

setInterval(() => {
    if(!simulationIsOn) return
    tick()
}, 150);

function reset() {
    if(simulationIsOn) toggleStart()
    nextStateMatrix = initStateMatrix(60, 60)
    tick()
}

function makeGrid(width, height) {
    for (let i = 0; i < height; i++) {
        const vector = []
        pixelMatrix.push(vector)
        for (let j = 0; j < width; j++) {
            const pixel = document.createElement("div")
            pixel.i = i
            pixel.j = j
            pixel.classList.add("cell")
            frame.appendChild(pixel)
            vector.push(pixel)

            pixel.addEventListener("click", (e) => {
                if(simulationIsOn) return
                if(nextStateMatrix[e.target.i][e.target.j]) {
                    e.target.classList.remove("alive")
                    nextStateMatrix[e.target.i][e.target.j] = false
                    return 
                }
                e.target.classList.add("alive")
                nextStateMatrix[e.target.i][e.target.j] = true
            })
        }
    }
}

function toggleStart() {
    const btn = document.getElementById("startBtn")
    simulationIsOn = !simulationIsOn
    btn.innerHTML = simulationIsOn ? "Pause" : "Start"
}

function updateGrid(stateMatrix) {
    for (let i = 0; i < stateMatrix.length; i++) {
        for (let j = 0; j < stateMatrix[0].length; j++) {
            const pixel = pixelMatrix[i][j]
            pixel.i = i
            pixel.j = j
            if(stateMatrix[i][j]) {
                pixel.classList.add("alive")
                continue
            }
            pixel.classList.remove("alive")
        }
    }
}

function initStateMatrix(width, height) {
    const matrix = []
    for (let i = 0; i < height; i++) {
        const vector = []
        matrix.push(vector)
        for (let j = 0; j < width; j++) {
            vector.push(false)   
        }        
    }
    return matrix
}

function tick() {
    stateMatrix = nextStateMatrix
    nextStateMatrix = initStateMatrix(60, 60)
    for (let i = 0; i < stateMatrix.length; i++) {
        for (let j = 0; j < stateMatrix[0].length; j++) {
            let n = 0;
            const leftOk = j > 0
            const upOk = i > 0
            const downOk = i < stateMatrix.length - 1
            const rightOk = j < stateMatrix[0].length - 1

            if(leftOk && stateMatrix[i][j - 1]) n++
            if(rightOk && stateMatrix[i][j + 1]) n++
            if(upOk && stateMatrix[i - 1][j]) n++
            if(downOk && stateMatrix[i + 1][j]) n++
            if(leftOk && upOk && stateMatrix[i - 1][j - 1]) n++
            if(leftOk && downOk && stateMatrix[i + 1][j - 1]) n++
            if(rightOk && upOk && stateMatrix[i - 1][j + 1]) n++
            if(rightOk && downOk && stateMatrix[i + 1][j + 1]) n++

            if(stateMatrix[i][j]) {
                if(n < 2 || n > 3) continue
                nextStateMatrix[i][j] = true 
                continue
            }
            if(n == 3)  nextStateMatrix[i][j] = true 
        }
    }
    updateGrid(nextStateMatrix)
}

//louis va voir ailleurs si j'y suis

function exportCells() {
    if(simulationIsOn) {
        alert("Veuillez stopper la simulation pour exporter")
        return
    }
    let res = "["
    for (let i = 0; i < nextStateMatrix.length; i++) {
        for (let j = 0; j < nextStateMatrix[0].length; j++) {
            if(!nextStateMatrix[i][j]) continue 
            res += `[${i}, ${j}],`
        }
    }
    res += "]"
    navigator.clipboard.writeText(res)
    alert("Coordonnées des celulles vivantes collées dans votre presse papier")
}

function exportCellsJSON() {
    if(simulationIsOn) {
        alert("Veuillez stopper la simulation pour exporter")
        return
    }
    let res = `{"data" : [`
    for (let i = 0; i < nextStateMatrix.length; i++) {
        for (let j = 0; j < nextStateMatrix[0].length; j++) {
            if(!nextStateMatrix[i][j]) continue 
            res += `["${i}", "${j}"],`
        }
    }
    res = res.substring(0, res.length - 1)
    res += "]}"
    navigator.clipboard.writeText(res)
    alert("Coordonnées des celulles vivantes collées dans votre presse papier")
}

const osc1 = [[23, 22],[24, 22],[25, 22],]
const glider = [[23, 15],[24, 16],[25, 14],[25, 15],[25, 16],]
const gliderGun = [[10, 32],[11, 30],[11, 32],[12, 20],[12, 21],[12, 28],[12, 29],[12, 42],[12, 43],[13, 19],[13, 23],[13, 28],[13, 29],[13, 42],[13, 43],[14, 8],[14, 9],[14, 18],[14, 24],[14, 28],[14, 29],[15, 8],[15, 9],[15, 18],[15, 22],[15, 24],[15, 25],[15, 30],[15, 32],[16, 18],[16, 24],[16, 32],[17, 19],[17, 23],[18, 20],[18, 21],]

function createStructure(structure) {
    for(const cell of structure) {
        nextStateMatrix[cell[0]][cell[1]] = true
        pixelMatrix[cell[0]][cell[1]].classList.add("alive")
    }
}

//louis si tu continues à lire il va y avoir des conséquences 

function importCellsJSON() {
    if(simulationIsOn) {
        alert("Veuillez stopper la simulation pour importer")
        return
    }
    const input = document.getElementById("importInput")
    try {
        const parsedValue = JSON.parse(input.value)
        createStructure(parsedValue.data)
    } catch {
        alert("Import erroné")
    }
}

























































//ok tu l'as cherché, t'as punition est faire pong dnas le langages que tu veux, ça t'appendras à jouer au petit malin


