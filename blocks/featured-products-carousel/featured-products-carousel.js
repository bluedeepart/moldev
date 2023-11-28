import ffetch from '../../scripts/ffetch.js';
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import { createCard } from '../card/card.js';
import { createCarousel } from '../carousel/carousel.js';


const resourceCard = await createCard({
  defaultButtonText: fetchPlaceholders.details || 'Details',
  titleLink: false,
  thumbnailLink: false,
});

const miniStyleConfig = {
  defaultStyling: true,
  navButtons: false,
  dotButtons: false,
  infiniteScroll: true,
  autoScroll: false,
  counter: true,
  counterText: 'Product',
  imageBlockReady: true,
  visibleItems: [
    {
      items: 1,
    },
  ],
  cardRenderer: resourceCard,
};

async function getCbValues(link) {
  return await ffetch('/query-index.json')
  .sheet('products')
  .filter((post) => link.indexOf(post.path) > -1)
  .all();
}

export default async function decorate(block) {
  const miniStyle = block.classList.contains('mini');
  if (miniStyle) {
    let products = [];
    const product_links = block.querySelectorAll('a');
    products = await getCbValues([...product_links].map((link) => link.getAttribute('href')));
    await createCarousel(block, products, miniStyleConfig);
    return;
  }
}
