let candidates = [];
let chairpersons = [];

document.getElementById('addCandidate').addEventListener('click', addCandidate);
document.getElementById('addChairperson').addEventListener('click', addChairperson);

function addCandidate() {
    const name = document.getElementById('candidateName').value.trim();
    const troop = document.getElementById('candidateTroop').value.trim();
    if (name && troop) {
        candidates.push({ name, troop: parseInt(troop) });
        document.getElementById('candidateName').value = '';
        document.getElementById('candidateTroop').value = '';
        updateDisplay();
    }
}

function addChairperson() {
    const name = document.getElementById('chairpersonName').value.trim();
    const troop = document.getElementById('chairpersonTroop').value.trim();
    if (name && troop) {
        chairpersons.push({ name, troop: parseInt(troop) });
        document.getElementById('chairpersonName').value = '';
        document.getElementById('chairpersonTroop').value = '';
        updateDisplay();
    }
}

function updateDisplay() {
    updateList('candidateList', candidates, 'Candidate');
    updateList('chairpersonList', chairpersons, 'Chairperson');
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
