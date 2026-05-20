// custom-blueprint.js - Custom business blueprint request and API integration

const CUSTOM_BLUEPRINT_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('custom-blueprint-form');
    if (!form) return;

    /* Chip selector */
    const bizGrid = document.getElementById('biz-type-grid');
    const bizInput = document.getElementById('client-business-type');
    const bizError = document.getElementById('biz-type-error');
    if (bizGrid) {
        bizGrid.querySelectorAll('.biz-type-chip').forEach(function(chip) {
            chip.addEventListener('click', function() {
                bizGrid.querySelectorAll('.biz-type-chip').forEach(function(c) { c.classList.remove('selected'); });
                chip.classList.add('selected');
                if (bizInput) bizInput.value = chip.getAttribute('data-value') || '';
                if (bizError) bizError.style.display = 'none';
            });
        });
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        /* Validate chip selection */
        if (bizInput && !bizInput.value.trim()) {
            if (bizError) bizError.style.display = 'block';
            if (bizGrid) bizGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        await submitCustomBlueprint();
    });

    renderSavedBlueprint();
});

async function submitCustomBlueprint() {
    const name = document.getElementById('client-name').value.trim();
    const country = document.getElementById('client-country').value.trim();
    const city = document.getElementById('client-city').value.trim();
    const businessType = document.getElementById('client-business-type').value.trim();
    const capital = document.getElementById('client-capital').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const details = document.getElementById('client-details').value.trim();

    if (!name || !country || !city || !businessType || !capital || !email || !phone) {
        alert('Please complete every field to request your custom blueprint.');
        return;
    }

    const requestData = {
        clientName: name,
        country,
        city,
        businessType,
        capital,
        email,
        phone,
        details,
        createdAt: new Date().toISOString()
    };

    const requestStatus = document.getElementById('custom-request-status');
    requestStatus.textContent = 'Sending your custom blueprint request...';
    requestStatus.className = 'page-notice';

    try {
        const response = await fetch(CUSTOM_BLUEPRINT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();
        const blueprintRecord = {
            id: result.id || Date.now(),
            ...requestData,
            apiResponse: result,
            status: 'Request received',
            preview: generateBlueprintPreview(requestData)
        };

        saveCustomBlueprint(blueprintRecord);
        renderCustomBlueprint(blueprintRecord);
        requestStatus.textContent = 'Your custom blueprint request is confirmed and will be sent to your email shortly.';
    } catch (error) {
        requestStatus.textContent = 'There was an issue sending your request. Please try again later.';
        requestStatus.style.color = '#d9534f';
        console.error('Custom blueprint API error', error);
    }
}

function generateBlueprintPreview(data) {
    return `A personalized business blueprint for ${data.clientName} in ${data.city}, ${data.country}, focusing on ${data.businessType}. Capital planning is set at ${data.capital}. Key next steps include market validation, cash flow planning, and growth strategy for digital and local channels.`;
}

function saveCustomBlueprint(record) {
    const history = JSON.parse(localStorage.getItem('customBlueprintRequests') || '[]');
    history.unshift(record);
    localStorage.setItem('customBlueprintRequests', JSON.stringify(history.slice(0, 10)));
}

function renderCustomBlueprint(record) {
    const result = document.getElementById('custom-blueprint-result');
    if (!result) return;

    result.innerHTML = `
        <div class="section-card">
            <h3>Custom Blueprint Preview</h3>
            <p><strong>Status:</strong> ${record.status}</p>
            <p>${record.preview}</p>
            <p><strong>Email:</strong> ${record.email}</p>
            <p><strong>Expected delivery:</strong> Within 24 hours via email.</p>
            <button class="button secondary" id="download-custom-blueprint">Download Preview</button>
        </div>
    `;

    const downloadButton = document.getElementById('download-custom-blueprint');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            downloadCustomBlueprint(record);
        });
    }
}

function renderSavedBlueprint() {
    const history = JSON.parse(localStorage.getItem('customBlueprintRequests') || '[]');
    const result = document.getElementById('custom-blueprint-result');
    if (!result) return;
    if (history.length === 0) {
        result.innerHTML = '<div class="page-notice">Submit your details to create a custom business blueprint that is tailored to your market and capital.</div>';
        return;
    }
    renderCustomBlueprint(history[0]);
}

function downloadCustomBlueprint(record) {
    const content = `Negosyo Plan Custom Blueprint\n\nClient: ${record.clientName}\nBusiness Type: ${record.businessType}\nLocation: ${record.city}, ${record.country}\nCapital: ${record.capital}\nContact: ${record.email} | ${record.phone}\n\nBlueprint Overview:\n${record.preview}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `negosyo-plan-custom-blueprint-${record.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
