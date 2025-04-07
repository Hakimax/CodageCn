# Number Converter

A modern web application for converting numbers between different number systems and formats.

## Features

- Binary to Decimal conversion
- Binary to Octal conversion
- Binary to Hexadecimal conversion
- 1's Complement calculation
- 2's Complement calculation
- IEEE 754 Floating Point conversion (32-bit and 64-bit)

## How to Use

1. Open `index.html` in a web browser
2. For binary conversions:
   - Enter a binary number (containing only 0s and 1s)
   - Click "Convert" to see all conversions
3. For IEEE 754 conversion:
   - Enter a decimal number
   - Click "Convert to IEEE 754" to see the floating-point representation

## Technical Details

The application uses:
- HTML5 for structure
- CSS3 for styling
- JavaScript for calculations
- Modern browser APIs for IEEE 754 conversions

## Browser Support

Works on all modern browsers that support:
- ES6+
- ArrayBuffer
- DataView
- TypedArrays

## Note

- For IEEE 754 conversions, the application uses the browser's native floating-point representation
- Results are displayed in binary format for IEEE 754 conversions 