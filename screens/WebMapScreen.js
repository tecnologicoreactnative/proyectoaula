// screens/WebMapScreen.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function WebMapScreen() {
 
  const apiKey = Constants.expoConfig.extra.GOOGLE_MAPS_JS_KEY;

  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
        <style>
          html, body, #map { margin: 0; padding: 0; height: 100%; width: 100% }
        </style>
        <script>
          function initMap() {
            const center = { lat: 6.2442, lng: -75.5812 };
            new google.maps.Map(document.getElementById('map'), {
              center,
              zoom: 12
            });
          }
          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  webview: {
    flex: 1
  }
});
