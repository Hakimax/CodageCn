// Theme and UI Management
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Initialize color picker
    const savedColor = localStorage.getItem('themeColor') || '#00ff00';
    document.getElementById('themeColor').value = savedColor;
    updateThemeColor(savedColor);

    // Initialize mode selector
    initializeModeSelector();
    
    // Initialize step-by-step toggle
    initializeStepByStep();

    // Ajouter l'indicateur hors ligne
    const offlineIndicator = document.createElement('div');
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.textContent = 'Offline Mode';
    document.body.appendChild(offlineIndicator);
    
    // Initialiser l'historique
    updateHistoryDisplay();
    
    // Vérifier le statut hors ligne
    updateOfflineStatus();

    // Initialize bit calculator
    initializeBitCalculator();

    // Add event listener for IEEE 754 conversion
    const ieeeConvertBtn = document.querySelector('#floatingSection button');
    if (ieeeConvertBtn) {
        ieeeConvertBtn.addEventListener('click', convertIEEE);
    }

    // Add event listener for ASCII/Unicode conversion
    const asciiConvertBtn = document.getElementById('asciiConvert');
    if (asciiConvertBtn) {
        asciiConvertBtn.addEventListener('click', convertAsciiUnicode);
    }
});

// Theme toggle functionality
document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Color picker functionality
document.getElementById('themeColor').addEventListener('input', (e) => {
    const color = e.target.value;
    updateThemeColor(color);
    localStorage.setItem('themeColor', color);
});

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function updateThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--text-color', color);
    document.documentElement.style.setProperty('--border-color', color);
    document.documentElement.style.setProperty('--shadow-color', `${color}80`);
}

// Mode selector functionality
function initializeModeSelector() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const sections = document.querySelectorAll('.conversion-section');

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            
            // Update active button
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${mode}Section`) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Step-by-step functionality
function initializeStepByStep() {
    const showStepsCheckbox = document.getElementById('showSteps');
    const stepsSection = document.getElementById('conversionSteps');

    showStepsCheckbox.addEventListener('change', () => {
        stepsSection.style.display = showStepsCheckbox.checked ? 'block' : 'none';
    });
}

// Basic conversion functions
function getBaseNumber(base) {
    switch(base) {
        case 'binary': return 2;
        case 'decimal': return 10;
        case 'octal': return 8;
        case 'hex': return 16;
        default: return 10;
    }
}

function toDecimal(number, fromBase) {
    try {
        if (!number) {
            throw new Error('Empty input');
        }

        const isNegative = number.startsWith('-');
        const absNumber = isNegative ? number.slice(1) : number;
        
        const decimal = parseInt(absNumber, fromBase);
        if (isNaN(decimal)) {
            throw new Error('Invalid number format');
        }
        
        return isNegative ? -decimal : decimal;
    } catch (error) {
        console.error('Conversion error:', error);
        throw new Error(`Conversion error: ${error.message}`);
    }
}

function fromDecimal(decimal, toBase) {
    const isNegative = decimal < 0;
    const absDecimal = Math.abs(decimal);
    const result = absDecimal.toString(toBase).toUpperCase();
    return isNegative ? '-' + result : result;
}

function updatePlaceholder() {
    const conversionType = document.getElementById('conversionType').value;
    const inputNumber = document.getElementById('inputNumber');
    
    switch(conversionType) {
        case 'binary':
            inputNumber.placeholder = 'Enter binary number (e.g., 1010)';
            break;
        case 'decimal':
            inputNumber.placeholder = 'Enter decimal number (e.g., 42)';
            break;
        case 'octal':
            inputNumber.placeholder = 'Enter octal number (e.g., 52)';
            break;
        case 'hex':
            inputNumber.placeholder = 'Enter hexadecimal number (e.g., 2A)';
            break;
    }
}

function convertAll() {
    const input = document.getElementById('inputNumber').value.trim();
    const fromBase = document.getElementById('conversionType').value;
    const wordSize = parseInt(document.getElementById('wordSize').value);
    
    try {
        // Convert input to decimal first
        const decimal = toDecimal(input, getBaseNumber(fromBase));
        
        // Convert to different bases
        const binary = fromDecimal(decimal, 2).padStart(wordSize, '0');
        const decimalResult = fromDecimal(decimal, 10);
        const octal = fromDecimal(decimal, 8);
        const hex = fromDecimal(decimal, 16);
        
        // Calculate complements
        const onesComplement = calculateOnesComplement(binary);
        const twosComplement = calculateTwosComplement(binary);
        
        // Update results
        document.getElementById('binaryResult').textContent = binary;
        document.getElementById('decimalResult').textContent = decimalResult;
        document.getElementById('octalResult').textContent = octal;
        document.getElementById('hexResult').textContent = hex;
        document.getElementById('onesComplement').textContent = onesComplement;
        document.getElementById('twosComplement').textContent = twosComplement;
        
        // Add to history
        addToHistory('Basic', input, {
            binary,
            decimal: decimalResult,
            octal,
            hex,
            onesComplement,
            twosComplement
        });
        
        // Show steps if enabled
        if (document.getElementById('showSteps').checked) {
            showConversionSteps(decimal, fromBase);
        }
    } catch (error) {
        alert('Invalid input number for ' + fromBase + ' base');
    }
}

function calculateOnesComplement(binary) {
    return binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
}

function calculateTwosComplement(binary) {
    const ones = calculateOnesComplement(binary);
    const decimal = parseInt(ones, 2) + 1;
    return decimal.toString(2).padStart(binary.length, '0');
}

function showConversionSteps(decimal, fromBase) {
    const stepsContent = document.getElementById('stepsContent');
    const steps = [
        {
            number: 1,
            explanation: `Convert from ${fromBase} to decimal: ${decimal}`
        },
        {
            number: 2,
            explanation: `Convert decimal to binary: ${decimal.toString(2)}`
        },
        {
            number: 3,
            explanation: `Convert decimal to octal: ${decimal.toString(8)}`
        },
        {
            number: 4,
            explanation: `Convert decimal to hexadecimal: ${decimal.toString(16).toUpperCase()}`
        }
    ];
    
    stepsContent.innerHTML = steps.map(step => `
        <div class="step">
            <span class="step-number">Step ${step.number}:</span>
            <div class="explanation">${step.explanation}</div>
        </div>
    `).join('');
}

// Event listeners for basic converter
document.getElementById('conversionType').addEventListener('change', updatePlaceholder);
document.getElementById('inputNumber').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        convertAll();
    }
});

// Event listeners for bit calculator
function initializeBitCalculator() {
    const bitOperation = document.getElementById('bitOperation');
    const secondNumberGroup = document.getElementById('secondNumberGroup');
    const bitCalculatorBtn = document.getElementById('bitCalculator');
    
    if (bitOperation && secondNumberGroup && bitCalculatorBtn) {
        // Initial state
        updateSecondNumberVisibility(bitOperation.value);
        
        // Event listeners
        bitOperation.addEventListener('change', () => {
            updateSecondNumberVisibility(bitOperation.value);
        });

        bitCalculatorBtn.addEventListener('click', performBitOperation);
        
        // Add keyboard support
        document.getElementById('bitOp1').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performBitOperation();
            }
        });

        document.getElementById('bitOp2').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performBitOperation();
            }
        });
    }
}

function updateSecondNumberVisibility(operation) {
    const secondNumberGroup = document.getElementById('secondNumberGroup');
    secondNumberGroup.style.display = (operation === 'NOT') ? 'none' : 'block';
}

function validateBinaryInput(input) {
    if (!input) {
        throw new Error('Empty input');
    }
    return input;
}

function performBitOperation() {
    try {
        const num1 = validateBinaryInput(document.getElementById('bitOp1').value.trim());
        const operation = document.getElementById('bitOperation').value;
        const wordSize = parseInt(document.getElementById('bitWordSize').value);
        let num2 = '';
        let result;
        let steps = [];

        // Convert first number to decimal
        const decimal1 = parseInt(num1, 2);
        steps.push(`First number (binary): ${num1}`);
        steps.push(`First number (decimal): ${decimal1}`);

        // Handle second number if needed
        if (operation !== 'NOT') {
            num2 = validateBinaryInput(document.getElementById('bitOp2').value.trim());
            const decimal2 = parseInt(num2, 2);
            steps.push(`Second number (binary): ${num2}`);
            steps.push(`Second number (decimal): ${decimal2}`);
        }

        // Perform operation
        switch(operation) {
            case 'AND':
                result = decimal1 & parseInt(num2, 2);
                steps.push(`AND operation: ${decimal1} & ${parseInt(num2, 2)} = ${result}`);
                break;
            case 'OR':
                result = decimal1 | parseInt(num2, 2);
                steps.push(`OR operation: ${decimal1} | ${parseInt(num2, 2)} = ${result}`);
                break;
            case 'XOR':
                result = decimal1 ^ parseInt(num2, 2);
                steps.push(`XOR operation: ${decimal1} ^ ${parseInt(num2, 2)} = ${result}`);
                break;
            case 'NOT':
                result = ~decimal1;
                steps.push(`NOT operation: ~${decimal1} = ${result}`);
                break;
            case 'SHIFT_LEFT':
                result = decimal1 << parseInt(num2, 2);
                steps.push(`Shift Left operation: ${decimal1} << ${parseInt(num2, 2)} = ${result}`);
                break;
            case 'SHIFT_RIGHT':
                result = decimal1 >> parseInt(num2, 2);
                steps.push(`Shift Right operation: ${decimal1} >> ${parseInt(num2, 2)} = ${result}`);
                break;
        }

        // Convert result to different formats
        const binaryResult = (result >>> 0).toString(2).padStart(wordSize, '0');
        const hexResult = (result >>> 0).toString(16).toUpperCase().padStart(wordSize / 4, '0');

        // Update results
        document.getElementById('bitResult').textContent = binaryResult;
        document.getElementById('bitDecimalResult').textContent = result;
        document.getElementById('bitHexResult').textContent = `0x${hexResult}`;

        // Update steps
        document.getElementById('bitSteps').innerHTML = steps.map(step => `
            <div class="step">
                <div class="explanation">${step}</div>
            </div>
        `).join('');

        // Add to history
        addToHistory('Bit Operation', `${num1} ${operation} ${operation === 'NOT' ? '' : num2}`, {
            binary: binaryResult,
            decimal: result,
            hex: `0x${hexResult}`
        });

    } catch (error) {
        alert(error.message);
    }
}

// Complex number operations
function convertComplex() {
    const real = parseFloat(document.getElementById('realPart').value);
    const imaginary = parseFloat(document.getElementById('imaginaryPart').value);

    if (isNaN(real) || isNaN(imaginary)) {
        alert('Please enter valid numbers');
        return;
    }

    // Rectangular form
    const rectangular = `${real} ${imaginary >= 0 ? '+' : ''} ${imaginary}i`;
    document.getElementById('rectangularForm').textContent = rectangular;

    // Polar form
    const magnitude = Math.sqrt(real * real + imaginary * imaginary);
    const angle = Math.atan2(imaginary, real) * (180 / Math.PI);
    const polar = `${magnitude.toFixed(2)} ∠ ${angle.toFixed(2)}°`;
    document.getElementById('polarForm').textContent = polar;
}

// Color conversion
function convertColor() {
    const colorInput = document.getElementById('colorInput').value;
    let color;

    try {
        color = new Color(colorInput);
    } catch (e) {
        alert('Please enter a valid color');
        return;
    }

    document.getElementById('hexColor').textContent = color.toHex();
    document.getElementById('rgbColor').textContent = color.toRGB();
    document.getElementById('hslColor').textContent = color.toHSL();
    document.getElementById('colorPreview').style.backgroundColor = color.toHex();
}

// Color class for color conversions
class Color {
    constructor(color) {
        if (color.startsWith('#')) {
            this.hex = color;
            this.rgb = this.hexToRgb(color);
        } else if (color.startsWith('rgb')) {
            this.rgb = color;
            this.hex = this.rgbToHex(color);
        } else {
            const temp = document.createElement('div');
            temp.style.color = color;
            document.body.appendChild(temp);
            this.hex = window.getComputedStyle(temp).color;
            document.body.removeChild(temp);
            this.rgb = this.hexToRgb(this.hex);
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
    }

    rgbToHex(rgb) {
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
        return result ? '#' + ((1 << 24) + (parseInt(result[1]) << 16) + (parseInt(result[2]) << 8) + parseInt(result[3])).toString(16).slice(1) : null;
    }

    toHex() {
        return this.hex;
    }

    toRGB() {
        return this.rgb;
    }

    toHSL() {
        const rgb = this.hexToRgb(this.hex);
        const [r, g, b] = rgb.match(/\d+/g).map(Number);
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
}

// Add event listener for the convert button
document.getElementById('convertButton').addEventListener('click', convertAll);

// History Management
function addToHistory(type, input, results) {
    try {
        if (!type || !input || !results) {
            console.warn('Invalid history entry:', { type, input, results });
            return;
        }

        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        const entry = {
            type,
            input,
            results,
            timestamp: new Date().toISOString()
        };
        
        history.unshift(entry);
        if (history.length > 10) {
            history.pop();
        }
        
        localStorage.setItem('conversionHistory', JSON.stringify(history));
        updateHistoryDisplay();
    } catch (error) {
        console.error('Error adding to history:', error);
    }
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('conversionHistory');
    if (!historyList) return;

    try {
        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        
        historyList.innerHTML = history.map(entry => {
            if (!entry || !entry.results) return '';
            
            const resultsHtml = Object.entries(entry.results || {})
                .map(([key, value]) => 
                    `<div class="history-result">${key}: ${value || '-'}</div>`
                )
                .join('');

            return `
                <div class="history-item">
                    <div class="history-header">
                        <span class="history-type">${entry.type || 'Unknown'}</span>
                        <span class="history-time">${new Date(entry.timestamp || Date.now()).toLocaleString()}</span>
                    </div>
                    <div class="history-input">Input: ${entry.input || '-'}</div>
                    <div class="history-results">
                        ${resultsHtml}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error updating history display:', error);
        historyList.innerHTML = '<div class="history-item">Error loading history</div>';
    }
}

function clearHistory() {
    localStorage.removeItem('conversionHistory');
    updateHistoryDisplay();
}

// Offline status management
function updateOfflineStatus() {
    const offlineIndicator = document.querySelector('.offline-indicator');
    if (offlineIndicator) {
        offlineIndicator.style.display = !navigator.onLine ? 'block' : 'none';
    }
}

window.addEventListener('online', updateOfflineStatus);
window.addEventListener('offline', updateOfflineStatus);

// IEEE 754 Conversion Functions
function convertIEEE() {
    try {
        const decimal = parseFloat(document.getElementById('ieeeInput').value);
        const precision = document.getElementById('ieeePrecision').value;
        
        if (isNaN(decimal)) {
            throw new Error('Invalid input number');
        }

        const result = decimalToIEEE754(decimal, precision);
        
        // Update results
        document.getElementById('ieeeSign').textContent = result.sign;
        document.getElementById('ieeeExponent').textContent = result.exponent;
        document.getElementById('ieeeMantissa').textContent = result.mantissa;
        document.getElementById('ieeeBinary').textContent = result.binary;
        document.getElementById('ieeeHex').textContent = result.hex;
        document.getElementById('ieeeDecimal').textContent = result.decimal;
        
        // Add to history
        addToHistory('IEEE 754', decimal.toString(), {
            binary: result.binary,
            hex: result.hex,
            sign: result.sign,
            exponent: result.exponent,
            mantissa: result.mantissa,
            decimal: result.decimal
        });

    } catch (error) {
        alert(error.message);
    }
}

function decimalToIEEE754(decimal, precision = 'single') {
    // Get the sign bit
    const sign = decimal < 0 ? 1 : 0;
    const absDecimal = Math.abs(decimal);

    // Handle special cases
    if (absDecimal === 0) {
        return {
            sign: sign.toString(),
            exponent: '00000000',
            mantissa: '00000000000000000000000',
            binary: (sign ? '1' : '0') + '0000000000000000000000000000000',
            hex: '0x00000000',
            decimal: decimal.toString()
        };
    }

    if (isNaN(absDecimal)) {
        return {
            sign: '0',
            exponent: '11111111',
            mantissa: '10000000000000000000000',
            binary: '01111111110000000000000000000000',
            hex: '0x7FC00000',
            decimal: 'NaN'
        };
    }

    if (absDecimal === Infinity) {
        return {
            sign: sign.toString(),
            exponent: '11111111',
            mantissa: '00000000000000000000000',
            binary: (sign ? '1' : '0') + '1111111100000000000000000000000',
            hex: sign ? '0xFF800000' : '0x7F800000',
            decimal: sign ? '-Infinity' : 'Infinity'
        };
    }

    // Convert to binary
    let binary = '';
    let exponent = 0;
    let mantissa = '';

    // Handle integer part
    let intPart = Math.floor(absDecimal);
    while (intPart > 0) {
        binary = (intPart % 2) + binary;
        intPart = Math.floor(intPart / 2);
    }

    // Handle fractional part
    let fracPart = absDecimal - Math.floor(absDecimal);
    while (fracPart > 0 && binary.length < 24) {
        fracPart *= 2;
        if (fracPart >= 1) {
            binary += '1';
            fracPart -= 1;
        } else {
            binary += '0';
        }
    }

    // Normalize
    if (binary.length > 0) {
        const firstOne = binary.indexOf('1');
        if (firstOne !== -1) {
            exponent = binary.length - firstOne - 1;
            mantissa = binary.slice(firstOne + 1);
        }
    }

    // Add bias
    const bias = precision === 'single' ? 127 : 1023;
    const biasedExponent = (exponent + bias).toString(2).padStart(precision === 'single' ? 8 : 11, '0');

    // Pad mantissa
    mantissa = mantissa.padEnd(precision === 'single' ? 23 : 52, '0').slice(0, precision === 'single' ? 23 : 52);

    // Create full binary representation
    const fullBinary = sign + biasedExponent + mantissa;

    // Convert to hex
    const hex = '0x' + parseInt(fullBinary, 2).toString(16).padStart(precision === 'single' ? 8 : 16, '0').toUpperCase();

    return {
        sign: sign.toString(),
        exponent: biasedExponent,
        mantissa: mantissa,
        binary: fullBinary,
        hex: hex,
        decimal: decimal.toString()
    };
}

// ASCII/Unicode Conversion Functions
function convertAsciiUnicode() {
    try {
        const input = document.getElementById('asciiInput').value;
        const type = document.getElementById('asciiType').value;
        
        if (!input) {
            throw new Error('Please enter text or code');
        }

        let result;
        switch(type) {
            case 'text':
                result = textToCodes(input);
                break;
            case 'ascii':
                result = asciiToText(input);
                break;
            case 'unicode':
                result = unicodeToText(input);
                break;
        }

        // Update results
        document.getElementById('asciiResult').textContent = result.ascii;
        document.getElementById('unicodeResult').textContent = result.unicode;
        document.getElementById('asciiBinary').textContent = result.binary;
        document.getElementById('asciiHex').textContent = result.hex;

        // Add to history
        addToHistory('ASCII/Unicode', input, {
            ascii: result.ascii,
            unicode: result.unicode,
            binary: result.binary,
            hex: result.hex
        });

    } catch (error) {
        alert(error.message);
    }
}

function textToCodes(text) {
    const ascii = [];
    const unicode = [];
    const binary = [];
    const hex = [];

    for (let char of text) {
        const code = char.charCodeAt(0);
        ascii.push(code);
        unicode.push(`U+${code.toString(16).padStart(4, '0').toUpperCase()}`);
        binary.push(code.toString(2).padStart(8, '0'));
        hex.push(code.toString(16).padStart(2, '0').toUpperCase());
    }

    return {
        ascii: ascii.join(' '),
        unicode: unicode.join(' '),
        binary: binary.join(' '),
        hex: hex.join(' ')
    };
}

function asciiToText(asciiCodes) {
    const codes = asciiCodes.split(' ').map(code => parseInt(code));
    const text = codes.map(code => String.fromCharCode(code)).join('');
    return textToCodes(text);
}

function unicodeToText(unicodeCodes) {
    const codes = unicodeCodes.split(' ').map(code => parseInt(code.replace('U+', ''), 16));
    const text = codes.map(code => String.fromCharCode(code)).join('');
    return textToCodes(text);
}