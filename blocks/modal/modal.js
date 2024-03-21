/* eslint-disable import/no-cycle, class-methods-use-this */
import {
  button, div, iframe, span,
} from '../../scripts/dom-helpers.js';
import { createOptimizedPicture, loadCSS, loadScript } from '../../scripts/lib-franklin.js';
import { iframeResizeHandler } from '../../scripts/scripts.js';
import { newsletterModal } from '../../templates/blog/blog.js';

export function stopProp(e) {
  e.stopPropagation();
}

const modalParentClass = 'modal-overlay';
const { body } = document;
export class Modal {
  constructor(formURL, iframeID, modalBody, customClass, isFormModal) {
    this.formURL = formURL;
    this.iframeID = iframeID;
    this.modalBody = modalBody;
    this.isFormModal = isFormModal;
    this.customClass = customClass;
    this.timer = '';
  }

  showModal() {
    const modal = document.querySelector(`.${modalParentClass}`);
    modal.removeAttribute('aria-hidden');
    body.classList.add('no-scroll');
    clearTimeout(this.timer);
  }

  hideModal() {
    const modal = document.querySelector(`.${modalParentClass}`);
    modal.setAttribute('aria-hidden', true);
    body.classList.remove('no-scroll');
  }

  triggerModalWithUrl(url) {
    const modal = document.querySelector(`.${modalParentClass}`);
    modal.querySelector('iframe').setAttribute('src', url);
    this.timer = setTimeout(() => {
      modal.setAttribute('aria-hidden', false);
      body.classList.add('no-scroll');
    }, 300);
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

    const formOverlay = div({ 'aria-hidden': true, class: modalParentClass, style: 'display:none;' });
    const closeBtn = span({ class: 'icon icon-close' }, createOptimizedPicture('/icons/close-video.svg', 'Close Video'));
    const innerWrapper = div({ class: ['modal-inner-wrapper', this.customClass] }, this.modalBody, closeBtn);

    if (this.isFormModal) {
      const modalBtn = button({ id: 'show-modal', style: 'display: none;' }, 'Show Modal');
      modalBtn.addEventListener('click', this.showModal);
      body.append(modalBtn);
      window.addEventListener('scroll', this.triggerShowModalButton);
    }

    formOverlay.addEventListener('click', this.hideModal);
    closeBtn.addEventListener('click', this.hideModal);
    innerWrapper.addEventListener('click', stopProp);

    formOverlay.append(innerWrapper);
    body.append(formOverlay);

    this.timer = setTimeout(() => {
      formOverlay.removeAttribute('style');
    }, 1000);

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
  const isBlogModal = block.classList.contains('blog-popup');
  const isFormModal = block.classList.contains('form-modal');

  if (isBlogModal) {
    const modalContent = block.querySelector(':scope > div > div');
    const link = modalContent.querySelector('p > a:only-child, a:only-child');
    const formURL = link.href;
    await newsletterModal(formURL, 'form-modal');
  }

  if (isFormModal) {
    const modalContent = block.querySelector(':scope > div > div');
    const link = modalContent.querySelector('p > a:only-child, a:only-child');
    const formURL = link.href;
    link.closest('p').remove();

    const iframeID = 'form-modal';
    const modalBody = div({ class: 'modal-form' });
    const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = block.querySelectorAll('p');

    const iframeWrapper = div({ class: 'modal-iframe-wrapper' },
      iframe({
        src: formURL,
        id: iframeID,
        loading: 'lazy',
        title: 'Modal',
      }),
    );

    [...headings].forEach((heading) => {
      modalBody.append(heading);
    });

    [...paragraphs].forEach((para) => {
      modalBody.append(para);
    });

    modalBody.appendChild(iframeWrapper);
    await createModal(formURL, iframeID, modalBody, '', isFormModal);
  }

  block.closest('.section').remove();
}
