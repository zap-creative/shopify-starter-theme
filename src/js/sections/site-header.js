import { register } from '@shopify/theme-sections';
import { trapFocus, removeTrapFocus } from '@shopify/theme-a11y';

import prepareTransition from '../utility/prepareTransition';

register('header-section', {
  async onLoad() {
    this.Navigation = new Navigation();
    this.MobileNavigation = new MobileNavigation();
  },

  onUnload() {
    this.Navigation.unload();
    this.MobileNavigation.unload();
  },
});

class Navigation {
  constructor(){
    this.selectors = {
      navigation: '#site-navigation',
      siteNavHasDropdown: '[data-has-dropdowns]',
      siteNavChildLinks: '.nav-link--child',
      siteNavActiveDropdown: '.site-nav--active-dropdown',
      siteNavCenteredDropdown: '.site-nav__dropdown--centered',
      siteNavLinkMain: '.nav-link--main',
      siteNavChildLink: '.nav-link--last',
      siteNavDropdown: '.site-nav__dropdown',
      sectionHeader: '[data-header-section]'
    };
  
    this.classes = {
      activeClass: 'is-active',
      childLinkClass: 'nav-link--child',
      rightDropdownClass: 'is-right',
      leftDropdownClass: 'is-left'
    };
  
    // bind class methods
    this.unload = this.unload.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
    this.submenuFocusoutHandler = this.submenuFocusoutHandler.bind(this);
    this.submenuParentClickHandler = this.submenuParentClickHandler.bind(this);
    
    this.cache = this.cacheSelectors(this.selectors);
    
    this.cache.parents.forEach((element) => {
      element.addEventListener('click', this.submenuParentClickHandler);
    });

    // check when we're leaving a dropdown and close the active dropdown
    this.cache.siteNavChildLink.forEach((element) => {
      element.addEventListener('focusout', this.submenuFocusoutHandler);
    });

    this.cache.topLevel.forEach((element) => {
      element.addEventListener('focus', this.hideDropdown);
    });

    this.cache.subMenuLinks.forEach((element) => {
      element.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
      });
    });
  }

  cacheSelectors(selectors) {
    const navigation = document.querySelector(selectors.navigation);

    return {
      nav: navigation,
      topLevel: document.querySelectorAll(selectors.siteNavLinkMain),
      parents: navigation.querySelectorAll(selectors.siteNavHasDropdown),
      subMenuLinks: document.querySelectorAll(selectors.siteNavChildLinks),
      activeDropdown: document.querySelector(selectors.siteNavActiveDropdown),
      sectionHeader: document.querySelector(selectors.sectionHeader),
      siteNavChildLink: document.querySelectorAll(selectors.siteNavChildLink)
    };
  }

  showDropdown(element) {
    element.classList.add(this.classes.activeClass);

    if (this.cache.activeDropdown) this.hideDropdown();

    this.cache.activeDropdown = element;

    element
      .querySelector(this.selectors.siteNavLinkMain)
      .setAttribute('aria-expanded', 'true');

    window.addEventListener('keyup', this.keyUpHandler);
    document.body.addEventListener('click', this.hideDropdown);
  }

  hideDropdown() {
    if (!this.cache.activeDropdown) return;

    this.cache.activeDropdown
      .querySelector(this.selectors.siteNavLinkMain)
      .setAttribute('aria-expanded', 'false');

    this.cache.activeDropdown.classList.remove(this.classes.activeClass);

    this.cache.activeDropdown = document.querySelector(
      this.selectors.siteNavActiveDropdown
    );

    window.removeEventListener('keyup', this.keyUpHandler);
    document.body.removeEventListener('click', this.hideDropdown);
  }

  keyUpHandler(event) {
    if (event.keyCode === 27) this.hideDropdown();
  }

  submenuParentClickHandler(event) {
    const element = event.currentTarget;

    element.classList.contains(this.classes.activeClass)
      ? this.hideDropdown()
      : this.showDropdown(element);
  }

  submenuFocusoutHandler() {
    if (
      document.activeElement.classList.contains(this.classes.childLinkClass) ||
      !this.cache.activeDropdown
    ) {
      return;
    }

    this.hideDropdown();
  }

  unload() {
    this.cache.topLevel.forEach((element) => {
      element.removeEventListener('focus', this.hideDropdown);
    });

    this.cache.subMenuLinks.forEach((element) => {
      element.removeEventListener('click', (event) => {
        event.stopImmediatePropagation();
      });
    });

    this.cache.parents.forEach((element) => {
      element.removeEventListener('click', this.submenuParentClickHandler);
    });

    this.cache.siteNavChildLink.forEach((element) => {
      element.removeEventListener('focusout', this.submenuFocusoutHandler);
    });

    window.removeEventListener('keyup', this.keyUpHandler);
    document.body.removeEventListener('click', this.hideDropdown);
  }
};

class MobileNavigation {
  constructor() {
    this.selectors = {
      sectionHeader: '#shopify-section-site-header',
      mobileNavToggle: '.toggle-mobile-navigation',
      mobileNavContainer: '#mobile-navigation',
      mobileNav: '.mobile-navigation-menu',
      navItem: '.menu-item',
      navLink: '.menu-item__link',
      navDropdown: '.menu-item__dropdown',
      subNavLink: '.menu-item__link--sublist',
      return: 'menu-item__button--return',
      subNavToggleBtns: '.toggle-submenu',
      mobileNavOpenIcon: 'mobile-navigation--open',
      mobileNavCloseIcon: 'mobile-navigation--close',
      navOpen: 'is-open',
      subNavActive: 'is-active',
      subNavClosing: 'is-closing',
      subNavShowing: 'has-secondary-open',
      thirdNavShowing: 'has-tertiary-open',
    };

    this.menuLevel = 1;
    this.activeSubNav = null;
    this.activeTrigger = null;
    this.isTransitioning = false;

    // bind class methods
    this.unload = this.unload.bind(this);
    this.initBreakpoints = this.initBreakpoints.bind(this);
    this.toggleMobileNav = this.toggleMobileNav.bind(this);
    this.openMobileNav = this.openMobileNav.bind(this);
    this.closeMobileNav = this.closeMobileNav.bind(this);
    this.toggleSubNav = this.toggleSubNav.bind(this);
    this.goToSubnav = this.goToSubnav.bind(this);

    this.cache = this.cacheSelectors(this.selectors);
    
    // set up event listeners
    this.cache.mobileNavToggle.addEventListener('click', this.toggleMobileNav.bind(this));
    this.cache.subNavToggleBtns.forEach((element) => {
      element.addEventListener('click', this.toggleSubNav.bind(this));
    });
    
    this.mql = window.matchMedia(`(min-width: ${theme.breakpoints.tablet}px)`);
    this.mql.addListener(this.initBreakpoints.bind(this));
  }

  unload() {
    this.mql.removeListener(this.initBreakpoints);
  }

  initBreakpoints() {
    if (
      this.mql.matches &&
      this.cache.mobileNavContainer.classList.contains(this.selectors.navOpen)
    ) {
      this.closeMobileNav();
    }
  }

  cacheSelectors(selectors) {
    const sectionHeader = document.querySelector(selectors.sectionHeader);

    return {
      sectionHeader,
      mobileNavToggle: sectionHeader.querySelector(selectors.mobileNavToggle),
      mobileNavContainer: sectionHeader.querySelector(selectors.mobileNavContainer),
      mobileNav: sectionHeader.querySelector(selectors.mobileNav),
      subNavToggleBtns: sectionHeader.querySelectorAll(selectors.subNavToggleBtns),
    };
  }

  toggleMobileNav() {
    if (this.cache.mobileNavToggle.classList.contains(
      this.selectors.mobileNavCloseIcon
    )) {
      this.closeMobileNav();
    } else {
      this.openMobileNav();
    }
  }

  openMobileNav() {
    const translateHeaderHeight = this.cache.sectionHeader.offsetHeight;

    prepareTransition(this.cache.mobileNavContainer);
    this.cache.mobileNavContainer.classList.add(this.selectors.navOpen);
    this.cache.mobileNavContainer.setAttribute(
      'data-original-height',
      this.cache.mobileNav.offsetHeight
    );

    this.cache.mobileNavContainer.style.transform = `translateY(${translateHeaderHeight}px)`;

    trapFocus(this.cache.sectionHeader, {
      elementToFocus: this.cache.mobileNavToggle
    });

    this.cache.mobileNavToggle.setAttribute('aria-expanded', true);
    this.cache.mobileNavToggle.classList.add(
      this.selectors.mobileNavCloseIcon
    );
    this.cache.mobileNavToggle.classList.remove(
      this.selectors.mobileNavOpenIcon
    );

    window.addEventListener('keyup', this.keyUpHandler.bind(this));
  }

  closeMobileNav() {
    prepareTransition(this.cache.mobileNavContainer);
    this.cache.mobileNavContainer.classList.remove(this.selectors.navOpen);
    this.cache.mobileNavContainer.style.transform = 'translateY(-100%)';

    trapFocus(document.documentElement, {
      elementToFocus: document.body
    });

    this.cache.mobileNavContainer.addEventListener('transitionend', (event) => {
      removeTrapFocus({
        container: this.cache.mobileNav
      });
    }, { once: true });

    this.cache.mobileNavToggle.setAttribute('aria-expanded', false);
    this.cache.mobileNavToggle.classList.add(this.selectors.mobileNavOpenIcon);
    this.cache.mobileNavToggle.classList.remove(this.selectors.mobileNavCloseIcon);
    this.cache.mobileNavToggle.focus();

    window.removeEventListener('keyup', this.keyUpHandler.bind(this));
  }

  toggleSubNav(event) {
    if (this.isTransitioning) return;

    const toggleBtn = event.currentTarget;
    const isReturn = toggleBtn.classList.contains(this.selectors.return);

    this.isTransitioning = true;

    if (isReturn) {
      const subNavToggleBtns = document.querySelectorAll(
        `.${this.selectors.subNavToggleBtns}[data-level='${menuLevel - 1}']`
      );

      subNavToggleBtns.forEach((element) => {
        element.classList.remove(this.selectors.subNavActive);
      });

      if (this.activeTrigger) {
        this.activeTrigger.classList.remove(this.selectors.subNavActive);
      }
    } else {
      toggleBtn.classList.add(this.selectors.subNavActive);
    }

    this.activeTrigger = toggleBtn;

    this.goToSubnav(toggleBtn.getAttribute('data-target'));
  }

  goToSubnav(target) {
    const targetMenu = target
      ? document.querySelector(`${this.selectors.navDropdown}[data-parent="${target}"]`)
      : this.cache.mobileNav;

    const menuLevel = targetMenu.dataset.level 
      ? Number(targetMenu.dataset.level) 
      : 1;

    if (this.activeSubNav) {
      prepareTransition(this.activeSubNav);
      this.activeSubNav.classList.add(this.selectors.subNavClosing);
    }

    this.activeSubNav = targetMenu;

    const openNavClass = menuLevel > 2 
      ? this.selectors.thirdNavShowing 
      : this.selectors.subNavShowing;

    const translateMenuHeight = targetMenu === this.cache.mobileNav
      ? this.cache.mobileNavContainer.getAttribute('data-original-height')
      : targetMenu.offsetHeight;
    
    this.cache.mobileNav.style.height = translateMenuHeight + 'px';
    this.cache.mobileNav.classList.remove(this.selectors.thirdNavShowing);
    this.cache.mobileNav.classList.add(openNavClass);
      
    if (!target) {
      this.cache.mobileNav.classList.remove(
        this.selectors.thirdNavShowing,
        this.selectors.subNavShowing
      );
    }

    /* if going back to first subnav, focus is on whole header */
    const container = menuLevel === 1 ? this.cache.sectionHeader : targetMenu;

    this.cache.mobileNavContainer.addEventListener('transitionend', (event) => {
      trapFocus({
        container: container
      });

      this.cache.mobileNavContainer.removeEventListener('transitionend');

      this.isTransitioning = false;
    }, { once: true });

    this.activeSubNav.classList.remove(this.selectors.subNavClosing);
  }

  
  keyUpHandler(event) {
    if (event.which === 27) {
      this.closeMobileNav();
    }
  }
}