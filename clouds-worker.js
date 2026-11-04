// v96: real clouds. Makes the cloud map in the background, so the app never waits for it.
// NASA's satellite picture (GIBS, MODIS Terra). Only the clouds are kept: bright and colourless. The satellite's gaps are
// filled from each side, and the poles (ice looks like cloud, no sun in winter) keep the normal map.
const W = 2048, H = 1024;
const ss = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
const pixels = async (blob) => {
  const im = await createImageBitmap(blob), k = new OffscreenCanvas(W, H), x = k.getContext('2d', { willReadFrequently: true });
  x.drawImage(im, 0, 0, W, H); im.close();
  return x.getImageData(0, 0, W, H).data;
};
self.onmessage = async (e) => {
  try {
    const o = await pixels(await (await fetch(e.data.plain)).blob());
    for (const day of e.data.days) {
      const r = await fetch('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&CRS=EPSG:4326&BBOX=-90,-180,90,180&WIDTH=' + W + '&HEIGHT=' + H + '&FORMAT=image/jpeg&TIME=' + day + '&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor');
      if (!r.ok) continue;
      const a = await pixels(await r.blob()), c = new Float32Array(W * H), bad = new Uint8Array(W * H);
      let gaps = 0, seen = 0;
      for (let j = 0; j < H; j++) {
        const lat = 90 - (j + 0.5) / H * 180;
        for (let i = 0; i < W; i++) {
          const p = (j * W + i) * 4, R = a[p], G = a[p + 1], B = a[p + 2], mx = Math.max(R, G, B), mn = Math.min(R, G, B);
          if (Math.abs(lat) < 50) seen++;
          if (mx < 22) { bad[j * W + i] = 1; if (Math.abs(lat) < 50) gaps++; continue; }
          c[j * W + i] = Math.pow(ss(0.42, 0.98, mn / 255), 1.15) * (1 - ss(0.08, 0.28, (mx - mn) / (mx + 1)));
        }
      }
      // not all of that day's pictures are in yet: try the day before
      if (gaps / seen > 0.25) continue;
      const k = new OffscreenCanvas(W, H), x = k.getContext('2d'), out = x.createImageData(W, H);
      for (let j = 0; j < H; j++) {
        const lat = 90 - (j + 0.5) / H * 180, pole = Math.max(ss(58, 70, lat), ss(55, 66, -lat));
        for (let i = 0; i < W; i++) {
          const n = j * W + i, p = n * 4;
          let v = c[n];
          if (bad[n]) {
            let l = i, g = i, m = 0;
            while (bad[j * W + ((l + W) % W)] && m++ < W) l--;
            m = 0;
            while (bad[j * W + (g % W)] && m++ < W) g++;
            const f = (i - l) / Math.max(1, g - l);
            v = (c[j * W + ((l + W) % W)] * (1 - f) + c[j * W + (g % W)] * f) * 0.6 + (o[p] / 255) * 0.4;
          }
          v = 255 * (v * (1 - pole) + (o[p] / 255) * pole);
          out.data[p] = out.data[p + 1] = out.data[p + 2] = v; out.data[p + 3] = 255;
        }
      }
      x.putImageData(out, 0, 0);
      self.postMessage({ day: day, blob: await k.convertToBlob({ type: 'image/jpeg', quality: 0.86 }) });
      return;
    }
    self.postMessage({});
  } catch (er) { self.postMessage({}); }
};
