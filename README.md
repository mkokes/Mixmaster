# MixMaster - 2-Stroke Oil Mixing Calculator

A React Native Expo application that uses camera-based OCR to detect gas pump readings and calculate the correct amount of 2-stroke oil needed for various mixing ratios.

## Features

### 🎯 Core Functionality
- **Real-time Camera Integration**: Full-screen camera view with overlay indicators
- **OCR Text Recognition**: Automatically detects and extracts numerical values from gas pump displays
- **Smart Unit Detection**: Identifies metric (liters) vs imperial (gallons) units
- **Precise Calculations**: Converts gas amounts to required oil amounts with proper unit conversions

### 🔧 Mixing Ratios Supported
- 50:1 (gas:oil)
- 40:1
- 32:1
- 25:1
- 20:1
- 16:1

### 💡 User Experience
- **Simple Workflow**: Point camera → Detect reading → Select ratio → View oil amount
- **Visual Feedback**: Clear indicators when text is successfully detected
- **Manual Input Fallback**: Option to manually enter gas amount if automatic detection fails
- **Clear Results Display**: Large, readable text for calculated oil measurements
- **Step-by-step Instructions**: Detailed mixing instructions with visual guides

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (for testing)
- Physical device with Expo Go app (recommended)

### Setup
1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd mixmaster
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start
   ```

### Running on Device
1. Install Expo Go from the App Store (iOS) or Google Play Store (Android)
2. Scan the QR code displayed in the terminal with your device camera (iOS) or Expo Go app (Android)

## Usage

### Basic Operation
1. **Launch the app** and grant camera permissions when prompted
2. **Point your camera** at the gas pump display showing the fuel amount
3. **Tap the camera button** to capture and analyze the reading
4. **Select your desired mixing ratio** from the dropdown
5. **View the calculated oil amount** with step-by-step mixing instructions

### Manual Input
If automatic detection fails:
1. Tap the "Edit Amount" button or manual input option
2. Enter the gas amount manually
3. Select the appropriate unit (gallons or liters)
4. Tap "Calculate" to get your oil measurement

### Unit Conversions
- **Imperial**: Gallons of gas → Fluid ounces of oil
- **Metric**: Liters of gas → Milliliters of oil

## Technical Details

### Architecture
- **React Native with Expo**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **Component-based Architecture**: Modular, reusable components

### Key Dependencies
- `expo-camera`: Camera functionality and permissions
- `expo-image-manipulator`: Image processing for OCR
- Google Vision API: Cloud-based OCR text detection
- `@react-native-picker/picker`: Ratio selection interface
- `@expo/vector-icons`: UI icons

### Components
- **MixMasterApp**: Main application container
- **CameraView**: Camera interface with OCR processing
- **RatioSelector**: Mixing ratio selection component
- **ResultsDisplay**: Calculation results and instructions
- **ManualInput**: Fallback manual input modal

### Utilities
- **calculations.ts**: Core calculation logic and text parsing
- **types.ts**: TypeScript interfaces and type definitions

## Permissions

The app requires the following permissions:
- **Camera**: To capture gas pump display images
- **Photo Library** (iOS): For image processing
- **Storage** (Android): For temporary image storage during processing

## Troubleshooting

### Common Issues
1. **Camera not working**: Ensure camera permissions are granted in device settings
2. **Text not detected**: Ensure good lighting and clear view of the gas pump display
3. **Incorrect readings**: Use manual input as a fallback option

### Tips for Best Results
- Ensure good lighting conditions
- Hold the device steady when capturing
- Position the gas pump display clearly within the detection area
- Clean the camera lens if readings are unclear

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── CameraView.tsx
│   ├── RatioSelector.tsx
│   ├── ResultsDisplay.tsx
│   └── ManualInput.tsx
├── utils/              # Utility functions
│   └── calculations.ts
├── types.ts           # TypeScript definitions
└── MixMasterApp.tsx   # Main app component
```

### Building for Production
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues, questions, or feature requests, please create an issue in the repository.
