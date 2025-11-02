module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@/api': './src/api',
            '@/components': './src/components',
            '@/hooks': './src/hooks',
            '@/store': './src/store',
            '@/types': './src/types',
            '@/theme': './src/theme',
            '@/utils': './src/utils',
            '@/lib': './src/lib',
            '@/config': './src/config',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      'react-native-paper/babel',
    ],
  };
};
