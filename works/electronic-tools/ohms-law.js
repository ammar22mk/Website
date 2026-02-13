function parseValue(value) {
  if (value === '' || value === null || typeof value === 'undefined') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function formatValue(value, unit) {
  if (!Number.isFinite(value)) return '-';
  const absValue = Math.abs(value);
  let scaled = value;
  let suffix = unit;

  if (absValue >= 1e6) {
    scaled = value / 1e6;
    suffix = `M${unit}`;
  } else if (absValue >= 1e3) {
    scaled = value / 1e3;
    suffix = `k${unit}`;
  } else if (absValue > 0 && absValue < 1e-3) {
    scaled = value * 1e6;
    suffix = `u${unit}`;
  } else if (absValue > 0 && absValue < 1) {
    scaled = value * 1e3;
    suffix = `m${unit}`;
  }

  return `${scaled.toPrecision(4)} ${suffix}`;
}

function solveOhmsLaw(values) {
  const { V, I, R, P } = values;

  if (V != null && I != null) {
    if (I === 0) return { error: 'Current cannot be zero when using V and I.' };
    return {
      V,
      I,
      R: V / I,
      P: V * I
    };
  }

  if (V != null && R != null) {
    if (R === 0) return { error: 'Resistance cannot be zero when using V and R.' };
    const Icalc = V / R;
    return {
      V,
      I: Icalc,
      R,
      P: V * Icalc
    };
  }

  if (I != null && R != null) {
    return {
      V: I * R,
      I,
      R,
      P: I * I * R
    };
  }

  if (P != null && V != null) {
    if (V === 0) return { error: 'Voltage cannot be zero when using P and V.' };
    const Icalc = P / V;
    return {
      V,
      I: Icalc,
      R: V / Icalc,
      P
    };
  }

  if (P != null && I != null) {
    if (I === 0) return { error: 'Current cannot be zero when using P and I.' };
    const Vcalc = P / I;
    return {
      V: Vcalc,
      I,
      R: Vcalc / I,
      P
    };
  }

  if (P != null && R != null) {
    if (P < 0 || R < 0) return { error: 'Power and resistance must be positive.' };
    const Vcalc = Math.sqrt(P * R);
    if (Vcalc === 0) return { error: 'Voltage cannot be zero when using P and R.' };
    return {
      V: Vcalc,
      I: Vcalc / R,
      R,
      P
    };
  }

  return { error: 'Enter any two values to solve the rest.' };
}

function getProvidedCount(values) {
  return Object.values(values).filter((value) => value != null).length;
}

function hasValues(values, keys) {
  return keys.every((key) => values[key] != null);
}

document.addEventListener('DOMContentLoaded', () => {
  const inputVoltage = document.getElementById('ohm-voltage');
  const inputCurrent = document.getElementById('ohm-current');
  const inputResistance = document.getElementById('ohm-resistance');
  const inputPower = document.getElementById('ohm-power');
  const voltageUnit = document.getElementById('ohm-voltage-unit');
  const currentUnit = document.getElementById('ohm-current-unit');
  const resistanceUnit = document.getElementById('ohm-resistance-unit');
  const powerUnit = document.getElementById('ohm-power-unit');
  const output = document.getElementById('ohm-output');
  const solveBtn = document.getElementById('ohm-solve');
  const clearBtn = document.getElementById('ohm-clear');
  const modeLabel = document.getElementById('ohm-mode');
  const solverGrid = document.getElementById('solver-grid');
  const formulaButtons = Array.from(document.querySelectorAll('.ohm-segment'));
  const centerButtons = Array.from(document.querySelectorAll('.ohm-center-segment'));

  let activeFormula = null;
  let activeTarget = null;

  const formulaMap = {
    v_ir: { target: 'V', requires: ['I', 'R'], label: 'V = I · R' },
    v_pi: { target: 'V', requires: ['P', 'I'], label: 'V = P / I' },
    v_pr: { target: 'V', requires: ['P', 'R'], label: 'V = √PR' },
    i_vr: { target: 'I', requires: ['V', 'R'], label: 'I = V / R' },
    i_pv: { target: 'I', requires: ['P', 'V'], label: 'I = P / V' },
    i_pr: { target: 'I', requires: ['P', 'R'], label: 'I = √P/R' },
    r_vi: { target: 'R', requires: ['V', 'I'], label: 'R = V / I' },
    r_vp: { target: 'R', requires: ['V', 'P'], label: 'R = V² / P' },
    r_pi: { target: 'R', requires: ['P', 'I'], label: 'R = P / I²' },
    p_vi: { target: 'P', requires: ['V', 'I'], label: 'P = V · I' },
    p_vr: { target: 'P', requires: ['V', 'R'], label: 'P = V² / R' },
    p_ir: { target: 'P', requires: ['I', 'R'], label: 'P = I² · R' }
  };

  const inputs = {
    V: inputVoltage,
    I: inputCurrent,
    R: inputResistance,
    P: inputPower
  };

  const primaryResult = document.getElementById('primary-result');
  const resultValue = document.getElementById('result-value');
  const resultUnitDisplay = document.getElementById('result-unit');

  function updateInputState() {
    const target = activeTarget || (activeFormula ? formulaMap[activeFormula].target : null);
    
    let requiredInputs = ['V', 'I', 'R', 'P'];
    if (activeFormula) {
      requiredInputs = formulaMap[activeFormula].requires;
    } else if (target) {
      requiredInputs = ['V', 'I', 'R', 'P'].filter(k => k !== target);
    }

    if (target) {
      primaryResult.style.display = 'block';
      let label = target === 'V' ? 'Voltage' : target === 'I' ? 'Current' : target === 'R' ? 'Resistance' : 'Power';
      let unit = target === 'V' ? 'Volts' : target === 'I' ? 'Amperes' : target === 'R' ? 'Ω' : 'Watts';
      document.querySelector('.result-label').textContent = `Target: ${label}`;
      resultUnitDisplay.textContent = unit;
    } else {
      primaryResult.style.display = 'none';
    }

    const fieldMap = {
      V: document.getElementById('field-v'),
      I: document.getElementById('field-i'),
      R: document.getElementById('field-r'),
      P: document.getElementById('field-p')
    };

    Object.keys(fieldMap).forEach((key) => {
      const field = fieldMap[key];
      const isRequired = requiredInputs.includes(key);
      const isTarget = key === target;

      if (isTarget) {
        field.classList.add('is-hidden');
      } else if (target && !isRequired) {
        field.classList.add('is-hidden');
      } else {
        field.classList.remove('is-hidden');
      }
      
      const input = inputs[key];
      input.removeAttribute('readonly');
      input.classList.remove('is-locked');
      input.placeholder = isTarget ? '' : `Enter ${key}`;
    });
  }

  function focusFirstRequiredInput() {
    const target = activeTarget || (activeFormula ? formulaMap[activeFormula].target : null);
    if (!target) return;

    const firstInputKey = Object.keys(inputs).find((key) => key !== target);
    if (firstInputKey && inputs[firstInputKey]) {
      inputs[firstInputKey].focus();
    }
  }

  function collectValues(onlyUser = false) {
    const vUnit = Number(voltageUnit.value) || 1;
    const iUnit = Number(currentUnit.value) || 1;
    const rUnit = Number(resistanceUnit.value) || 1;
    const pUnit = Number(powerUnit.value) || 1;

    const getVal = (input, unit) => {
      if (onlyUser && input.dataset.userProvided !== 'true') return null;
      const val = parseValue(input.value);
      return val != null ? val * unit : null;
    };

    return {
      V: getVal(inputVoltage, vUnit),
      I: getVal(inputCurrent, iUnit),
      R: getVal(inputResistance, rUnit),
      P: getVal(inputPower, pUnit)
    };
  }

  function solveWithFormula(values, formulaId) {
    const formula = formulaMap[formulaId];
    if (!formula) return { error: 'Select a formula.' };
    if (!hasValues(values, formula.requires)) {
      return { error: `Provide ${formula.requires.join(' and ')} to use ${formula.label}.` };
    }

    const { V, I, R, P } = values;
    switch (formulaId) {
      case 'v_ir':
        return { V: I * R, I, R, P: I * I * R };
      case 'v_pi':
        return { V: P / I, I, R: P / (I * I), P };
      case 'v_pr': {
        const Vcalc = Math.sqrt(P * R);
        return { V: Vcalc, I: Vcalc / R, R, P };
      }
      case 'i_vr':
        return { V, I: V / R, R, P: V * V / R };
      case 'i_pv':
        return { V, I: P / V, R: V * V / P, P };
      case 'i_pr': {
        const Icalc = Math.sqrt(P / R);
        return { V: Icalc * R, I: Icalc, R, P };
      }
      case 'r_vi':
        return { V, I, R: V / I, P: V * I };
      case 'r_vp':
        return { V, I: P / V, R: V * V / P, P };
      case 'r_pi':
        return { V: P / I, I, R: P / (I * I), P };
      case 'p_vi':
        return { V, I, R: V / I, P: V * I };
      case 'p_vr':
        return { V, I: V / R, R, P: V * V / R };
      case 'p_ir':
        return { V: I * R, I, R, P: I * I * R };
      default:
        return { error: 'Unsupported formula.' };
    }
  }

  function updateWheel(values) {
    formulaButtons.forEach((button) => {
      const formulaId = button.dataset.formula;
      const formula = formulaMap[formulaId];
      const available = formula ? hasValues(values, formula.requires) : false;
      const target = button.dataset.target;
      
      button.classList.toggle('is-available', available);
      button.classList.toggle('is-active', activeFormula === formulaId);
      button.classList.toggle('is-dimmed', activeTarget && target !== activeTarget);
      button.setAttribute('aria-pressed', activeFormula === formulaId ? 'true' : 'false');
    });

    centerButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.variable === activeTarget);
    });

    if (modeLabel) {
      if (activeTarget) {
        modeLabel.textContent = `Target: ${activeTarget}`;
      } else if (activeFormula && formulaMap[activeFormula]) {
        modeLabel.textContent = `Mode: ${formulaMap[activeFormula].label}`;
      } else {
        modeLabel.textContent = 'Mode: Auto';
      }
    }
    
    updateInputState();
  }

  function renderResult(result) {
    if (result.error) {
      output.textContent = result.error;
      Object.values(inputs).forEach(i => i.classList.remove('is-result'));
      return;
    }

    const vUnit = Number(voltageUnit.value) || 1;
    const iUnit = Number(currentUnit.value) || 1;
    const rUnit = Number(resistanceUnit.value) || 1;
    const pUnit = Number(powerUnit.value) || 1;

    const target = activeTarget || (activeFormula ? formulaMap[activeFormula].target : null);
    
    const updateField = (input, val, unitVal) => {
        input.value = (val / unitVal)
            .toFixed(6)
            .replace(/\.0+$/, '')
            .replace(/(\.\d+?)0+$/, '$1');
    };

    updateField(inputVoltage, result.V, vUnit);
    updateField(inputCurrent, result.I, iUnit);
    updateField(inputResistance, result.R, rUnit);
    updateField(inputPower, result.P, pUnit);

    if (target) {
        const val = target === 'V' ? result.V : target === 'I' ? result.I : target === 'R' ? result.R : result.P;
        const unitLabel = target === 'V' ? 'V' : target === 'I' ? 'A' : target === 'R' ? 'Ω' : 'W'; 
        
        if (Number.isFinite(val)) {
             resultValue.textContent = formatValue(val, unitLabel).split(' ')[0];
             resultUnitDisplay.textContent = formatValue(val, unitLabel).split(' ')[1];
        } else {
             resultValue.textContent = "---";
        }
    }

    output.textContent = `V=${formatValue(result.V, 'V')} | I=${formatValue(result.I, 'A')} | R=${formatValue(result.R, 'Ohm')} | P=${formatValue(result.P, 'W')}`;
  }

  function handleSolve() {
    const values = collectValues();
    const provided = getProvidedCount(values);

    if (provided < 2) {
      output.textContent = 'Enter at least two values to solve.';
      updateWheel(values);
      return;
    }

    const result = activeFormula ? solveWithFormula(values, activeFormula) : solveOhmsLaw(values);
    renderResult(result);
    updateWheel(collectValues(true));
  }

  function handleAutoSolve() {
    const values = collectValues();
    const provided = getProvidedCount(values);

    if (provided < 2) {
      if (!activeTarget) {
         output.textContent = 'Enter at least two values to solve.';
      }
      updateWheel(collectValues(true));
      return;
    }

    const result = activeFormula ? solveWithFormula(values, activeFormula) : solveOhmsLaw(values);
    renderResult(result);
    updateWheel(collectValues(true));
  }

  function handleClear() {
    inputVoltage.value = '';
    inputCurrent.value = '';
    inputResistance.value = '';
    inputPower.value = '';
    
    delete inputVoltage.dataset.userProvided;
    delete inputCurrent.dataset.userProvided;
    delete inputResistance.dataset.userProvided;
    delete inputPower.dataset.userProvided;
    
    output.textContent = 'Waiting for input...';
    primaryResult.style.display = 'none';
    activeFormula = null;
    activeTarget = null;
    
    updateInputState();
    updateWheel(collectValues());
  }

  solveBtn.addEventListener('click', handleSolve);
  clearBtn.addEventListener('click', handleClear);

  centerButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = button.dataset.variable;
      if (activeTarget === target) {
        activeTarget = null;
      } else {
        activeTarget = target;
        activeFormula = null;
      }
      updateWheel(collectValues());
      
      if (activeTarget) {
          focusFirstRequiredInput();
      }
    });
    
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        button.click();
      }
    });
  });

  formulaButtons.forEach((button) => {
    const toggleFormula = () => {
      const formulaId = button.dataset.formula;
      activeFormula = activeFormula === formulaId ? null : formulaId;
      handleAutoSolve();
      
      if (activeFormula) {
        focusFirstRequiredInput();
      }
    };

    button.addEventListener('click', toggleFormula);
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFormula();
      }
    });
  });

  [
    inputVoltage,
    inputCurrent,
    inputResistance,
    inputPower,
    voltageUnit,
    currentUnit,
    resistanceUnit,
    powerUnit
  ].forEach((field) => {
    field.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            e.target.dataset.userProvided = 'true';
        }
        handleAutoSolve();
    });
    field.addEventListener('change', handleAutoSolve);
  });

  updateWheel(collectValues());
});
