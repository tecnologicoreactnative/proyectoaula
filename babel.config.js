module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      allowlist: [
        'API_KEY',
        'AUTH_DOMAIN',
        'PROJECT_ID',
        'STORAGE_BUCKET',
        'MESSAGING_SENDER_ID',
        'APP_ID'
      ],
    }]
  ]
};
