const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});

// --- INTERACTIVE HYSTERESIS PLOT ---

let hysteresisData = {};

// 1. Fetch the JSON data
fetch('hysteresis_data.json')
    .then(response => response.json())
    .then(data => {
        hysteresisData = data;
        initPlot();
    })
    .catch(error => console.error('Error loading JSON data:', error));

// 2. Initialize the plot with Ne=1
function initPlot() {
    const trace = {
        x: hysteresisData["Ne_1"].A_list,
        y: hysteresisData["Ne_1"].dipoles,
        mode: 'lines',
        line: {color: '#4da8da', width: 3}, // Matches your button color
        name: 'Polarization'
    };

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)', // Fully transparent to show the glass card
        plot_bgcolor: 'rgba(0,0,0,0)',  // Fully transparent
        font: { color: '#e0e0e0' },
        xaxis: { 
            title: 'External Field Strength (A)', 
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.3)'
        },
        yaxis: { 
            title: 'Polarization (Dipole Moment)', 
            gridcolor: 'rgba(255,255,255,0.1)',
            zerolinecolor: 'rgba(255,255,255,0.3)'
        },
        margin: { l: 50, r: 20, t: 20, b: 40 }
    };

    // Draw the plot
    Plotly.newPlot('hysteresis-plot', [trace], layout, {responsive: true});
}

// 3. Listen to the slider and update the graph
const slider = document.getElementById('ne-slider');
const neValueDisplay = document.getElementById('ne-value');

slider.addEventListener('input', function() {
    const ne = this.value;
    neValueDisplay.textContent = ne; // Update the text label
    
    // Get the new data for the selected electron count
    const selectedData = hysteresisData[`Ne_${ne}`];
    
    // Animate the plot to the new shape
    Plotly.animate('hysteresis-plot', {
        data: [{x: selectedData.A_list, y: selectedData.dipoles}]
    }, {
        transition: {
            duration: 400,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 400
        }
    });
});