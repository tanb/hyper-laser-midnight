module.exports.mapHyperState = ({ui: {hyperLaserMidnight}}, map) => Object.assign({}, map, {
  hyperLaserMidnight: Object.assign({}, hyperLaserMidnight)
});

module.exports.reduceUI = (state, {type, config}) => {
  switch (type) {
    case 'CONFIG_LOAD':
    case 'CONFIG_RELOAD':
      return state.set('hyperLaserMidnight', Object.assign({
        animate: true,
        gradientColors: ['rgba(252, 29, 267, 1)', 'rgba(251, 165, 6, 1)'],
      }, config.hyperLaserMidnight));
    default:
      return state;
  }
};

module.exports.decorateHyper = (Hyper, {React}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.animate = this.props.hyperLaserMidnight.animate;
      this.speed = 0.05; // degree / millisec
      this.gradientInitialDegrees = 90;
      this.gradientDegrees = 0;
      this.gradientColors = this.props.hyperLaserMidnight.gradientColors;
      this.borderWidth = 3;
      this.onDecorated = this.onDecorated.bind(this);
      this.drawFrame = this.drawFrame.bind(this);
      this.resizeCanvas = this.resizeCanvas.bind(this);
      this.canvas = null;
      this.startTime = null;
    }
    resizeCanvas () {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      if (!this.animate) {
        this.drawFrame();
      }
    }
    drawFrame () {
      const previousDegree = this.gradientDegrees;
      if (this.animate) {
        // Set dynamic gradientDegrees
        const currentTime = new Date().getTime();
        const progress = currentTime - this.startTime;
        this.gradientDegrees = (this.speed * progress + this.gradientInitialDegrees) % 360;
        if (Math.floor(previousDegree) === Math.floor(this.gradientDegrees)) {
          window.requestAnimationFrame(this.drawFrame);
          return;
        }
      } else {
        this.gradientDegrees = this.gradientInitialDegrees;
      }
      const ctx = this.canvas.getContext('2d');
      var clientWidth = ctx.canvas.clientWidth;
      var clientHeight = ctx.canvas.clientHeight;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const a = { x: null, y: null };
      const b = { x: null, y: null };
      if ((0 <= this.gradientDegrees && this.gradientDegrees < 45) ||
          (315 <= this.gradientDegrees && this.gradientDegrees < 360)) {
        a.x = clientWidth;
        a.y = clientHeight / 2 - clientWidth * Math.tan(this.gradientDegrees * Math.PI / 180) / 2;
        b.x = 0;
        b.y = clientHeight / 2 + clientWidth * Math.tan(this.gradientDegrees * Math.PI / 180) / 2;
      } else if (45 <= this.gradientDegrees && this.gradientDegrees < 135) {
        a.x = clientWidth / 2 + (clientHeight / 2) / Math.tan(this.gradientDegrees * Math.PI / 180);
        a.y = 0;
        b.x = clientWidth / 2 - (clientHeight / 2) / Math.tan(this.gradientDegrees * Math.PI / 180);
        b.y = clientHeight;
      } else if (135 <= this.gradientDegrees && this.gradientDegrees < 225) {
        a.x = 0;
        a.y = clientHeight / 2 + clientWidth * Math.tan(this.gradientDegrees * Math.PI / 180) / 2;
        b.x = clientWidth;
        b.y = clientHeight / 2 - clientWidth * Math.tan(this.gradientDegrees * Math.PI / 180) / 2;
      } else {
        a.x = clientWidth / 2 - (clientHeight / 2) / Math.tan(this.gradientDegrees * Math.PI / 180);
        a.y = clientHeight;
        b.x = clientWidth / 2 + (clientHeight / 2) / Math.tan(this.gradientDegrees * Math.PI / 180);
        b.y = 0;
      }
      var grad  = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, this.gradientColors[0]);
      grad.addColorStop(1, this.gradientColors[1]);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(clientWidth, 0);
      ctx.lineTo(clientWidth, clientHeight);
      ctx.lineTo(0, clientHeight);
      ctx.closePath();
      const borderWidth = this.borderWidth + 1;
      ctx.moveTo(0 + borderWidth, 0 + borderWidth);
      ctx.lineTo(0 + borderWidth, clientHeight - borderWidth);
      ctx.lineTo(clientWidth - borderWidth, clientHeight - borderWidth);
      ctx.lineTo(clientWidth - borderWidth, 0 + borderWidth);
      ctx.closePath();
      ctx.fill();
      // Note: Animation loop has significant cpu usage.
      if (this.animate) {
        window.setTimeout((function() {
          window.requestAnimationFrame(this.drawFrame);
        }).bind(this), 200);
      }
    }
    onDecorated (hyper) {
      if (this.props.onDecorated) this.props.onDecorated(hyper);
      this.initCanvas();
    }
    initCanvas () {
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.pointerEvents = 'none';
      this.canvasContext = this.canvas.getContext('2d');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      const laserElement = document.getElementById('hyper-laser-midnight');
      laserElement.insertBefore(this.canvas, laserElement.firstChild);
      this.startTime = new Date().getTime();
      window.requestAnimationFrame(this.drawFrame);
      window.addEventListener('resize', this.resizeCanvas);
    }
    render() {
      return React.createElement('div', {
        id: 'hyper-laser-midnight'
      }, [
        React.createElement(Hyper, Object.assign({}, this.props, {
          onDecorated: this.onDecorated,
        })),
        React.createElement('style', {}, `
        #hyper-laser-midnight {
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          position: fixed;
          border-radius: '0';
        }
        #hyper-laser-midnight .hyper_main {
          top: ${this.borderWidth}px;
          bottom: ${this.borderWidth}px;
          left: ${this.borderWidth}px;
          right: ${this.borderWidth}px;
          border-radius: ${this.borderWidth}px;
        }
        #hyper-laser-midnight .hyper_main .header_header {
          top: ${this.borderWidth}px;
          left: ${this.borderWidth}px;
          right: ${this.borderWidth}px;
        }
        #hyper-laser-midnight .hyper_main .header_windowHeader {
          top: ${this.borderWidth}px;
          left: ${this.borderWidth}px;
          right: ${this.borderWidth}px;
          width: calc(100% - ${this.borderWidth * 2}px);
        }
        #hyper-laser-midnight .hyper_main .header_hamburgerMenuLeft {
          top: ${this.borderWidth}px;
          left: ${this.borderWidth}px;
        }
        `)
      ]);
    }
  };
};

module.exports.decorateConfig = config => {
  const defaultCustom = {};
  defaultCustom.fontFamily = '"SauceCodePro Nerd Font Mono"';
  defaultCustom.cursorColor = 'rgba(248, 180, 0, 0.8)';
  defaultCustom.cursorAccentColor = '#000';
  defaultCustom.cursorBlink = true;
  defaultCustom.foregroundColor = '#fff';
  defaultCustom.backgroundColor = 'rgba(26, 14, 48, 0.7)';
  defaultCustom.selectionColor = 'rgba(255, 255, 255, 0.3)';
  defaultCustom.borderColor = '#333';
  defaultCustom.gradientColors = ['rgba(252, 29, 267, 1)', 'rgba(251, 165, 6, 1)'];
  defaultCustom.colors = {
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

  return Object.assign({}, config, defaultCustom, config.hyperLaserMidnight || {});
}
