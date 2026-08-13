const DEFAULT_PASSWORD = 'kynnieyushie';
const TRANSLATION_AGENT = 'AI';
const AI_AGENT_NAME = 'Gemini';
const ACCOUNT_EMAIL = 'mhembereashley@gmail.com';
const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const translationAgentLabel = document.getElementById('translation-agent-label');
const aiAgentLabel = document.getElementById('ai-agent-label');
const accountEmailLabel = document.getElementById('account-email-label');

const projectTitleInput = document.getElementById('project-title');
const subjectInput = document.getElementById('subject');
const briefInput = document.getElementById('brief');
const sourceInfoInput = document.getElementById('source-info');
const targetLanguage = document.getElementById('target-language');
const toneSelect = document.getElementById('tone');
const fileUpload = document.getElementById('file-upload');
const generateBtn = document.getElementById('generate-btn');
const translateBtn = document.getElementById('translate-btn');
const assignmentOutput = document.getElementById('assignment-output');
const translationOutput = document.getElementById('translation-output');

const shopProductNameInput = document.getElementById('shop-product-name');
const shopCategoryInput = document.getElementById('shop-category');
const shopPriceInput = document.getElementById('shop-price');
const shopDescriptionInput = document.getElementById('shop-description');
const shopImageUpload = document.getElementById('shop-image-upload');
const shopUploadStatus = document.getElementById('shop-upload-status');
const saveShopProductBtn = document.getElementById('save-shop-product-btn');
const shopGallery = document.getElementById('shop-gallery');
const newProductBtn = document.getElementById('new-product-btn');

const MAX_PRODUCT_IMAGES = 2000000;
const productList = JSON.parse(sessionStorage.getItem('fastzimShopProducts') || '[]');

const isUnlocked = () => sessionStorage.getItem('privateWorkspaceUnlocked') === 'true';

function setScreenState(unlocked) {
  loginScreen.classList.toggle('active', !unlocked);
  appScreen.classList.toggle('active', unlocked);
}

function updateAgentProfile() {
  if (translationAgentLabel) {
    translationAgentLabel.textContent = `Translation agent: ${TRANSLATION_AGENT}`;
  }

  if (aiAgentLabel) {
    aiAgentLabel.textContent = `AI agent: ${AI_AGENT_NAME}`;
  }

  if (accountEmailLabel) {
    accountEmailLabel.textContent = `Account: ${ACCOUNT_EMAIL}`;
  }
}

function showLoginError(message) {
  loginError.textContent = message;
}

function handleLogin(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showLoginError('Please enter your username and password.');
    return;
  }

  if (username.toLowerCase() === 'ashley' && password === DEFAULT_PASSWORD) {
    sessionStorage.setItem('privateWorkspaceUnlocked', 'true');
    passwordInput.value = '';
    showLoginError('');
    setScreenState(true);
    return;
  }

  showLoginError('Incorrect username or password.');
}

function renderShopGallery() {
  if (!shopGallery) return;

  const products = JSON.parse(sessionStorage.getItem('fastzimShopProducts') || '[]');

  if (!products.length) {
    shopGallery.classList.add('empty');
    shopGallery.innerHTML = '<p>No products added yet. Start by adding your first listing.</p>';
    return;
  }

  shopGallery.classList.remove('empty');
  shopGallery.innerHTML = products.map((product) => {
    const images = (product.images || []).slice(0, 4).map((src) => `
      <img src="${src}" alt="${product.name}" loading="lazy" />
    `).join('');

    return `
      <article class="shop-product-card">
        <div class="shop-product-images">
          ${images || '<div class="empty-product-image">No image</div>'}
        </div>
        <div class="shop-product-body">
          <div class="shop-product-top">
            <h4>${product.name}</h4>
            <span class="price-tag">$${Number(product.price || 0).toFixed(2)}</span>
          </div>
          <p class="shop-category">${product.category || 'General'}</p>
          <p>${product.description || 'No description available.'}</p>
        </div>
      </article>
    `;
  }).join('');
}

function validateShopProduct() {
  const productName = shopProductNameInput.value.trim();
  const category = shopCategoryInput.value.trim();
  const price = Number(shopPriceInput.value);
  const description = shopDescriptionInput.value.trim();
  const selectedFiles = shopImageUpload.files ? Array.from(shopImageUpload.files) : [];

  if (!productName || !category || !description || Number.isNaN(price) || price < 0) {
    shopUploadStatus.textContent = 'Please complete the product name, category, description, and valid price.';
    return null;
  }

  if (!selectedFiles.length) {
    shopUploadStatus.textContent = 'Please upload at least one HD product image.';
    return null;
  }

  const validImages = selectedFiles.filter((file) => file.type.startsWith('image/'));
  if (!validImages.length) {
    shopUploadStatus.textContent = 'Only image files are allowed.';
    return null;
  }

  if (validImages.length > MAX_PRODUCT_IMAGES) {
    shopUploadStatus.textContent = `Please upload no more than ${MAX_PRODUCT_IMAGES.toLocaleString()} images.`;
    return null;
  }

  return {
    name: productName,
    category,
    price,
    description,
    images: validImages.map((file) => URL.createObjectURL(file))
  };
}

function saveShopProduct() {
  const product = validateShopProduct();
  if (!product) return;

  const currentProducts = JSON.parse(sessionStorage.getItem('fastzimShopProducts') || '[]');
  currentProducts.unshift(product);
  sessionStorage.setItem('fastzimShopProducts', JSON.stringify(currentProducts));

  shopProductNameInput.value = '';
  shopCategoryInput.value = '';
  shopPriceInput.value = '';
  shopDescriptionInput.value = '';
  shopImageUpload.value = '';
  shopUploadStatus.textContent = 'Product saved successfully. HD images are now available in the shop room.';
  renderShopGallery();
}

function handleLogout() {
  sessionStorage.removeItem('privateWorkspaceUnlocked');
  setScreenState(false);
  passwordInput.value = '';
  showLoginError('');
}

function getSelectedLanguage() {
  const selected = targetLanguage && targetLanguage.value ? targetLanguage.value : 'English';
  return selected === 'Auto-detect' ? 'English' : selected;
}

function renderAssignmentDraft() {
  const title = projectTitleInput.value.trim() || 'Untitled Project';
  const subject = subjectInput.value.trim() || 'General study';
  const brief = briefInput.value.trim() || 'Discuss the key ideas and practical value of the project.';
  const source = sourceInfoInput.value.trim() || 'No source information provided yet.';
  const tone = toneSelect.value;
  const preferredLanguage = getSelectedLanguage();

  const draft = `
# ${title}

## Subject
${subject}

## Assignment Purpose
${brief}

## Preferred output language
${preferredLanguage}

## Key Ideas
- Overview of the main concept and context
- Explain the significance of the topic in practical terms
- Discuss the main challenges, opportunities, and outcomes
- Connect the information to real-world application

## Supporting Information
${source}

## Recommended structure
1. Introduction and background
2. Main discussion and analysis
3. Evidence, examples, and interpretation
4. Conclusion and recommendations

## Tone and presentation
This response should be written in a ${tone.toLowerCase()} style with clear headings and a balanced academic explanation.
  `;

  assignmentOutput.innerHTML = draft.replace(/\n/g, '<br>');
  return draft;
}

function translateText(text, language) {
  if (!text || !text.trim()) return 'No content available for translation.';

  const cleanText = text.trim();
  const outputLanguage = language === 'Auto-detect' ? 'English' : language;
  return `[${outputLanguage} translation preview]\n\n${cleanText}\n\nThis draft is structured for ${outputLanguage} presentation and can be refined for formal academic writing, a slide-friendly format, or final presentation notes.`;
}

function handleGenerate() {
  const generatedText = renderAssignmentDraft();
  const targetLanguageText = getSelectedLanguage();
  const translated = translateText(generatedText, targetLanguageText);
  translationOutput.value = translated;
}

function handleTranslate() {
  const currentText = assignmentOutput.textContent || assignmentOutput.innerText || '';
  const currentLanguage = getSelectedLanguage();
  translationOutput.value = translateText(currentText, currentLanguage);
}

loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
generateBtn.addEventListener('click', handleGenerate);
translateBtn.addEventListener('click', handleTranslate);
saveShopProductBtn.addEventListener('click', saveShopProduct);
newProductBtn.addEventListener('click', () => {
  shopProductNameInput.value = '';
  shopCategoryInput.value = '';
  shopPriceInput.value = '';
  shopDescriptionInput.value = '';
  shopImageUpload.value = '';
  shopUploadStatus.textContent = 'Upload clear HD product photos for your shop listing.';
  shopProductNameInput.focus();
});

if (fileUpload) {
  fileUpload.addEventListener('change', () => {
    const fileName = fileUpload.files && fileUpload.files[0] ? fileUpload.files[0].name : 'No file selected';
    sourceInfoInput.value = sourceInfoInput.value
      ? `${sourceInfoInput.value}\n\nUploaded file: ${fileName}`
      : `Uploaded file: ${fileName}`;
  });
}

if (shopImageUpload) {
  shopImageUpload.addEventListener('change', () => {
    const files = shopImageUpload.files ? Array.from(shopImageUpload.files) : [];
    const imageCount = files.filter((file) => file.type.startsWith('image/')).length;
    shopUploadStatus.textContent = imageCount
      ? `${imageCount} HD image${imageCount > 1 ? 's' : ''} ready to be saved.`
      : 'Please upload clear image files for the product.';
  });
}

updateAgentProfile();
renderShopGallery();
setScreenState(isUnlocked());
if (!isUnlocked()) {
  usernameInput.value = 'ashley';
}
