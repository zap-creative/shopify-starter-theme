import { AddressForm } from '@shopify/theme-addresses';

import MicroModal from 'micromodal';

import '../css/customers.scss';

const form_action = '/account/addresses';
const classes = {
  hidden: 'hidden',
  add_address: 'add-address',
  edit_address: 'edit-address',
};

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
      address_add: '[data-address-add]',
      address_data: '[data-address-data]',
      address_delete_form: '[data-address-delete-form]',
      address_delete_confirm: '[data-address-delete-msg]',
      address_edit: '[data-address-edit]',
      address_fields: '[data-address-fields]',
      address_form: '[data-address-form]',
      modal: '[data-modal]',
      modal_open: '[data-modal-open]',
      modal_close: '[data-modal-close]',
    };

    this.cache = this.cacheSelectors(this.selectors);

    this.checkUrlHash = this.checkUrlHash.bind(this);
    this.hideRecoverPasswordForm = this.hideRecoverPasswordForm.bind(this);
    this.initAddress = this.initAddress.bind(this);
    this.resetAddressForm = this.resetAddressForm.bind(this);
    this.resetPasswordSuccess = this.resetPasswordSuccess.bind(this);
    this.setupAddressEditForm = this.setupAddressEditForm.bind(this);
    this.showRecoverPasswordForm = this.showRecoverPasswordForm.bind(this);

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
      address_form: document.querySelector(selectors.address_form),
      address_modal: document.querySelector(selectors.modal),
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
      this.resetPasswordSuccess(form_state);
    }

    this.checkUrlHash();
  }

  initAddressesPage() {
    const {
      addresses,
      address_modal,
    } = this.cache;

    const {
      modal_close,
      modal_open,
    } = this.selectors;

    if (addresses.length > 0) {
      addresses.forEach((address) => {
        this.initAddress(address);
      });
    }

    if(address_modal) {
      MicroModal.init({
        openClass: 'open',
        onShow: (modal) => {
          document.body.classList.add('overflow-hidden');
        },
        onClose: (modal) => {
          document.body.classList.remove('overflow-hidden');
          this.resetAddressForm();
        },
        openTrigger: modal_open.replaceAll(/\[|\]/g, ''),
        closeTrigger: modal_close.replaceAll(/\[|\]/g, ''),
        awaitCloseAnimation: true,
      });
    }
  }

  showRecoverPasswordForm() {
    const {
      recover_form,
      recover_field,
      login_form,
    } = this.cache;

    recover_form.classList.remove(classes.hidden);
    recover_form.removeAttribute('aria-hidden');

    login_form.classList.add(classes.hidden);
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

    login_form.classList.remove(classes.hidden);
    login_form.removeAttribute('aria-hidden');

    recover_form.classList.add(classes.hidden);
    recover_form.setAttribute('aria-hidden', true);
  }

  resetPasswordSuccess(form_state) {
    // check if reset password form was successfully submited.
    if (!form_state) {
      return;
    }
  
    // show success message
    form_state.classList.remove(classes.hidden);
    form_state.removeAttribute('aria-hidden');
    form_state.focus();
  }
  
  checkUrlHash() {
    var hash = window.location.hash;
  
    // Allow deep linking to recover password form
    if (hash === '#recover') {
      this.showRecoverPasswordForm();
    }
  }

  initAddress(container) {
    let {
      address_data,
      address_add,
      address_edit,
      address_delete_confirm,
      address_delete_form,
    } = this.selectors;

    address_add = container.querySelector(address_add);
    if(address_add) {
      address_add.addEventListener('click', (e) => {
        this.setupAddressAddForm();
      });
    }

    address_edit = container.querySelector(address_edit);
    if(address_edit) {
      address_edit.addEventListener('click', (e) => {
        this.setupAddressEditForm(
          container.getAttribute('data-address'),
          container.querySelector(address_data)
        );
      });
    }

    address_delete_form = container.querySelector(address_delete_form);
    if (address_delete_form) {
      address_delete_form.addEventListener('submit', (e) => {
        const confirm_msg = address_delete_form.getAttribute(address_delete_confirm);

        // eslint-disable-next-line no-alert
        if (!window.confirm(confirm_msg || 'Are you sure you wish to delete this address?')) {
          e.preventDefault();
        }
      });
    }
  }

  setupAddressAddForm() {
    const {
      address_form,
      address_modal,
    } = this.cache;

    let {
      address_fields,
    } = this.selectors;

    this.resetAddressForm();
    this.address_form = AddressForm(
      address_form.querySelector(address_fields),
      document.documentElement.getAttribute('lang')
      ).then(() => {

      address_form.setAttribute('action', `${form_action}`);

      address_modal.querySelectorAll(`.${classes.add_address}`).forEach((el) => {
        el.classList.remove('hidden')
      });
  
      address_modal.querySelectorAll(`.${classes.edit_address}`).forEach((el) => {
        el.classList.add('hidden')
      });

    });
      
  }

  setupAddressEditForm(address_id, address_data) {
    const {
      address_form,
      address_modal,
    } = this.cache;

    let {
      address_fields,
    } = this.selectors;
    
    this.resetAddressForm();
    this.address_form = AddressForm(
      address_form.querySelector(address_fields),
      document.documentElement.getAttribute('lang')
    ).then(() => {

      if(parseInt(address_id) > 0){
        if(address_data) {
          Promise.resolve(address_data.innerHTML)
            .then(JSON.parse)
            .then((data) => {
              for(const [key, val] of Object.entries(data)) {
                if(`${key}_code` in data) {
                  continue; //skip over the country and province for now
                }
  
                const input = address_form.elements[`address[${key}]`];
                if(input) {
                  switch(input.type) {
                    case 'checkbox': input.checked = !!val; break;
                    default:         input.value = val;     break;
                  }
               
                  input.dispatchEvent(new Event('change'));
                }
              }

              if('country_code' in data) {
                const country = address_form.elements[`address[country]`];
                if(country) {
                  country.value = data['country_code'];
                  country.dispatchEvent(new Event('change'));
                }
              }

              if('province_code' in data) {
                const province = address_form.elements[`address[province]`];
                if(province) {
                  province.value = data['province_code'];
                  province.dispatchEvent(new Event('change'));
                }
              }
            });
  
          const method = document.createElement('input');
          method.setAttribute('type', 'hidden');
          method.setAttribute('name', '_method');
          method.setAttribute('value', 'put');
          
          address_form.appendChild(method);
        }
        
        address_form.setAttribute('action', `${form_action}/${address_id}`);
      }
  
      address_modal.querySelectorAll(`.${classes.edit_address}`).forEach((el) => {
        el.classList.remove('hidden')
      });
  
      address_modal.querySelectorAll(`.${classes.add_address}`).forEach((el) => {
        el.classList.add('hidden')
      });

    });

  }

  resetAddressForm() {
    const {
      address_form,
    } = this.cache;

    if(address_form) {
      // clear out anything we might have stored
      if(this.address_form) {
        delete this.address_form;
      }

      address_form.reset();
      address_form.setAttribute('action', form_action);

      // ensure we aren't trying to update an existing address
      const method = address_form.elements[`_method`];
      method && method.remove();
    }
  }
}

const customer = new Customer();