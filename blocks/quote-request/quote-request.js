import ffetch from '../../scripts/ffetch.js';
import { loadScript } from '../../scripts/scripts.js';

/* CREATE RFQ LIST BOX */
function createRFQListBox(listArr, checkStep, callback) {
	const list = document.createElement('ul');
	list.classList.add('rfq-icon-list');
	listArr.forEach((rfq) => {
		const listItem = document.createElement('li');
		const listLink = document.createElement('a');
		const listImg = document.createElement('img');
		const listTitle = document.createElement('span');

		if (checkStep === 'step-1') {
			const id = rfq.Type.toLowerCase().replace(',', '').trim();
			listLink.id = id.split(' ').join('-');
			listLink.href = '#step-2';
			listLink.setAttribute('data-tab', rfq.Type);
			listImg.src = rfq['RFQ-Image'];
			listTitle.innerHTML = rfq.Type;
			listLink.appendChild(listImg);
		} else {
			listLink.href = '#step-3';
			listLink.setAttribute('data-tab', rfq.Category);
			listTitle.innerHTML = rfq.Category;
		}

		listLink.addEventListener('click', callback);
		listImg.classList.add('rfq-icon-img');
		listTitle.classList.add('rfq-icon-title');
		listLink.classList.add('rfq-icon-link');
		listItem.classList.add('rfq-icon-item');

		listLink.appendChild(listTitle);
		listItem.appendChild(listLink);
		list.appendChild(listItem);
	});
	return list;
}
/* CREATE RFQ LIST BOX */

/* CREATE PROGRESS BAR */
function createProgessBar(val, checkStep) {
	const progressWrapper = document.createElement('div');
	const progressBullet = document.createElement('div');
	const progressBar = document.createElement('div');
	const progress = document.createElement('div');

	progressWrapper.classList.add('progress-wrapper');
	progressBullet.classList.add('progress-bullet');
	progressBar.classList.add('progress-bar');
	progress.classList.add('progress');
	progress.id = 'progressBar';

	progress.style.width = `${val}%`;

	if (checkStep === 'step-1') {
		progressWrapper.appendChild(progressBullet);
	}

	progressBar.appendChild(progress);
	progressWrapper.appendChild(progressBar);
	return progressWrapper;
}
/* CREATE PROGRESS BAR */

function backOneStep(stepNum) {
	const currentTab = document.getElementById(stepNum);
	const prevTab = currentTab.previousElementSibling;

	currentTab.style.display = 'none';
	prevTab.style.display = 'block';
}

function createBackBtn(stepNum) {
	const backBtn = document.createElement('a');
	const icon = document.createElement('i');

	icon.classList.add('fa-angle-left', 'fa');
	/* eslint no-script-url: "error" */
	backBtn.href = 'javascript:void(0);';
	backBtn.classList.add('back-step-btn');
	backBtn.appendChild(icon);

	backBtn.addEventListener('click', backOneStep.bind(null, stepNum, false));

	return backBtn;
}

const url = '/quote-request/global-rfq.json';

/* step one */
const rfqTypes = await ffetch(url).sheet('types').all();

function stepOne(callback) {
	const stepNum = 'step-1';
	const root = document.getElementById(stepNum);
	const defaultProgessValue = 40;
	const heading = document.createElement('h3');
	heading.textContent = 'What type of product are you interested in?';

	const fetchRQFTypes = createRFQListBox(rfqTypes, stepNum, callback);
	const progressBarHtml = createProgessBar(defaultProgessValue, stepNum);

	root.appendChild(heading);
	root.appendChild(fetchRQFTypes);
	root.appendChild(progressBarHtml);
}

/* step three */
function stepThree(e) {
	e.preventDefault();

	let tab = '';
	if (e.target.getAttribute('data-tab')) {
		tab = e.target.getAttribute('data-tab');
	} else {
		tab = e.target.closest('.rfq-icon-link').getAttribute('data-tab');
	}

	loadScript('https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.16/iframeResizer.min.js');
	const formUrl = 'https://info.moleculardevices.com/rfq';
	const stepNum = 'step-3';
	const prevRoot = document.getElementById('step-2');
	const root = document.getElementById(stepNum);
	root.innerHTML = '';

	const heading = document.createElement('h3');
	const description = document.createElement('p');
	const productName = document.createElement('span');
	const iframe = document.createElement('iframe');
	iframe.id = 'contact-quote-request';
	heading.textContent = "Got it. Now, let's get in touch.";

	// eslint-disable-next-line
	description.innerHTML =
		'A team member will contact you within 24-business hours regarding your product inquiry for : <br>';
	productName.innerHTML = `<strong>${tab}</strong>`;
	iframe.src = formUrl;

	iframe.style.border = 0;
	iframe.style.width = '100%';
	iframe.style.height = '640px';

	description.appendChild(productName);
	root.appendChild(heading);
	root.appendChild(description);
	root.appendChild(iframe);
	root.appendChild(createBackBtn(stepNum));

	root.style.display = 'block';
	prevRoot.style.display = 'none';
}

/* step two */
const rfqCategories = await ffetch(url).sheet('categories').all();

function stepTwo(e) {
	e.preventDefault();

	let tab = '';
	if (e.target.getAttribute('data-tab')) {
		tab = e.target.getAttribute('data-tab');
	} else {
		tab = e.target.closest('.rfq-icon-link').getAttribute('data-tab');
	}

	const stepNum = 'step-2';
	const prevRoot = document.getElementById('step-1');
	const root = document.getElementById(stepNum);
	root.innerHTML = '';
	const filterData = rfqCategories.filter(({ Type }) => Type.includes(tab) > 0);

	const defaultProgessValue = 70;
	const heading = document.createElement('h3');
	heading.textContent = 'Please select the Instrument category';

	const fetchRQFTypes = createRFQListBox(filterData, stepNum, stepThree);
	const progressBarHtml = createProgessBar(defaultProgessValue, stepNum);

	root.appendChild(heading);
	root.appendChild(fetchRQFTypes);
	root.appendChild(progressBarHtml);
	root.appendChild(createBackBtn(stepNum));
	root.style.display = 'block';
	prevRoot.style.display = 'none';
}

export default async function decorate(block) {
	const Observer = new IntersectionObserver((entries) => {
		if (entries.some((e) => e.isIntersecting)) {
			entries.forEach((entry) => {
				entry.target.innerHTML = `
        <div id="step-1" class="rfq-product-wrapper"></div>
        <div id="step-2" class="rfq-product-wrapper" style="display: none;"></div>
        <div id="step-3" class="rfq-product-wrapper request-quote-form" style="display: none;"></div>`;
				stepOne(stepTwo);
			});
		}
	});
	Observer.observe(block);
}
