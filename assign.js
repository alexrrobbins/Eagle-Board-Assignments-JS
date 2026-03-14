let candidates = [];
let chairpersons = [];
let parents = [];
let lastAssignments = [];

document.getElementById('addCandidate').addEventListener('click', addCandidate);
document.getElementById('addChairperson').addEventListener('click', addChairperson);
document.getElementById('assignButton').addEventListener('click', assign);
document.getElementById('copyButton').addEventListener('click', copyAssignments);
document.getElementById('clearButton').addEventListener('click', clearAll);

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

function setAssignmentErrors(unassigned) {
    const statusDiv = document.getElementById('status');
    if (unassigned && unassigned.length) {
        statusDiv.textContent = `Unassigned candidates:\n${unassigned.join('\n')}`;
        statusDiv.className = 'error';
    } else {
        updateStatus();
    }
}

function assign() {
    if (candidates.length !== chairpersons.length) {
        alert('Lists must be balanced to assign.');
        return;
    }

    // Use mutable copies so we can remove assigned people and avoid duplicates.
    const remainingChairs = [...chairpersons];
    const remainingParents = [...parents];

    const assignments = [];
    const unassigned = [];

    for (const candidate of candidates) {
        // Find available chairpersons (different troop)
        const availableChairs = remainingChairs.filter(chair => chair.troop !== candidate.troop);
        if (availableChairs.length === 0) {
            unassigned.push(`${candidate.name}: no available chairperson`);
            continue;
        }

        const chair = availableChairs[Math.floor(Math.random() * availableChairs.length)];

        // Find available parents (not own) within remaining parents
        const availableParents = remainingParents.filter(parent => parent.candidateName !== candidate.name);
        if (availableParents.length < 2) {
            unassigned.push(`${candidate.name}: not enough available parents`);
            continue;
        }

        // Shuffle and pick two
        const shuffled = availableParents.sort(() => 0.5 - Math.random());
        const parent1 = shuffled[0];
        const parent2 = shuffled[1];

        // Remove selected resources so they aren't assigned again
        const chairIndex = remainingChairs.findIndex(ch => ch === chair);
        if (chairIndex !== -1) remainingChairs.splice(chairIndex, 1);

        const removeParent = (parent) => {
            const idx = remainingParents.findIndex(p => p === parent);
            if (idx !== -1) remainingParents.splice(idx, 1);
        };
        removeParent(parent1);
        removeParent(parent2);

        assignments.push(`${candidate.name}, ${chair.name}, ${parent1.fullName}, ${parent2.fullName}`);
    }

    updateAssignmentList(assignments);
    setAssignmentErrors(unassigned);
}

function updateAssignmentList(assignments) {
    lastAssignments = assignments;

    const listDiv = document.getElementById('assignmentList');
    listDiv.innerHTML = '';

    assignments.forEach((assignment, index) => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.textContent = assignment;
        listDiv.appendChild(div);
    });
}

function copyAssignments() {
    if (!lastAssignments || !lastAssignments.length) {
        alert('No assignment results to copy.');
        return;
    }

    const text = lastAssignments.join('\n');
    navigator.clipboard.writeText(text)
        .then(() => alert('Assignment results copied to clipboard.'))
        .catch(() => alert('Unable to copy to clipboard.'));
}

function clearAll() {
    candidates = [];
    chairpersons = [];
    parents = [];
    lastAssignments = [];

    document.getElementById('candidateInput').value = '';
    document.getElementById('chairpersonInput').value = '';

    updateAssignmentList([]);
    updateDisplay();
    setInvalidStatus([]);
    setAssignmentErrors([]);
}
