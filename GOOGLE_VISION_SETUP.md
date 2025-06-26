# Google Vision API Setup Guide

## Current Status
✅ **Google Cloud Project Created**: `mixmaster-464115`  
✅ **Application Default Credentials Configured**  
✅ **Vision API Enabled**  
✅ **Code Updated**: Text recognition service ready  

## Next Steps to Enable Real OCR

### Option 1: Create API Key (Recommended for Mobile Apps)

1. **Go to Google Cloud Console Credentials**:
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Create API Key**:
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key
   - **Optional but recommended**: Click "Restrict Key" and limit to "Cloud Vision API"

3. **Configure in Your App**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and replace with your actual API key
   EXPO_PUBLIC_GOOGLE_VISION_API_KEY=your_actual_api_key_here
   ```

4. **Test the Integration**:
   - Update `CameraView.tsx` to use real API: change `useMock: true` to `useMock: false`
   - Take a photo in the app to test real OCR

### Option 2: Use Application Default Credentials (Backend Required)

For production apps, you'd typically:
1. Create a backend service that uses your ADC setup
2. Have your mobile app call your backend
3. Backend calls Google Vision API and returns results

## Current App Behavior

- **With API Key**: Uses real Google Vision API for text recognition
- **Without API Key**: Uses mock data that simulates gas pump readings
- **On API Error**: Automatically falls back to mock data

## Pricing

- **Free Tier**: 1,000 text detection requests per month
- **After Free Tier**: $1.50 per 1,000 requests
- Perfect for development and moderate usage

## Security Notes

- ✅ `.env` file is in `.gitignore` (won't be committed)
- ✅ API key is loaded from environment variables
- ✅ Fallback to mock data if API fails

## Testing

1. **Mock Mode** (current): App works with simulated data
2. **Real API Mode**: Configure API key and change `useMock: false` in CameraView
3. **Fallback**: If API fails, automatically uses mock data

Your app is ready to use! Configure the API key when you want to enable real OCR functionality.
