// script.js

document.addEventListener("DOMContentLoaded", () => {
    const systemTypeSelect = document.getElementById("systemType");
    const membraneNumberSelect = document.getElementById("membraneNumber");
    const elementsPerHousingInput = document.getElementById("elementsPerHousing");
    const roInputs = document.getElementById("roInputs");
    const minilabInputs = document.getElementById("minilabInputs");
    const tab1Button = document.getElementById("tab1Button");
    const tab2Button = document.getElementById("tab2Button");
    const tab3Button = document.getElementById("tab3Button");
    const nextButton1 = document.getElementById("nextButton1");
    const nextButton2 = document.getElementById("nextButton2");
    const submitButton = document.getElementById("submitButton");
    const tab1 = document.getElementById("tab1");
    const tab2 = document.getElementById("tab2");
    const tab3 = document.getElementById("tab3");

    let formData = {};

    // Event listeners for tab navigation
    tab1Button.addEventListener("click", () => showTab(1));
    tab2Button.addEventListener("click", () => showTab(2));
    tab3Button.addEventListener("click", () => showTab(3));
    systemTypeSelect.addEventListener("change", handleSystemTypeChange);
    nextButton1.addEventListener("click", handleNext1);
    nextButton2.addEventListener("click", handleNext2);
    submitButton.addEventListener("click", handleSubmit);

    // Initialize the membrane number options on page load
    handleSystemTypeChange();

    // Function to handle changes in the system type selection
    function handleSystemTypeChange() {
        const selectedSystemType = systemTypeSelect.value;

        if (selectedSystemType === "QuickLab") {
            roInputs.style.display = "block";
            minilabInputs.style.display = "none";
            membraneNumberSelect.innerHTML = `
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            `;
            elementsPerHousingInput.value = 1;
            elementsPerHousingInput.disabled = true;
        } else if (selectedSystemType === "MiniLab") {
            roInputs.style.display = "none";
            minilabInputs.style.display = "block";
        } else if (selectedSystemType === "SkidSpec") {
            roInputs.style.display = "block";
            minilabInputs.style.display = "none";
            membraneNumberSelect.innerHTML = `<option value="">Select membrane number</option>`;
            for (let i = 1; i <= 16; i++) {
                membraneNumberSelect.innerHTML += `<option value="${i}">${i}</option>`;
            }
            elementsPerHousingInput.disabled = false;
            elementsPerHousingInput.value = "";
        }
    }

    // Function to show the correct tab content and update tab button colors
    function showTab(tabNumber) {
        tab1.classList.toggle("active", tabNumber === 1);
        tab2.classList.toggle("active", tabNumber === 2);
        tab3.classList.toggle("active", tabNumber === 3);

        tab1Button.classList.toggle("active", tabNumber === 1);
        tab2Button.classList.toggle("active", tabNumber === 2);
        tab3Button.classList.toggle("active", tabNumber === 3);
    }

    // Capture data from Tab 1 and proceed to Tab 2
    function handleNext1() {
        formData.systemType = systemTypeSelect.value;
        formData.waterType = document.getElementById("waterType").value;
        formData.waterHardness = parseFloat(document.getElementById("waterHardness").value);

        if (formData.systemType === "MiniLab") {
            formData.dailyWaterConsumption = parseFloat(document.getElementById("dailyWaterConsumption").value);
            formData.cityPressureRange = document.getElementById("cityPressureRange").value;
        } else {
            formData.membraneNumber = parseInt(membraneNumberSelect.value);
            formData.elementsPerHousing = parseInt(elementsPerHousingInput.value);
            formData.recoveryPercentage = parseFloat(document.getElementById("recoveryPercentage").value);
        }

        showTab(2);
    }

    // Capture data from Tab 2 and proceed to Tab 3
    function handleNext2() {
        formData.distributionFlow = parseFloat(document.getElementById("distributionFlow").value);
        formData.loopPressure = parseFloat(document.getElementById("loopPressure").value);
        formData.storageTankSize = parseFloat(document.getElementById("storageTankSize").value);

        showTab(3);
    }

    // Capture data from Tab 3 and display the result
    function handleSubmit() {
        formData.roomWidth = parseFloat(document.getElementById("roomWidth").value);
        formData.roomDepth = parseFloat(document.getElementById("roomDepth").value);
        formData.roomHeight = parseFloat(document.getElementById("roomHeight").value);

        const selectedSystemType = determineSystemType(formData);
        const pidFileUrl = `P&ID/${selectedSystemType}/PID_${selectedSystemType}.vsdx`;
        const gaFileUrl = `GA/${selectedSystemType}/GA_${selectedSystemType}.stp`;
        const pidPreviewUrl = `previews/${selectedSystemType}_PID.jpg`;
        const gaPreviewUrl = `previews/${selectedSystemType}_GA.jpg`;

        displayResult(`
            <h4>Recommended System:</h4>
            <p><strong>System Type:</strong> ${selectedSystemType}</p>
            <h5>P&ID Preview:</h5>
            <img src="${pidPreviewUrl}" alt="P&ID Preview" class="preview-image">
            <h5>GA Model Preview:</h5>
            <img src="${gaPreviewUrl}" alt="GA Preview" class="preview-image">
            <p><a href="${pidFileUrl}" download>Download P&ID Visio File</a></p>
            <p><a href="${gaFileUrl}" download>Download GA Model (.stp)</a></p>
        `);
    }

    // Determine the system type based on user inputs
    function determineSystemType(data) {
        if (data.waterHardness > 200 || data.distributionFlow > 50) {
            return "SkidSpec";
        } else if (data.systemType === "MiniLab") {
            return "MiniLab";
        } else if (data.roomWidth < 10 || data.roomDepth < 10 || data.roomHeight < 8) {
            return "QuickLab";
        } else {
            return "SkidSpec";
        }
    }

    // Display the result in the results section
    function displayResult(html) {
        document.getElementById("result").innerHTML = html;
    }
});





