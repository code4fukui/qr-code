import { QR } from "https://taisukef.github.io/qrcode-generator/es/QR.js";
import { fetchBin } from "https://js.sabae.cc/fetchBin.js";

class QRCode extends HTMLElement {
  constructor(param) {
    super();
    this.set(param);
  }
  async set(param) {
    const src = this.getAttribute("src");
    if (!param && src) {
      const val = await fetchBin(src);
      this.set(val);
      return;
    }
    const val = this.textContent.trim() || param || document.location.href;
    this.val = val;
    this.textContent = "";
    const errCorrectionLevel = 0; //  0: L, 1: M, 2: Q, 3: H
    // typeNumber 1 to 40
    const data = QR.encode(val, errCorrectionLevel);
    //console.log(data);
  
    const iw = data.length;
  
    const w = 4;
    const r = 4;
    const qw = (iw + w * 2) * r;
    
    const canvas = document.createElement("canvas");
    this.appendChild(canvas);
    canvas.width = canvas.height = qw;
    const g = canvas.getContext("2d");
  
    const idata = new Uint8ClampedArray(qw * qw * 4);
    for (let i = 0; i < idata.length / 4; i++) {
      idata[i * 4 + 0] = 255;
      idata[i * 4 + 1] = 255;
      idata[i * 4 + 2] = 255;
      idata[i * 4 + 3] = 255;
    }
    for (let i = 0; i < iw; i++) {
      for (let j = 0; j < iw; j++) {
        const c = data[i][j] ? 0 : 255;
        for (let k = 0; k < r * r; k++) {
          const x = (i + w) * r + Math.floor(k / r);
          const y = (j + w) * r + (k % r);
          idata[(x + y * qw) * 4] = c;
          idata[(x + y * qw) * 4 + 1] = c;
          idata[(x + y * qw) * 4 + 2] = c;
          idata[(x + y * qw) * 4 + 3] = 255;
        }
      }
    }
    const imgdata = new ImageData(idata, qw, qw);
    g.putImageData(imgdata, 0, 0);
    
    // check change
    const observer = new MutationObserver(() =>  {
      observer.disconnect();
      this.set();
    });
    observer.observe(this, { subtree: true, childList: true });
  }
  set value(param) {
    //console.log("param", param)
    this.set(param);
  }
  get value() {
    return this.val;
  }
}

customElements.define('qr-code', QRCode);

export { QRCode };
