import ffetch from '../../scripts/ffetch.js';

function getSelectOptions(rows) {
  return rows.map((value) => `<option value='${value}'>${value}</option>`);
}

function searchDistributorForm(countryList, productFamilyList) {
  return `
            <div class="form">
              <div class="form-group">
                <div class="fields">
                  <div class="select-wrapper">
                    <select name="country" id="country" class="form-control" required="">
                      <option value="">Select Region/Country</option>
                      ${getSelectOptions(countryList)}
                    </select>
                    <span class="fa fa-chevron-down"></span>
                  </div>
                  <div class="select-wrapper">
                    <select name="product_family" id="product_family" class="form-control">
                      <option value="">Select Product Group</option>
                      ${getSelectOptions(productFamilyList)}
                    </select>
                    <span class="fa fa-chevron-down"></span>
                  </div>
                </div>
                <div class="button" id="searchButton">
                  <button>SEARCH</button>
                </div>
              </div>
            </div>
          `;
}

function replaceHTMLTag(add) {
  let str = '';
  /*eslint operator-linebreak: ["error", "after"]*/
  if (add.indexOf('http') > -1) {
    str += add
      .split(' ')
      .map((a) =>
        a.includes('http') ? `<a href='${a}' target="_blank">${a}</a>` : `<strong>${a}</strong>`,
      )
      .join(' ');
  } else if (add.indexOf('@') > -1) {
    str += add
      .split(' ')
      .map((a) => (!a.includes(':') ? ` <a href='mailto:${a}'>${a}</a> ` : `<strong>${a}</strong>`))
      .join(' ');
  } else {
    str += `${add
      .split(': ')
      .map((a, index) => (index === 0 ? `<strong>${a}</strong>` : a))
      .join(': ')}\n`;
  }
  return str;
}

function scrollToForm() {
  const hubspotIframe = document.querySelector('.hubspot-iframe-wrapper');
  window.scroll({
    top: hubspotIframe.offsetTop - 100,
    behavior: 'smooth',
  });
}

export default async function decorate(block) {
  const distributors = await ffetch('/contacts/local-distibutors.json').withFetch(fetch).all();

  const productFamilyList = await ffetch('/contacts/local-distibutors.json')
    .sheet('PF')
    .map(({ PrimaryProducts }) => PrimaryProducts)
    .all();

  const countryList = [...new Set(distributors.map(({ Country }) => Country))];

  const renderAddress = () => {
    let countryName = document.getElementById('country').value;
    const productFamily = document.getElementById('product_family').value;

    if (!countryName) {
      countryName = 'United States';
      document.querySelector('#country').value = countryName;
    }

    const filterdata = distributors
      .filter(({ Country }) => Country.includes(countryName) > 0)
      .filter(({ PrimaryProducts }) => PrimaryProducts.includes(productFamily) > 0);

    let finalHtml = '';
    const resultHeading = document.createElement('h3');
    const searchResultEl = document.querySelector('.local-distributor .search-result');

    filterdata.forEach((row) => {
      const primeProduct = row.PrimaryProducts.replace(/,/g, ' | ');

      const customClass = row.Type.split(' ').join('-').toLowerCase();

      /*eslint operator-linebreak: ["error", "after"]*/
      const supportLink = row.Link
        ? `<a href="${row.Link}" target="_blank" rel="noopener noreferrer">Online Support Request</a>`
        : '';

      let newStr = '';
      row.Address.split('\n').forEach((add) => {
        if (add.indexOf(':') > -1) {
          newStr += replaceHTMLTag(add);
        } else {
          newStr += `${add}\n`;
        }
      });

      const molAddress = `${newStr.replace(/\n/g, '<br>')}<br>`;

      if ((row.PrimaryProducts.length && row.Address.trim().length) === 0) {
        resultHeading.textContent = 'NO RESULT FOUND';
      } else {
        resultHeading.textContent = row.Country;
        finalHtml += `
                      <div class="search-result-content ${customClass}-result">
                        <div class="type">${row.Type}</div>
                        <div class="productfamily">${primeProduct}</div>
                        <div class="address">
                          ${molAddress}
                          ${supportLink}
                          <p>
                            <a href="javascript:void(0);" title="Contact your local ${row.Type} Team">
                              Contact your local ${row.Type} Team
                            </a>
                          </p>
                        </div>
                      </div>
                    `;
      }
    });
    searchResultEl.innerHTML = finalHtml;
    searchResultEl.insertBefore(resultHeading, searchResultEl.firstChild);
  };

  const heading = block.querySelector('h5');
  const cloneHeading = heading.cloneNode(true);
  heading.remove();
  block.insertBefore(cloneHeading, block.firstChild);
  const searchResult = document.createElement('div');
  searchResult.setAttribute('class', 'search-result');
  const formWrapper = searchDistributorForm(countryList, productFamilyList);
  document.querySelector('.local-distributor > div').lastElementChild.innerHTML = formWrapper;
  document.querySelector('.local-distributor').appendChild(searchResult);
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', renderAddress);
  renderAddress();

  const localLinks = document.querySelectorAll("a[title*='Contact your local ']");
  localLinks.forEach((link) => link.addEventListener('click', scrollToForm));
}

