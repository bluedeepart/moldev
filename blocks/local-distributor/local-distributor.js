import ffetch from '../../scripts/ffetch.js';
import {
	createOptimizedPicture
} from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
	const searchResult = document.createElement('div');
	searchResult.setAttribute('class', 'searchResult');
	const distributors = await ffetch('/local-distibutors.json').withFetch(fetch)
		.all();

	let countryList = [...new Set(distributors.map(({
		Country
	}) => Country))];
	let countrySelectOptions = countryList.map((value) => {
		return `<option value='${value}'>${value}</option>`;
	})

	let productFamilyList = [...new Set(distributors.map(({
		PrimaryProducts
	}) => PrimaryProducts))];

	function renderAddress() {
		let countryName = document.getElementById('country').value;
		let productFamily = document.getElementById('product_family').value;

		const filterdata = ffetch('/local-distibutors.json').withFetch(fetch)
			.filter(({
				Country
			}) => Country.includes(countryName) > 0)
			.filter(({
				PrimaryProducts
			}) => PrimaryProducts.includes(productFamily) > 0)
			.all();

		filterdata.then(function(result) {
			let finalHtml = '';
			result.forEach(function(row) {
				finalHtml += `<div class="result">
                  <div class="type">${row.Type}</div>
                  <div class="productfamily">${row.PrimaryProducts}</div>
                  <div class="address">${row.Address}</div>
              </div>`;
			});
			document.querySelector('.local-distributor .searchResult').innerHTML = finalHtml;
		});

	}

	const formWrapper = `<div class="form">
  <div class="form-group">
      <div class="fields">
          <div>
              <select name="country" id="country" class="form-control" required="">
              <option value="">Select Region/Country</option>
                ${countrySelectOptions}
              </select>
          </div>
          <div>
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
	const searchButton = document.getElementById("searchButton");
	searchButton.addEventListener("click", renderAddress);

}