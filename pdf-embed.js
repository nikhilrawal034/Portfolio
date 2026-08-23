import * as pdfjsLib from 'pdfjs-dist';
import PDFWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker';

pdfjsLib.GlobalWorkerOptions.workerPort = new PDFWorker();

const CSS = `
  .custom-pdf-container {
    position: relative;
    width: 100%;
    background: #fdfdfd;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }
  .custom-pdf-canvas {
    max-width: 100%;
    height: auto;
    display: block;
  }
  .custom-pdf-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    z-index: 10;
  }
  .custom-pdf-nav:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-50%) scale(1.05);
  }
  .custom-pdf-nav:active {
    transform: translateY(-50%) scale(0.95);
  }
  .custom-pdf-nav.disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  .custom-pdf-nav.prev {
    left: 20px;
  }
  .custom-pdf-nav.next {
    right: 20px;
  }
  .custom-pdf-nav svg {
    width: 24px;
    height: 24px;
    fill: #333;
  }
`;

function injectStyles() {
  if (document.getElementById('custom-pdf-styles')) return;
  const style = document.createElement('style');
  style.id = 'custom-pdf-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

async function renderPdfContainer(container, pdfUrl) {
  if (container.dataset.pdfInjected) return;
  container.dataset.pdfInjected = 'true';
  Array.from(container.children).forEach(child => { child.style.display = 'none'; });

  const wrapper = document.createElement('div');
  wrapper.className = 'custom-pdf-container';

  const canvas = document.createElement('canvas');
  canvas.className = 'custom-pdf-canvas';
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'custom-pdf-nav prev';
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'custom-pdf-nav next';
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

  wrapper.appendChild(canvas);
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);
  container.appendChild(wrapper);

  let pdfDoc = null;
  let pageNum = 1;
  let pageIsRendering = false;
  let pageNumPending = null;
  const ctx = canvas.getContext('2d');

  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    pdfDoc = await loadingTask.promise;
    renderPage(pageNum);
  } catch (error) {
    console.error('Error loading PDF:', error);
  }

  function updateButtons() {
    if (pageNum <= 1) prevBtn.classList.add('disabled');
    else prevBtn.classList.remove('disabled');

    if (pdfDoc && pageNum >= pdfDoc.numPages) nextBtn.classList.add('disabled');
    else nextBtn.classList.remove('disabled');
  }

  async function renderPage(num) {
    pageIsRendering = true;
    try {
      const page = await pdfDoc.getPage(num);
      
      const containerWidth = wrapper.clientWidth || 800;
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const scale = containerWidth / unscaledViewport.width;
      
      const viewport = page.getViewport({ scale: scale });

      const dpr = window.devicePixelRatio || 1;
      canvas.width = viewport.width * dpr;
      canvas.height = viewport.height * dpr;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      ctx.scale(dpr, dpr);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      await page.render(renderContext).promise;
      
      pageIsRendering = false;
      updateButtons();

      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    } catch (err) {
      console.error('Error rendering page:', err);
      pageIsRendering = false;
    }
  }

  function queueRenderPage(num) {
    if (pageIsRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  prevBtn.addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
  });

  nextBtn.addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
  });
  
  let resizeTimer;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
          if (pdfDoc) queueRenderPage(pageNum);
      }, 200);
  });
}

window.addEventListener('load', () => {
  injectStyles();
  function checkAndInject() {
    const containers = document.querySelectorAll('a.framer-1skhlgj + div');
    containers.forEach(c => {
      renderPdfContainer(c, '/documents/NLZeptoGOV.pdf');
    });
  }
  
  setTimeout(checkAndInject, 500);
  const observer = new MutationObserver(() => checkAndInject());
  observer.observe(document.body, { childList: true, subtree: true });
});
