/* eslint-disable class-methods-use-this */
import {
  button, div, iframe, span,
} from '../../scripts/dom-helpers.js';
import { createOptimizedPicture, loadCSS, loadScript } from '../../scripts/lib-franklin.js';

export function iframeResizeHandler(formUrl, id, container) {
  container.querySelector('iframe').addEventListener('load', async () => {
    if (formUrl) {
      /* global iFrameResize */
      iFrameResize({ log: false }, `#${id}`);
    }
  });
}

export function stopProp(e) {
  e.stopPropagation();
}

const modalParentClass = 'modal-overlay';
export class Modal {
  constructor(formURL, iframeID, modalBody, customClass, isFormModal) {
    this.formURL = formURL;
    this.iframeID = iframeID;
    this.modalBody = modalBody;
    this.isFormModal = isFormModal;
    this.customClass = customClass;
    this.parentClass = modalParentClass;
    this.timer = '';
  }

  showModal() {
    const newsletterModalOverlay = document.querySelector('.modal-overlay');
    newsletterModalOverlay.removeAttribute('aria-hidden');
    document.body.classList.add('no-scroll');
  }

  hideModal() {
    clearTimeout(this.timer);
    const modal = document.querySelector('.modal-overlay');
    modal.setAttribute('aria-hidden', true);
    document.body.classList.remove('no-scroll');
  }

  triggerModalWithUrl(url) {
    const modal = document.querySelector('.modal-overlay');
    modal.querySelector('iframe').setAttribute('src', url);
    this.timer = setTimeout(() => {
      modal.setAttribute('aria-hidden', false);
      document.body.classList.add('no-scroll');
    }, 200);
  }

  triggerShowModalButton() {
    const scrollFromTop = window.scrollY;
    const midHeightOfViewport = Math.floor(document.body.getBoundingClientRect().height / 2.25);
    const modalBtn = document.getElementById('show-modal');
    if (scrollFromTop > midHeightOfViewport) {
      if (modalBtn) {
        modalBtn.click();
        modalBtn.remove();
      }
    }
  }

  async decorateModal() {
    loadScript('/scripts/iframeResizer.min.js');
    loadCSS('/blocks/modal/modal.css');
    const { body } = document;

    if (this.isFormModal) {
      const modalBtn = button({ id: 'show-modal', style: 'display: none;' }, 'Show Modal');
      modalBtn.addEventListener('click', this.showModal);
      body.append(modalBtn);
      window.addEventListener('scroll', this.triggerShowModalButton);
    }

    const formOverlay = div({ 'aria-hidden': true, class: this.parentClass, style: 'display:none;' });
    formOverlay.addEventListener('click', this.hideModal);
    const closeBtn = span(
      { class: 'icon icon-close' },
      createOptimizedPicture('/icons/close-video.svg', 'Close Video'),
    );
    closeBtn.addEventListener('click', this.hideModal);
    const innerWrapper = div({ class: ['modal-inner-wrapper', this.customClass] }, this.modalBody, closeBtn);
    innerWrapper.addEventListener('click', stopProp);
    formOverlay.append(innerWrapper);

    body.append(formOverlay);
    this.timer = setTimeout(() => {
      formOverlay.removeAttribute('style');
    }, 500);

    iframeResizeHandler(this.formURL, this.iframeID, this.modalBody);
  }
}

export async function createModal(formURL, modalIframeID, modalBody, customClass, isFormModal) {
  const modal = new Modal(formURL, modalIframeID, modalBody, customClass, isFormModal);
  await modal.decorateModal();
  return modal;
}

/* DEFAULT MODAL */
export default async function decorate(block) {
  const isFormModal = block.classList.contains('form-modal');
  if (isFormModal) {
    const modalContent = block.querySelector(':scope > div > div');
    const link = modalContent.querySelector('p > a:only-child');
    const formURL = link.href;
    const iframeID = 'form-modal';
    const modalBody = div({ class: 'modal-form-col' });
    link.closest('p').remove();

    const iframeWrapper = div({ class: 'modal-iframe-wrapper' },
      iframe({
        src: formURL,
        id: iframeID,
        loading: 'lazy',
        title: 'Modal',
      }),
    );

    const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = block.querySelectorAll('p');
    [...headings].forEach((heading) => {
      modalBody.append(heading);
    });
    [...paragraphs].forEach((para) => {
      modalBody.append(para);
    });

    modalBody.appendChild(iframeWrapper);

    await createModal(formURL, iframeID, modalBody, '', isFormModal);
  }
}
