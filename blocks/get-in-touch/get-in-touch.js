function addIframe() {
  const hubspotUrl = document.querySelector(
    '.get-in-touch-wrapper > div > div > div:first-of-type [href*="https://info.moleculardevices.com"]',
  );
  const hubspotIframeWrapper = document.createElement('div');
  const hubspotIframe = document.createElement('iframe');
  hubspotIframeWrapper.className = 'hubspot-iframe-wrapper';
  hubspotIframe.src = hubspotUrl.href;
  hubspotIframe.setAttribute('loading', 'lazy');
  hubspotIframeWrapper.appendChild(hubspotIframe);
  hubspotUrl.parentNode.replaceChild(hubspotIframeWrapper, hubspotUrl);

  const mapUrl = document.querySelector(
    '.get-in-touch-wrapper > div > div > div:last-of-type [href*="https://maps.google.com"]',
  );
  const mapIframe = document.createElement('iframe');
  mapIframe.src = mapUrl.href;
  mapIframe.setAttribute('loading', 'lazy');
  mapUrl.parentNode.replaceChild(mapIframe, mapUrl);
}

function scrollToForm(link, hubspotUrl) {
  const hubspotIframe = document.querySelector('.hubspot-iframe-wrapper');
  if (hubspotUrl) {
    if (link.getAttribute('title') === 'Sales Inquiry Form') {
      hubspotUrl.href = `${hubspotUrl.href}&comments=Sales`;
    } else {
      [hubspotUrl.href, ''] = hubspotUrl.href.split('&');
    }
    hubspotIframe.querySelector('iframe').setAttribute('src', hubspotUrl);
  }
  window.scroll({
    top: hubspotIframe.offsetTop - 100,
    behavior: 'smooth',
  });
}

export default function decorate(block) {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      addIframe();
    }
  });
  observer.observe(block);

  const hubspotUrl = document.querySelector(
    '.get-in-touch-wrapper > div > div > div:first-of-type [href*="https://info.moleculardevices.com"]',
  );
  const inquiryLinks = ['General Inquiry Form', 'Sales Inquiry Form'];
  const links = document.querySelectorAll('a[title]');

  links.forEach((link) => {
    if (inquiryLinks.includes(link.getAttribute('title'))) {
      link.addEventListener('click', scrollToForm.bind(null, link, hubspotUrl), false);
    }
  });
}
