let candidates = [];
let chairpersons = [];
let parents = [];

document.getElementById('addCandidate').addEventListener('click', addCandidate);
document.getElementById('addChairperson').addEventListener('click', addChairperson);
document.getElementById('assignButton').addEventListener('click', assign);

function setInvalidStatus(messages) {
    const invalidStatusDiv = document.getElementById('invalidStatus');
    if (messages && messages.length) {
        invalidStatusDiv.textContent = `Invalid entries skipped: ${messages.join('; ')}`;
    } else {
        invalidStatusDiv.textContent = '';
    }
}

function addCandidate() {
    const input = document.getElementById('candidateInput').value.trim();
    if (input) {
        const lines = input.split('\n');
        let added = false;
        const invalidEntries = [];

        lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length === 2) {
                const name = parts[0].trim();
                const troop = parts[1].trim();
                if (name && troop && !isNaN(parseInt(troop))) {
                    candidates.push({ name, troop: parseInt(troop) });
                    parents.push({ candidateName: name, troop: parseInt(troop), parentNum: 1, fullName: `${name} ${troop} Parent 1` });
                    parents.push({ candidateName: name, troop: parseInt(troop), parentNum: 2, fullName: `${name} ${troop} Parent 2` });
                    added = true;
                } else {
                    invalidEntries.push(`${line.trim()} (invalid troop)`);
                }
            } else if (line.trim()) {
                invalidEntries.push(`${line.trim()} (expected format: name,troop)`);
            }
        });

        if (added) {
            document.getElementById('candidateInput').value = '';
            updateDisplay();
            setInvalidStatus(invalidEntries);
        } else if (invalidEntries.length) {
            setInvalidStatus(invalidEntries);
        }
    }
}

function addChairperson() {
    const input = document.getElementById('chairpersonInput').value.trim();
    if (input) {
        const lines = input.split('\n');
        let added = false;
        const invalidEntries = [];

        lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length === 2) {
                const name = parts[0].trim();
                const troop = parts[1].trim();
                if (name && troop && !isNaN(parseInt(troop))) {
                    chairpersons.push({ name, troop: parseInt(troop) });
                    added = true;
                } else {
                    invalidEntries.push(`${line.trim()} (invalid troop)`);
                }
            } else if (line.trim()) {
                invalidEntries.push(`${line.trim()} (expected format: name,troop)`);
            }
        });

        if (added) {
            document.getElementById('chairpersonInput').value = '';
            updateDisplay();
            setInvalidStatus(invalidEntries);
        } else if (invalidEntries.length) {
            setInvalidStatus(invalidEntries);
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
        div.textContent = `${index + 1}. ${parent.fullName}`;
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

function assign() {
    if (candidates.length !== chairpersons.length) {
        alert('Lists must be balanced to assign.');
        return;
    }
    const assignments = [];
    candidates.forEach(candidate => {
        // Find available chairpersons (different troop)
        const availableChairs = chairpersons.filter(chair => chair.troop !== candidate.troop);
        if (availableChairs.length === 0) {
            alert(`No available chairperson for candidate ${candidate.name}`);
            return;
        }
        const chair = availableChairs[Math.floor(Math.random() * availableChairs.length)];

        // Find available parents (not own)
        const availableParents = parents.filter(parent => parent.candidateName !== candidate.name);
        if (availableParents.length < 2) {
            alert(`Not enough available parents for candidate ${candidate.name}`);
            return;
        }
        // Shuffle and pick two
        const shuffled = availableParents.sort(() => 0.5 - Math.random());
        const parent1 = shuffled[0];
        const parent2 = shuffled[1];

        assignments.push(`${candidate.name}, ${chair.name}, ${parent1.fullName}, ${parent2.fullName}`);
    });
    updateAssignmentList(assignments);
}

function updateAssignmentList(assignments) {
    const listDiv = document.getElementById('assignmentList');
    listDiv.innerHTML = '';
    assignments.forEach((assignment, index) => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.textContent = assignment;
        listDiv.appendChild(div);
    });
}
