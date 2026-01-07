const OPCODES = {
    "ldi":0b00000000,
    "mov":0b00010000,
    "add":0b00100000,
    "sub":0b00100001,
}
function assembleASM(source) {
    const lines = source.split("\n");
    const binary = [];
    const errors = [];

    lines.forEach((line,idx) => {
        line = line.split(";")[0].trim();
        if(!line) return;

        const parts = line.split(/[\s,]+/);
        const instr = parts[0]?.toLowerCase();

        if(!(instr in OPCODES)) {
            errors.push(`Line ${idx+1}: Unknown instruction "${instr}"`);
        }

        try {
            let bin = [];

            if(instr === "ldi") {
                const value = parseInt(parts[1]);
                const dest = parseInt(parts[2].replace("r",""));
                if(isNaN(value) || isNaN(dest)) errors.push(`Line ${idx+1}: failed to parse arguments`);
                else {
                    bin = [OPCODES[instr],value,0,dest];
                }
            }
            else if(instr === "mov") {
                const src = parseInt(parts[1].replace("r",""));
                const dest = parseInt(parts[2].replace("r",""));
                if(isNaN(src) || isNaN(dest)) errors.push(`Line ${idx+1}: failed to parse arguments`);
                else {
                    bin = [OPCODES[instr],src,0,dest];
                }
            }
            else if(instr === "add" || instr === "sub") {
                const a = parseInt(parts[1].replace("r",""));
                const b = parseInt(parts[2].replace("r",""));
                const d = parseInt(parts[3].replace("r",""));
                if([a,b,d].some(x=>isNaN(x))) errors.push(`Line ${idx+1}: failed to parse arguments`);
                else {
                    bin = [OPCODES[instr],a,b,d];
                }
            }

            const binStr = bin.map(b=>b.toString(2).padStart(8,"0")).join(" ");
            binary.push(binStr);
        } catch(e) {
            throw e;
        }
    });
    return {binary, errors};    
}