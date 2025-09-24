# 📱 Mobile App Deployment Instructions

## Prerequisites
1. Create an Expo account at https://expo.dev
2. Install EAS CLI: `npm install -g eas-cli`
3. Login to Expo: `eas login`

## Setup Expo Project

### 1. Initialize EAS Configuration
```bash
cd chalked-mobile
eas build:configure
```

This will:
- Create/update your `app.json` with a proper project ID
- Set up EAS configuration
- Link your project to your Expo account

### 2. Update Backend URL
Before building, update the production API URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://YOUR_BACKEND_URL_HERE'; // Replace with actual Railway URL

const SOCKET_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://YOUR_BACKEND_URL_HERE'; // Replace with actual Railway URL
```

## Building the App

### Preview Builds (for testing)
```bash
# iOS TestFlight build
eas build --platform ios --profile preview

# Android APK for internal testing
eas build --platform android --profile preview
```

### Production Builds
```bash
# iOS App Store build
eas build --platform ios --profile production

# Android Google Play build
eas build --platform android --profile production

# Build both platforms
eas build --platform all --profile production
```

## App Store Configuration

### iOS App Store
1. Update `eas.json` with your Apple Developer info:
   - `appleId`: Your Apple ID email
   - `ascAppId`: App Store Connect App ID (get from App Store Connect)
   - `appleTeamId`: Your Apple Developer Team ID

2. Submit to App Store:
```bash
eas submit --platform ios
```

### Google Play Store
1. Create a Google Play Console project
2. Generate a service account key JSON file
3. Place the key file as `google-play-key.json` in the project root
4. Submit to Google Play:
```bash
eas submit --platform android
```

## Over-the-Air Updates

For quick updates without app store approval:
```bash
eas update --branch production --message "Updated professor selection logic"
```

## Current Configuration

Your app is already configured with:
- ✅ Bundle identifiers: `com.chalked.professorstocks`
- ✅ App name: "Chalked"
- ✅ Dark theme UI
- ✅ Production-ready EAS configuration
- ✅ Asset optimization

## Next Steps

1. **Deploy Backend First**: Complete Railway backend deployment
2. **Update API URLs**: Replace placeholder URLs with actual backend URL
3. **Login to Expo**: Run `eas login` in the chalked-mobile directory
4. **Configure Project**: Run `eas build:configure` to link to your account
5. **Build & Test**: Create preview builds for testing
6. **Production Deploy**: Build and submit to app stores

The mobile app is ready for deployment once you complete the Expo account setup!