import ffetch from '../../scripts/ffetch.js';
// import { createOptimizedPicture } from "../../scripts/lib-franklin.js";

export default async function decorate(block) {
  const heading = block.querySelector('h5');
  const cloneHeading = heading.cloneNode(true);
  heading.remove();
  block.insertBefore(cloneHeading, block.firstChild);

  const searchResult = document.createElement('div');
  searchResult.setAttribute('class', 'searchResult');
  const distributors = await ffetch('/local-distibutors.json').withFetch(fetch).all();

  const countryList = [...new Set(distributors.map(({ Country }) => Country))];
  const countrySelectOptions = countryList.map(
    (value) => `<option value='${value}'>${value}</option>`,
  );

  // let productFamilyList = [...new Set(distributors.map((({ PrimaryProducts: t }) => t)))];

  function renderAddress() {
    const countryName = document.getElementById('country').value;
    const productFamily = document.getElementById('product_family').value;

    const filterdata = ffetch('/local-distibutors.json')
      .withFetch(fetch)
      .filter(({ Country }) => Country.includes(countryName) > 0)
      .filter(({ PrimaryProducts }) => PrimaryProducts.includes(productFamily) > 0)
      .all();

    filterdata.then((result) => {
      let finalHtml = '';
      const resultHeading = document.createElement('h3');
      const searchResult = document.querySelector('.local-distributor .searchResult');
      result.forEach((row) => {
        resultHeading.textContent = row.Country;

        let primeProduct;
        row.PrimaryProducts.forEach((prod) => {
          if (prod) {
            primeProduct += `<li>${prod}</li>`;
          }
        });

        finalHtml += `<div class="searchResult-content ${row.Type.split(' ')
          .join('-')
          .toLowerCase()}-result">
                  <div class="type">${row.Type}</div>
                  <ul class="productfamily">${primeProduct}</ul>
                  <div class="address">
										<address>${row.Address}</address>
									</div>
              </div>`;
      });
      searchResult.innerHTML = finalHtml;
      searchResult.insertBefore(resultHeading, searchResult.firstChild);
    });
  }

  const formWrapper = `<div class="form">
  <div class="form-group">
      <div class="fields">
          <div class="select-wrapper">
              <select name="country" id="country" class="form-control" required="">
								<option value="">Select Region/Country</option>
									${countrySelectOptions}
								</select>
							<span class="fa fa-chevron-down"></span>
          </div>
          <div class="select-wrapper">
						<select name="product_family" id="product_family" class="form-control">
							<option value="">Select Product Group</option>
							<option value="Assay Kits, Media, Reagents"> Assay Kits, Media, Reagents</option>
							<option value="Axon/Patch Clamp"> Axon/Patch Clamp</option>
							<option value="Cellular Imaging Systems"> Cellular Imaging Systems</option>
							<option value="Clone Screening Systems"> Clone Screening Systems</option>
							<option value="MetaMorph"> MetaMorph</option>
							<option value="Microplate Readers"> Microplate Readers</option>
							<option value="Threshold High Throughput Screening"> Threshold High Throughput Screening</option>
							<option value="Washers and Handlers"> Washers and Handlers</option>
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

  document.querySelector('.local-distributor > div').lastElementChild.innerHTML = formWrapper;
  document.querySelector('.local-distributor').appendChild(searchResult);
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', renderAddress);
}
