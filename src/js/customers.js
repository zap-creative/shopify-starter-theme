import { AddressForm } from '@shopify/theme-addresses';

import '../css/customers.scss';

class Customer {
  constructor(){
    this.selectors = {
      login_form: '#login-form',
      login_heading: '#login-heading',
      recover_form: '#recover-form',
      recover_heading: '#recover-password-heading',
      recover_field: '#recover-email',
      form_state: '#form-state',
      hide_recover_form: '[data-hide-recover-form]',
      show_recover_form: '[data-show-recover-form]',
      addresses: '[data-address]',
      address_fields: '[data-address-fields]',
      address_toggle: '[data-address-toggle]',
      address_form: '[data-address-form]',
      address_delete_form: '[data-address-delete-form]',
    };

    this.classes = {
      hidden: 'hidden',
    };

    this.cache = this.cacheSelectors(this.selectors);

    if(this.cache.login_form) {
      this.initLoginPage.bind(this)();
    }

    if(this.cache.addresses) {
      this.initAddressesPage.bind(this)();
    }
  }

  cacheSelectors(selectors) {
    return {
      login_form: document.getElementById(selectors.login_form.replace('#','')),
      login_heading: document.getElementById(selectors.login_heading.replace('#','')),
      recover_form: document.getElementById(selectors.recover_form.replace('#','')),
      recover_field: document.getElementById(selectors.recover_field.replace('#','')),
      recover_heading: document.getElementById(selectors.recover_heading.replace('#','')),
      form_state: document.getElementById(selectors.form_state.replace('#','')),
      hide_recover_form: document.querySelectorAll(selectors.hide_recover_form),
      show_recover_form: document.querySelectorAll(selectors.show_recover_form),
      addresses: document.querySelectorAll(selectors.addresses),
    };
  }

  initLoginPage() {
    const {
      login_heading,
      recover_heading,
      hide_recover_form,
      show_recover_form,
      form_state,
    } = this.cache;

    if(show_recover_form.length > 0) {
      show_recover_form.forEach((el) => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showRecoverPasswordForm.bind(this)();

          if(recover_heading) {
            recover_heading.setAttribute('tabindex', '-1');
            recover_heading.focus();
          }
        });
      });
    }
    
    if(hide_recover_form.length > 0) {
      hide_recover_form.forEach((el) => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          
          this.hideRecoverPasswordForm.bind(this)();
          if(login_heading) {
            login_heading.setAttribute('tabindex', '-1');
            login_heading.focus();
          }
        });
      });
    }

    if (recover_heading) {
      recover_heading.addEventListener('blur', (e) => {
        e.target.removeAttribute('tabindex');
      });
    }

    if (login_heading) {
      login_heading.addEventListener('blur', (e) => {
        e.target.removeAttribute('tabindex');
      });
    }

    if(form_state) {
      this.resetPasswordSuccess.bind(this)(form_state);
    }

    this.checkUrlHash.bind(this)();
  }

  initAddressesPage() {
    const { addresses } = this.cache;

    if (addresses.length) {
      addresses.forEach((address) => {
        this.initAddressForm.bind(this)(address);
      });
    }
  }

  showRecoverPasswordForm() {
    const {
      recover_form,
      recover_field,
      login_form,
    } = this.cache;

    recover_form.classList.remove(this.classes.hidden);
    recover_form.removeAttribute('aria-hidden');

    login_form.classList.add(this.classes.hidden);
    login_form.setAttribute('aria-hidden', true);

    if (recover_field.getAttribute('aria-invalid') === 'true') {
      recover_field.focus();
    }
  }

  hideRecoverPasswordForm() {
    const {
      login_form,
      recover_form,
    } = this.cache;

    login_form.classList.remove(this.classes.hidden);
    login_form.removeAttribute('aria-hidden');

    recover_form.classList.add(this.classes.hidden);
    recover_form.setAttribute('aria-hidden', true);
  }

  resetPasswordSuccess(form_state) {
    // check if reset password form was successfully submited.
    if (!form_state) {
      return;
    }
  
    // show success message
    form_state.classList.remove(this.classes.hidden);
    form_state.removeAttribute('aria-hidden');
    form_state.focus();
  }
  
  checkUrlHash() {
    var hash = window.location.hash;
  
    // Allow deep linking to recover password form
    if (hash === '#recover') {
      this.showRecoverPasswordForm.bind(this)();
    }
  }

  initAddressForm(container) {
    let {
      address_delete_form,
      address_fields,
      address_form,
      address_toggle,
    } = this.selectors;

    address_fields = container.querySelector(address_fields);
    address_form = container.querySelector(address_form);
    address_delete_form = container.querySelector(address_delete_form);

    container.querySelectorAll(address_toggle).forEach((btn) => {
      btn.addEventListener('click', () => {
        address_form.classList.toggle(this.classes.hidden);
      });
    });

    AddressForm(address_fields, 'en');

    if (address_delete_form) {
      address_delete_form.addEventListener('submit', (e) => {
        const confirm_msg = address_delete_form.getAttribute('data-confirm-message');

        // eslint-disable-next-line no-alert
        if (!window.confirm(confirm_msg || 'Are you sure you wish to delete this address?')) {
          e.preventDefault();
        }
      });
    }
  }
}

const customer = new Customer();