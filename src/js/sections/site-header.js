import { register } from '@shopify/theme-sections';
import { trapFocus, removeTrapFocus } from '@shopify/theme-a11y';

import prepareTransition from '../utility/prepare-transition';
import debounce from '../utility/debounce';

const {
  breakpoints,
} = window.theme;

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
      activeClass: 'active',
      childLinkClass: 'nav-link--child',
      rightDropdownClass: 'is-right',
      leftDropdownClass: 'is-left'
    };
  
    // bind class methods
    this.unload = this.unload.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.submenuFocusoutHandler = this.submenuFocusoutHandler.bind(this);
    this.submenuParentClickHandler = this.submenuParentClickHandler.bind(this);
    
    this.cache = this.cacheSelectors(this.selectors);
    
    if (this.cache.sectionHeader) {
      document.documentElement.style.setProperty(
        '--js-header-height', 
        `${this.cache.sectionHeader.offsetHeight}px`
      );
      window.addEventListener('resize', debounce(this.resizeHandler));
    }
    
    if(this.cache.parents){
      this.cache.parents.forEach((element) => {
        element.addEventListener('click', this.submenuParentClickHandler);
      });
    }

    if(this.cache.siteNavChildLink) {
      // check when we're leaving a dropdown and close the active dropdown
      this.cache.siteNavChildLink.forEach((element) => {
        element.addEventListener('focusout', this.submenuFocusoutHandler);
      });
    }

    if(this.cache.topLevel) {
      this.cache.topLevel.forEach((element) => {
        element.addEventListener('focus', this.hideDropdown);
      });
    }

    if(this.cache.subMenuLinks) {
      this.cache.subMenuLinks.forEach((element) => {
        element.addEventListener('click', (event) => {
          event.stopImmediatePropagation();
        });
      });
    }
  }

  unload() {
    if(this.cache.topLevel) {
      this.cache.topLevel.forEach((element) => {
        element.removeEventListener('focus', this.hideDropdown);
      });
    }

    if(this.cache.subMenuLinks) {
      this.cache.subMenuLinks.forEach((element) => {
        element.removeEventListener('click', (event) => {
          event.stopImmediatePropagation();
        });
      });
    }

    if(this.cache.parents) {
      this.cache.parents.forEach((element) => {
        element.removeEventListener('click', this.submenuParentClickHandler);
      });
    }

    if(this.cache.siteNavChildLink) {
      this.cache.siteNavChildLink.forEach((element) => {
        element.removeEventListener('focusout', this.submenuFocusoutHandler);
      });
    }

    document.documentElement.style.removeProperty('--js-header-height');

    window.removeEventListener('keyup', this.keyUpHandler);
    window.removeEventListener('resize', debounce(this.resizeHandler));
    document.body.removeEventListener('click', this.hideDropdown);
  }

  cacheSelectors(selectors) {
    const navigation = document.querySelector(selectors.navigation);
    if (!navigation) {
      return {};
    }

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

  resizeHandler(event) {
    document.documentElement.style.setProperty(
      '--js-header-height',
      `${this.cache.sectionHeader.offsetHeight}px`
    );
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
};

class MobileNavigation {
  constructor() {
    this.selectors = {
      sectionHeader: '#shopify-section-site-header',
      mobileNavToggle: '.toggle-mobile-navigation',
      mobileNavContainer: '#mobile-navigation',
      mobileNav: '.mobile-navigation-menu',
      navDropdown: '.menu-item__dropdown',
      subNavToggle: '.toggle-submenu',
    };
    
    this.classes = {
      navOpen: 'open',
      subNavActive: 'active',
      subNavClosing: 'closing',
      subNavShowing: 'has-secondary-open',
      thirdNavShowing: 'has-tertiary-open',
      toggleReturn: 'toggle-submenu--return',
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
    if(this.cache.mobileNavToggle) {
      this.cache.mobileNavToggle.addEventListener('click', this.toggleMobileNav.bind(this));
    }

    if(this.cache.subNavToggle) {
      this.cache.subNavToggle.forEach((element) => {
        element.addEventListener('click', this.toggleSubNav.bind(this));
      });
    }
    
    if(this.cache.mobileNavContainer){
      this.mql = window.matchMedia(`(min-width: ${breakpoints.tablet}px)`);
      this.mql.addListener(this.initBreakpoints.bind(this));
    }
  }

  unload() {
    if(this.mql){
      this.mql.removeListener(this.initBreakpoints);
    }
  }

  initBreakpoints() {
    if (
      this.mql.matches &&
      this.cache.mobileNavContainer.classList.contains(this.classes.navOpen)
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
      subNavToggle: sectionHeader.querySelectorAll(selectors.subNavToggle),
    };
  }

  toggleMobileNav() {
    if (this.cache.mobileNavToggle.getAttribute('aria-expanded') === 'true') {
      this.closeMobileNav();
    } else {
      this.openMobileNav();
    }
  }

  openMobileNav() {
    const {
      sectionHeader,
      mobileNavContainer,
      mobileNav,
      mobileNavToggle
    } = this.cache;
    const {
      navOpen
    } = this.classes;

    prepareTransition(mobileNavContainer);
    mobileNavContainer.classList.add(navOpen);
    mobileNavContainer.setAttribute(
      'data-original-height',
      mobileNav.offsetHeight
    );

    trapFocus(sectionHeader, {elementToFocus: mobileNavToggle});
    mobileNavToggle.setAttribute('aria-expanded', true);

    window.addEventListener('keyup', this.keyUpHandler.bind(this));
  }

  closeMobileNav() {
    const {
      mobileNavContainer,
      mobileNav,
      mobileNavToggle
    } = this.cache;
    const {
      navOpen
    } = this.classes;

    prepareTransition(mobileNavContainer);
    mobileNavContainer.classList.remove(navOpen);
    mobileNavContainer.removeAttribute('data-original-height');

    trapFocus(document.documentElement, {elementToFocus: document.body});
    mobileNavContainer.addEventListener('transitionend', (event) => {
      removeTrapFocus({container: mobileNav});
    }, { once: true });

    mobileNavToggle.setAttribute('aria-expanded', false);
    mobileNavToggle.focus();

    window.removeEventListener('keyup', this.keyUpHandler.bind(this));
  }

  toggleSubNav(event) {
    if (this.isTransitioning) return;
    const {
      subNavToggle,
    } = this.selectors;
    const {
      subNavActive,
      toggleReturn,
    } = this.classes;

    const toggleBtn = event.currentTarget;
    const isReturn = toggleBtn.classList.contains(toggleReturn);

    this.isTransitioning = true;

    if (isReturn) {
      const toggleBtns = document.querySelectorAll(
        `${subNavToggle}[data-level='${this.menuLevel - 1}']`
      );

      toggleBtns.forEach((element) => {
        element.classList.remove(subNavActive);
      });

      if (this.activeTrigger) {
        this.activeTrigger.classList.remove(subNavActive);
      }
    } else {
      toggleBtn.classList.add(subNavActive);
    }

    this.activeTrigger = toggleBtn;

    this.goToSubnav(toggleBtn.getAttribute('data-target'));
  }

  goToSubnav(target) {
    const {
      navDropdown,
    } = this.selectors;
    const {
      subNavClosing,
      subNavShowing,
      thirdNavShowing,
    } = this.classes;
    const {
      sectionHeader,
      mobileNavContainer,
      mobileNav,
    } = this.cache;

    const targetMenu = target
      ? document.querySelector(`${navDropdown}[data-parent="${target}"]`)
      : mobileNav;

    const menuLevel = targetMenu.dataset.level 
      ? Number(targetMenu.dataset.level) 
      : mobileNav;

    if (this.activeSubNav) {
      prepareTransition(this.activeSubNav);
      this.activeSubNav.classList.add(subNavClosing);
    }

    this.activeSubNav = targetMenu;

    const openNavClass = menuLevel > 2 ? thirdNavShowing : subNavShowing;

    const translateMenuHeight = targetMenu === mobileNav
      ? mobileNavContainer.getAttribute('data-original-height')
      : targetMenu.offsetHeight;
    
    mobileNav.style.height = translateMenuHeight + 'px';
    mobileNav.classList.remove(subNavShowing, thirdNavShowing);
    if (target) {
      mobileNav.classList.add(openNavClass);
    }

    /* if going back to first subnav, focus is on whole header */
    const container = menuLevel === 1 ? sectionHeader : targetMenu;

    mobileNavContainer.addEventListener('transitionend', (event) => {
      trapFocus(container);
      this.isTransitioning = false;
    }, { once: true });

    this.activeSubNav.classList.remove(subNavClosing);
  }

  keyUpHandler(event) {
    if (event.which === 27) {
      this.closeMobileNav();
    }
  }
}