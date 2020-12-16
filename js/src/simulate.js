let iteration = 0;
let simulateObject = {
    insertedFile: "",
    spinPositions: [],
    spinDirections: [],
    simulateNew: () => {
        simulateObject.spinPositions = [];
        simulateObject.spinDirections = [];
        var n = 100;
        var webglspins = simulateObject.createwebglspins(n);
        iteration += 1;
        for (var row = 0; row < Math.sqrt(n); row++) {
            for (var column = 0; column < Math.sqrt(n); column++) {
                var spinPosition = [2 * column, 2 * row, 0];
                Array.prototype.push.apply(simulateObject.spinPositions, spinPosition);
                var spinDirection = [
                    Math.sin(column * 0.3) * Math.cos((row + iteration) * 0.05),
                    Math.cos(column * 0.3) * Math.cos((row + iteration) * 0.05),
                    Math.sin((row + iteration) * 0.05)
                ];
                Array.prototype.push.apply(simulateObject.spinDirections, spinDirection);
            }
        }
        webglspins.updateSpins(simulateObject.spinPositions, simulateObject.spinDirections);
    },
    simulateByData: () => {
        var n = simulateObject.spinPositions.length / 3;
        var webglspins = simulateObject.createwebglspins(n);
        webglspins.updateSpins(simulateObject.spinPositions, simulateObject.spinDirections);
    },

    downloadFile: () => {
        const spinsStrings = parseToFile(simulateObject.spinPositions, simulateObject.spinDirections);
        var bbp = new Blob(spinsStrings, { type: 'text/plain' });
        saveAs(bbp, "spins.txt");
    },

    createwebglspins: (n) => {
        return new WebGLSpins(document.getElementById('webgl-canvas'), {
            cameraLocation: [Math.sqrt(n) / 1.5, Math.sqrt(n) * 0.95, Math.sqrt(n) * 2.5],
            centerLocation: [Math.sqrt(n) / 1.5, Math.sqrt(n) * 0.95, 0],
            upVector: [0, 1, 0],
            levelOfDetail: 5,
            backgroundColor: [0.1, 0.11, 0.13],
            renderers: [
                WebGLSpins.renderers.ARROWS, [WebGLSpins.renderers.SPHERE, [0.0, 0.0, 0.2, 0.2]],
                [WebGLSpins.renderers.COORDINATESYSTEM, [0.0, 0.2, 0.2, 0.2]]
            ]
        });
    }
}

function parseToFile(spinPositions, spinDirections) {
    const spinsStrings = [];
    console.log(spinPositions)
    for (let index = 0; index < spinPositions.length; index += 3) {
        let spinPosition = spinPositions.slice(index, index + 3);
        let spinDirection = spinDirections.slice(index, index + 3);

        let pos = spinPosition.map(el => `${el} \t`);
        let dir = spinDirection.map(el => `${el} \t`);
        let result = "";
        pos.forEach(p => result += p);
        dir.forEach(p => result += p);
        // чтобы в последней строке не добавлялся снос
        if (index != spinPositions.length - 3)
            result += "\n";
        spinsStrings.push(result);
    }
    console.log(spinsStrings)
    return spinsStrings;
}

function parseToArrays(text, simulateObject) {
    const spinsStrings = text.split('\n');
    simulateObject.spinPositions = [];
    simulateObject.spinDirections = [];

    for (let index = 0; index < spinsStrings.length; index += 1) {
        let str = spinsStrings[index].split('\t');
        let positions = str.slice(0, 3);
        let directions = str.slice(3, 6);

        for (let index = 0; index < 3; index++) {
            const position = parseFloat(positions[index]);
            const direction = parseFloat(directions[index]);
            simulateObject.spinPositions.push(position);
            simulateObject.spinDirections.push(direction);
        }
    }
}