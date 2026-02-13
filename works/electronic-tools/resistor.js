document.addEventListener('DOMContentLoaded', () => {
  const colorData = {
    significant: {
      black: { value: 0, color: '#222222' },
      brown: { value: 1, color: '#654321' },
      red: { value: 2, color: '#C80000' },
      orange: { value: 3, color: '#FF6600' },
      yellow: { value: 4, color: '#FFCC00' },
      green: { value: 5, color: '#008000' },
      blue: { value: 6, color: '#0033CC' },
      violet: { value: 7, color: '#660099' },
      grey: { value: 8, color: '#808080' },
      white: { value: 9, color: '#FFFFFF' }
    },
    multiplier: {
      black: { value: 1, color: '#222222' },
      brown: { value: 10, color: '#654321' },
      red: { value: 100, color: '#C80000' },
      orange: { value: 1e3, color: '#FF6600' },
      yellow: { value: 1e4, color: '#FFCC00' },
      green: { value: 1e5, color: '#008000' },
      blue: { value: 1e6, color: '#0033CC' },
      violet: { value: 1e7, color: '#660099' },
      gold: { value: 0.1, color: '#B8860B' },
      silver: { value: 0.01, color: '#A9A9A9' }
    },
    tolerance: {
      brown: { value: '+/-1%', color: '#654321' },
      red: { value: '+/-2%', color: '#C80000' },
      green: { value: '+/-0.5%', color: '#008000' },
      blue: { value: '+/-0.25%', color: '#0033CC' },
      violet: { value: '+/-0.1%', color: '#660099' },
      gold: { value: '+/-5%', color: '#B8860B' },
      silver: { value: '+/-10%', color: '#A9A9A9' },
      none: { value: '+/-20%', color: '#DCDCDC' }
    },
    tcr: {
      brown: { value: '100 ppm/K', color: '#654321' },
      red: { value: '50 ppm/K', color: '#C80000' },
      orange: { value: '15 ppm/K', color: '#FF6600' },
      yellow: { value: '25 ppm/K', color: '#FFCC00' },
      blue: { value: '10 ppm/K', color: '#0033CC' },
      violet: { value: '5 ppm/K', color: '#660099' }
    }
  };

  const svgBandElements = Array.from({ length: 6 }, (_, i) => document.getElementById(`svg-band${i + 1}`));
  const colorPalette = document.getElementById('color-palette');
  const colorNamePreview = document.getElementById('color-name-preview');
  const swatchesContainer = document.getElementById('palette-swatches');

  let activeBand = null;

  let resistorState = {
    bands: 4,
    colors: ['brown', 'black', 'black', 'gold', 'blue', 'brown']
  };

  function getBandConfig(numBands) {
    if (numBands === 3) return { types: ['significant', 'significant', 'multiplier'] };
    if (numBands === 4) return { types: ['significant', 'significant', 'multiplier', 'tolerance'] };
    if (numBands === 5) return { types: ['significant', 'significant', 'significant', 'multiplier', 'tolerance'] };
    if (numBands === 6) return { types: ['significant', 'significant', 'significant', 'multiplier', 'tolerance', 'tcr'] };
    return { types: [] };
  }

  function normalizeBandColors(numBands) {
    const defaults = {
      significant: 'brown',
      multiplier: 'black',
      tolerance: 'gold',
      tcr: 'brown'
    };
    const types = getBandConfig(numBands).types;

    resistorState.colors = resistorState.colors.map((colorName, index) => {
      const bandType = types[index];
      if (!bandType) return colorName;
      const valid = colorData[bandType] && colorData[bandType][colorName];
      return valid ? colorName : defaults[bandType];
    });
  }

  function formatResistance(value) {
    if (value >= 1e9) return (value / 1e9).toPrecision(3) + ' GOhm';
    if (value >= 1e6) return (value / 1e6).toPrecision(3) + ' MOhm';
    if (value >= 1e3) return (value / 1e3).toPrecision(3) + ' kOhm';
    if (value < 1) return (value * 1000).toPrecision(3) + ' mOhm';
    return value.toPrecision(3) + ' Ohm';
  }

  function calculateAndDisplay() {
    const config = getBandConfig(resistorState.bands);
    const { types } = config;
    const colors = resistorState.colors;

    let resistance = 0;
    let tolerance = '';
    let tcr = '';

    try {
      if (types.length === 3) {
        const [val1, val2] = [colorData.significant[colors[0]].value, colorData.significant[colors[1]].value];
        const multiplier = colorData.multiplier[colors[2]].value;
        tolerance = colorData.tolerance.none.value;
        resistance = (val1 * 10 + val2) * multiplier;
      } else if (types.length === 4) {
        const [val1, val2] = [colorData.significant[colors[0]].value, colorData.significant[colors[1]].value];
        const multiplier = colorData.multiplier[colors[2]].value;
        tolerance = colorData.tolerance[colors[3]].value;
        resistance = (val1 * 10 + val2) * multiplier;
      } else if (types.length >= 5) {
        const [val1, val2, val3] = [
          colorData.significant[colors[0]].value,
          colorData.significant[colors[1]].value,
          colorData.significant[colors[2]].value
        ];
        const multiplier = colorData.multiplier[colors[3]].value;
        tolerance = colorData.tolerance[colors[4]].value;
        resistance = (val1 * 100 + val2 * 10 + val3) * multiplier;
        if (types.length === 6) {
          tcr = colorData.tcr[colors[5]]?.value || '-';
        }
      }

      document.getElementById('resistance-value').textContent = `${formatResistance(resistance)} ${tolerance}`;
      const tcrContainer = document.getElementById('tcr-value-container');
      if (types.length === 6) {
        document.getElementById('tcr-value').textContent = tcr;
        tcrContainer.style.display = 'block';
      } else {
        tcrContainer.style.display = 'none';
      }
    } catch (error) {
      document.getElementById('resistance-value').textContent = 'Invalid selection';
      console.error('Calculation error:', error);
    }

    updateSvgBands();
  }

  function updateSvgBands() {
    const config = getBandConfig(resistorState.bands);
    const { types } = config;
    const bandLayouts = {
      3: [0, 1, 2],
      4: [0, 1, 2, 4],
      5: [0, 1, 2, 3, 4],
      6: [0, 1, 2, 3, 4, 5]
    };
    const layout = bandLayouts[resistorState.bands] || [];

    for (let i = 0; i < 6; i += 1) {
      svgBandElements[i].style.display = 'none';
      svgBandElements[i].style.fill = 'transparent';
      delete svgBandElements[i].dataset.logicalIndex;
    }

    layout.forEach((svgIndex, logicalIndex) => {
      const bandType = types[logicalIndex];
      const colorName = resistorState.colors[logicalIndex];
      const colorValue = colorData[bandType]?.[colorName]?.color || 'transparent';
      const bandEl = svgBandElements[svgIndex];
      bandEl.style.fill = colorValue;
      bandEl.style.display = 'block';
      bandEl.dataset.logicalIndex = String(logicalIndex);
    });
  }

  function showColorPalette(bandElement, bandIndex) {
    activeBand = { element: bandElement, index: bandIndex };
    const bandType = getBandConfig(resistorState.bands).types[bandIndex];
    const colors = colorData[bandType];

    swatchesContainer.innerHTML = '';
    Object.entries(colors).forEach(([name, data]) => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = data.color;
      if (['#FFFFFF', '#FFCC00', '#DCDCDC', '#A9A9A9'].includes(data.color)) {
        swatch.style.border = '1px solid #ddd';
      }
      swatch.dataset.colorName = name;
      swatchesContainer.appendChild(swatch);
    });

    const rect = bandElement.getBoundingClientRect();
    colorPalette.style.display = 'block';
    colorPalette.style.top = `${rect.bottom + window.scrollY + 10}px`;
    const leftPos = rect.left + window.scrollX + rect.width / 2 - colorPalette.offsetWidth / 2;
    colorPalette.style.left = `${Math.max(0, leftPos)}px`;
    colorNamePreview.textContent = 'Select a color';
  }

  document.querySelector('.band-selector').addEventListener('change', (e) => {
    resistorState.bands = parseInt(e.target.value, 10);
    normalizeBandColors(resistorState.bands);
    calculateAndDisplay();
  });

  svgBandElements.forEach((band) => {
    band.addEventListener('click', (e) => {
      e.stopPropagation();
      const logicalIndex = parseInt(band.dataset.logicalIndex, 10);
      if (Number.isNaN(logicalIndex)) return;
      showColorPalette(band, logicalIndex);
    });
  });

  colorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-swatch')) {
      const colorName = e.target.dataset.colorName;
      if (activeBand) {
        resistorState.colors[activeBand.index] = colorName;
        calculateAndDisplay();
      }
      colorPalette.style.display = 'none';
    }
  });

  swatchesContainer.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('color-swatch')) {
      colorNamePreview.textContent = e.target.dataset.colorName;
    }
  });

  swatchesContainer.addEventListener('mouseout', () => {
    colorNamePreview.textContent = 'Select a color';
  });

  window.addEventListener('click', (e) => {
    if (colorPalette.style.display === 'block' && !colorPalette.contains(e.target)) {
      colorPalette.style.display = 'none';
    }
  });

  calculateAndDisplay();
});
