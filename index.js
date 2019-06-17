module.exports.onWindow = browserWindow => browserWindow.setVibrancy('dark');

module.exports.decorateConfig = config => {
  config.fontFamily = '"SauceCodePro Nerd Font Mono"';
  config.cursorColor = 'rgba(248, 180, 0, 0.8)';
  config.cursorAccentColor = '#000';
  config.cursorBlink = true;
  config.foregroundColor = '#fff';
  config.backgroundColor = 'rgba(26, 14, 48, 0.9)';
  config.selectionColor = 'rgba(255, 255, 255, 0.3)';
  config.borderColor = '#333';
  config.colors = {
    black: '#000000',
    red: '#c91b00',
    green: '#00c200',
    yellow: '#c7c400',
    blue: '#0171ff',
    magenta: '#c930c7',
    cyan: '#00c5c7',
    white: '#C7C7C7',
    lightBlack: '#676767',
    lightRed: '#ff6d67',
    lightGreen: '#5ff967',
    lightYellow: '#fefb67',
    lightBlue: '#6871ff',
    lightMagenta: '#ff76ff',
    lightCyan: '#5ffdff',
    lightWhite: '#feffff',
  };

  return config;
}
