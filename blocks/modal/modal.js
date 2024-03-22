import {
  button, div, iframe, span,
} from '../../scripts/dom-helpers.js';
import { createOptimizedPicture, loadCSS, loadScript } from '../../scripts/lib-franklin.js';
import { iframeResizeHandler } from '../../scripts/scripts.js';

const { body } = document;
const modalParentClass = 'modal-overlay';
let timer;

export function hideModal() {
  const modal = document.querySelector(`.${modalParentClass}`);
  modal.setAttribute('aria-hidden', true);
  body.classList.remove('no-scroll');
  clearTimeout(timer);
}

export function showModal() {
  const modal = document.querySelector('.modal-overlay');
  modal.removeAttribute('aria-hidden');
  body.classList.add('no-scroll');
}

export function triggerModalWithUrl(url) {
  const modal = document.querySelector(`.${modalParentClass}`);
  modal.querySelector('iframe').setAttribute('src', url);
  timer = setTimeout(() => {
    modal.setAttribute('aria-hidden', false);
    body.classList.add('no-scroll');
  }, 500);
}

export function stopProp(e) {
  e.stopPropagation();
}

function triggerModalBtn() {
  const scrollFromTop = window.scrollY;
  const midHeightOfViewport = Math.floor(body.getBoundingClientRect().height / 2.25);
  const modalBtn = document.getElementById('show-modal');

  if (scrollFromTop > midHeightOfViewport) {
    if (modalBtn) {
      modalBtn.click();
      modalBtn.remove();
    }
  }
}

export async function decorateModal(formURL, iframeID, modalBody, modalClass, isFormModal) {
  const formOverlay = div({ 'aria-hidden': true, class: modalParentClass, style: 'display:none;' });
  const closeBtn = span({ class: 'icon icon-close' }, createOptimizedPicture('/icons/close-video.svg', 'Close Video'));
  const innerWrapper = div({ class: ['modal-inner-wrapper', modalClass] }, modalBody, closeBtn);

  loadScript('/scripts/iframeResizer.min.js');
  loadCSS('/blocks/modal/modal.css');

  if (isFormModal) {
    const modalBtn = button({ id: 'show-modal', style: 'display: none;' }, 'Show Modal');
    modalBtn.addEventListener('click', showModal);
    body.append(modalBtn);
    window.addEventListener('scroll', triggerModalBtn);
  }

  formOverlay.addEventListener('click', hideModal);
  closeBtn.addEventListener('click', hideModal);
  innerWrapper.addEventListener('click', stopProp);

  formOverlay.append(innerWrapper);
  body.append(formOverlay);

  timer = setTimeout(() => {
    formOverlay.removeAttribute('style');
  }, 500);

  iframeResizeHandler(formURL, iframeID, modalBody);
}

export default async function decorate(block) {
  const isFormModal = block.classList.contains('form-modal');

  if (isFormModal) {
    const modalContent = block.querySelector(':scope > div > div');
    const link = modalContent.querySelector('p > a:only-child');
    const formURL = link.href;
    const iframeID = 'form-modal';
    const modalBody = div({ class: 'modal-form-col' });
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

    link.closest('p').remove();

    [...headings].forEach((heading) => {
      modalBody.append(heading);
    });
    [...paragraphs].forEach((para) => {
      modalBody.append(para);
    });

    modalBody.appendChild(iframeWrapper);
    await decorateModal(formURL, iframeID, modalBody, '', isFormModal);
  }
}
