document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const providerCards = document.querySelectorAll('.provider-card');
  const providerRole = document.getElementById('provider-role');

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
