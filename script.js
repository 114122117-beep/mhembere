document.addEventListener('DOMContentLoaded', () => {
  const flowSteps = document.querySelectorAll('.flow-step');

  function enterOnboarding() {
    document.body.classList.add('onboarding-mode');
    showStep('welcome-step');
  }

  function resumePublicSite() {
    document.body.classList.remove('onboarding-mode');
    document.body.classList.remove('welcome-hidden');
  }

  function showStep(stepId) {
    flowSteps.forEach((step) => {
      step.classList.toggle('active', step.id === stepId);
    });
  }

  const hasStartedJourney = window.sessionStorage.getItem('fastzim_rules_accepted') === 'true' || window.sessionStorage.getItem('fastzim_auth_completed') === 'true';

  if (!hasStartedJourney) {
    enterOnboarding();
  } else {
    resumePublicSite();
  }
  const flowNextButtons = document.querySelectorAll('.flow-next');
  const flowBackButtons = document.querySelectorAll('.flow-back');
  const rulesCheckbox = document.getElementById('company-rules-check');
  const rulesContinueButton = document.getElementById('rules-continue');
  const serviceChoices = document.querySelectorAll('.service-choice');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const providerCards = document.querySelectorAll('.provider-card');
  const providerRole = document.getElementById('provider-role');

  const rulesAcceptedKey = 'fastzim_rules_accepted';
  const authCompletedKey = 'fastzim_auth_completed';

  function setStoredState(key, value) {
    try {
      window.sessionStorage.setItem(key, value ? 'true' : 'false');
    } catch (error) {
      // Ignore storage errors silently to keep the page usable.
    }
  }

  function isAccepted() {
    try {
      return window.sessionStorage.getItem(rulesAcceptedKey) === 'true';
    } catch (error) {
      return false;
    }
  }

  if (rulesCheckbox && rulesContinueButton) {
    rulesCheckbox.addEventListener('change', () => {
      const isChecked = rulesCheckbox.checked;
      rulesContinueButton.disabled = !isChecked;
      if (isChecked) {
        setStoredState(rulesAcceptedKey, true);
      }
    });

    if (isAccepted()) {
      rulesCheckbox.checked = true;
      rulesContinueButton.disabled = false;
    }
  }

  if (flowNextButtons.length) {
    flowNextButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.target;

        if (button.id === 'rules-continue') {
          if (!rulesCheckbox || !rulesCheckbox.checked) {
            return;
          }
          setStoredState(rulesAcceptedKey, true);
        }

        if (target === 'auth-step' && !isAccepted()) {
          return;
        }

        if (target) {
          showStep(target);
        }
      });
    });
  }

  if (flowBackButtons.length) {
    flowBackButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.target;
        if (target) {
          showStep(target);
        }
      });
    });
  }

  const flowSignupForm = document.getElementById('flow-signup-form');
  if (flowSignupForm) {
    flowSignupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      setStoredState(authCompletedKey, true);
      showStep('choose-step');
    });
  }

  const flowAuthContinueButton = document.querySelector('#auth-step .flow-next');
  if (flowAuthContinueButton) {
    flowAuthContinueButton.addEventListener('click', () => {
      const activeForm = document.querySelector('.auth-form.active');
      if (activeForm) {
        if (!activeForm.reportValidity()) {
          return;
        }
        setStoredState(authCompletedKey, true);
        showStep('choose-step');
      }
    });
  }

  if (serviceChoices.length) {
    serviceChoices.forEach((button) => {
      button.addEventListener('click', () => {
        const service = button.dataset.service;
        sessionStorage.setItem('fastzim_selected_service', service);
        resumePublicSite();

        if (service === 'food') {
          window.location.hash = '#services';
        } else if (service === 'taxi') {
          window.location.hash = '#onboarding';
        } else if (service === 'private') {
          window.location.href = 'secure-workspace/index.html';
        }
      });
    });
  }

  document.querySelectorAll('a[href="#onboarding"], .btn-primary, .btn-ghost').forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = event.currentTarget.getAttribute('href');
      if (target === '#onboarding') {
        event.preventDefault();
        enterOnboarding();
      }
    });
  });

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;

      tabButtons.forEach((item) => item.classList.toggle('active', item === button));
      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === `${target}-panel`);
      });
    });
  });

  providerCards.forEach((card) => {
    card.addEventListener('click', () => {
      providerCards.forEach((item) => item.classList.toggle('active', item === card));
      if (providerRole && card.dataset.role) {
        providerRole.value = card.dataset.role;
      }
    });
  });

  const providerForm = document.getElementById('provider-form');
  const userForm = document.getElementById('user-form');

  if (providerForm) {
    providerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(providerForm);
      const fullName = (formData.get('provider-name') || '').toString().trim();
      const serviceType = (formData.get('provider-role') || '').toString().trim();

      alert(`${serviceType} registration submitted for ${fullName}. Fast Zim team will contact you soon.`);
      providerForm.reset();
    });
  }

  if (userForm) {
    userForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(userForm);
      const phone = (formData.get('user-phone') || '').toString().trim();
      const email = (formData.get('user-email') || '').toString().trim();

      if (!phone || !email) {
        alert('Please add your phone number and email address.');
        return;
      }

      alert('Your Fast Zim account is ready. Welcome aboard!');
      userForm.reset();
    });
  }
});
