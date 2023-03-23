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

function replaceHTMLTag(element, replaceWith) {
  return element.replace(element, replaceWith);
}

export default async function decorate(block) {
  const distributors = await ffetch('/local-distibutors.json').withFetch(fetch).all();

  const productFamilyList = await ffetch('/test.json')
    .withFetch(fetch)
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

      const supportLink = row.Link
        ? `<a href="${row.Link}" target="_blank" rel="noopener noreferrer">Online Support Request</a>`
        : '';

      let newStr = '';
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          entries.forEach((entry) => {
            if (entry.indexOf(':') > -1) {
              if (entry.indexOf('http') > -1) {
                newStr += replaceHTMLTag(entry, ` <a href='${entry}'>${entry}</a> `);
              } else {
                newStr += replaceHTMLTag(entry, ` <strong>${entry}</strong> `);
              }
            } else if (entry.indexOf('@') > -1) {
              newStr += replaceHTMLTag(entry, ` <a href='mailto:${entry}'>${entry}</a> `);
            } else {
              newStr += `${entry} `;
            }
            observer.disconnect(entry.target);
          });
        }
      });
      row.Address.split(' ').forEach((item) => observer.observe(item));

      const molAddress = `${newStr.replace(/\n/g, '<br>')}<br>`;

      if ((row.PrimaryProducts.length && row.Address.length) === 0) {
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
                        </div>
                        <p><a href="#">Contact your local ${row.Type} Team</a></p>
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
}
