let candidates = [];
let chairpersons = [];
let parents = [];

document.getElementById('addCandidate').addEventListener('click', addCandidate);
document.getElementById('addChairperson').addEventListener('click', addChairperson);

function addCandidate() {
    const input = document.getElementById('candidateInput').value.trim();
    if (input) {
        const lines = input.split('\n');
        let added = false;
        lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length === 2) {
                const name = parts[0].trim();
                const troop = parts[1].trim();
                if (name && troop && !isNaN(parseInt(troop))) {
                    candidates.push({ name, troop: parseInt(troop) });
                    parents.push(`${name} ${troop} Parent 1`);
                    parents.push(`${name} ${troop} Parent 2`);
                    added = true;
                }
            }
        });
        if (added) {
            document.getElementById('candidateInput').value = '';
            updateDisplay();
        }
    }
}

function addChairperson() {
    const input = document.getElementById('chairpersonInput').value.trim();
    if (input) {
        const lines = input.split('\n');
        let added = false;
        lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length === 2) {
                const name = parts[0].trim();
                const troop = parts[1].trim();
                if (name && troop && !isNaN(parseInt(troop))) {
                    chairpersons.push({ name, troop: parseInt(troop) });
                    added = true;
                }
            }
        });
        if (added) {
            document.getElementById('chairpersonInput').value = '';
            updateDisplay();
        }
    }
}

function updateDisplay() {
    updateList('candidateList', candidates, 'Candidate');
    updateList('chairpersonList', chairpersons, 'Chairperson');
    updateParentList();
    updateStatus();
}

function updateList(listId, items, type) {
    const listDiv = document.getElementById(listId);
    listDiv.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.textContent = `${index + 1}. ${type}: ${item.name}, Troop: ${item.troop}`;
        listDiv.appendChild(div);
    });
}

function updateParentList() {
    const listDiv = document.getElementById('parentList');
    listDiv.innerHTML = '';
    parents.forEach((parent, index) => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.textContent = `${index + 1}. ${parent}`;
        listDiv.appendChild(div);
    });
}

function updateStatus() {
    const statusDiv = document.getElementById('status');
    if (candidates.length === chairpersons.length) {
        statusDiv.textContent = 'Lists are balanced.';
        statusDiv.className = '';
    } else {
        statusDiv.textContent = `Lists have different lengths. Candidates: ${candidates.length}, Chairpersons: ${chairpersons.length}`;
        statusDiv.className = 'error';
    }
}
