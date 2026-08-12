const DEFAULT_PASSWORD = 'kynnieyushie';
const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

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

const isUnlocked = () => sessionStorage.getItem('privateWorkspaceUnlocked') === 'true';

function setScreenState(unlocked) {
  loginScreen.classList.toggle('active', !unlocked);
  appScreen.classList.toggle('active', unlocked);
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

function handleLogout() {
  sessionStorage.removeItem('privateWorkspaceUnlocked');
  setScreenState(false);
  passwordInput.value = '';
  showLoginError('');
}

function renderAssignmentDraft() {
  const title = projectTitleInput.value.trim() || 'Untitled Project';
  const subject = subjectInput.value.trim() || 'General study';
  const brief = briefInput.value.trim() || 'Discuss the key ideas and practical value of the project.';
  const source = sourceInfoInput.value.trim() || 'No source information provided yet.';
  const tone = toneSelect.value;

  const draft = `
# ${title}

## Subject
${subject}

## Assignment Purpose
${brief}

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
  return `[${language} translation preview]\n\n${cleanText}\n\nThis draft is structured for ${language} presentation and can be refined for formal academic writing, a slide-friendly format, or final presentation notes.`;
}

function handleGenerate() {
  const generatedText = renderAssignmentDraft();
  const targetLanguageText = targetLanguage.value;
  const translated = translateText(generatedText, targetLanguageText);
  translationOutput.value = translated;
}

function handleTranslate() {
  const currentText = assignmentOutput.textContent || assignmentOutput.innerText || '';
  const currentLanguage = targetLanguage.value;
  translationOutput.value = translateText(currentText, currentLanguage);
}

loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
generateBtn.addEventListener('click', handleGenerate);
translateBtn.addEventListener('click', handleTranslate);

if (fileUpload) {
  fileUpload.addEventListener('change', () => {
    const fileName = fileUpload.files && fileUpload.files[0] ? fileUpload.files[0].name : 'No file selected';
    sourceInfoInput.value = sourceInfoInput.value
      ? `${sourceInfoInput.value}\n\nUploaded file: ${fileName}`
      : `Uploaded file: ${fileName}`;
  });
}

setScreenState(isUnlocked());
if (!isUnlocked()) {
  usernameInput.value = 'ashley';
}
