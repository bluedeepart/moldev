function createFormRoot(hubspotUrl, mapUrl) {
  const hubspotIframeWrapper = document.createElement('div');
  const hubspotIframe = document.createElement('iframe');

  hubspotIframeWrapper.className = 'hubspot-iframe-wrapper';
  hubspotIframe.setAttribute('loading', 'lazy');
  hubspotIframeWrapper.appendChild(hubspotIframe);

  const mapIframeWrapper = document.createElement('div');
  const mapIframe = document.createElement('iframe');

  mapIframeWrapper.className = 'map-iframe-wrapper';
  mapIframe.setAttribute('loading', 'lazy');
  mapIframeWrapper.appendChild(mapIframe);

  hubspotUrl.parentNode.replaceChild(hubspotIframeWrapper, hubspotUrl);
  mapUrl.parentNode.replaceChild(mapIframeWrapper, mapUrl);
}

function addIframe(hubspotUrl, mapUrl) {
  const hubspotIframeWrapper = document.querySelector('.hubspot-iframe-wrapper');
  const hubspotIframe = hubspotIframeWrapper.querySelector('iframe');
  const mapIframeWrapper = document.querySelector('.map-iframe-wrapper');
  const mapIframe = mapIframeWrapper.querySelector('iframe');

  hubspotIframe.src = hubspotUrl.href;
  mapIframe.src = mapUrl.href;
}

function scrollToForm(link, hubspotUrl) {
  const hubspotIframe = document.querySelector('.hubspot-iframe-wrapper');
  if (hubspotUrl) {
    if (link.getAttribute('title') === 'Sales Inquiry Form') {
      hubspotUrl.href = `${hubspotUrl.href}&comments=Sales`;
    } else {
      const [href] = hubspotUrl.href.split('&');
      hubspotUrl.href = href;
    }
    hubspotIframe.querySelector('iframe').setAttribute('src', hubspotUrl);
  }
  window.scroll({
    top: hubspotIframe.offsetTop - 100,
    behavior: 'smooth',
  });
}

export default function decorate(block) {
  const hubspotUrl = block.querySelector('[href*="https://info.moleculardevices.com"]');
  const mapUrl = block.querySelector('[href*="https://maps.google.com"]');
  createFormRoot(hubspotUrl, mapUrl);

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      addIframe(hubspotUrl, mapUrl);
    }
  });
  observer.observe(block);

  const inquiryLinks = ['General Inquiry Form', 'Sales Inquiry Form', 'Contact Local Team'];
  const links = document.querySelectorAll('a[title]');
  links.forEach((link) => {
    if (inquiryLinks.includes(link.getAttribute('title'))) {
      link.addEventListener('click', scrollToForm.bind(null, link, hubspotUrl), false);
    }
  });
}
