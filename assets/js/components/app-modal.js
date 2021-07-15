class AppModal {
  init() {
    this.isMobile = window.screen.width < 992;
    this.allCookies = document.cookie;
    this.cookiename = 'modalapp=';

    if (this.isMobile) {
      this.closeButton = document.querySelectorAll('.js_appModalMobile-close');
      this.modal = document.getElementById('appModalMobile');
      this.cookieTimer = '86400'; // 1 dia
    } else {
      this.closeButton = document.querySelectorAll('.js_appModalDesktop-close');
      this.openButton = document.querySelectorAll('.js_appModalDesktop-open');
      this.modal = document.getElementById('appModalDesktop');
      this.cookieTimer = '604800'; // 7 dias
    }

    if (this.modal) {
      this.addOpenButtonListener();
      this.addCloseButtonListener();

      /*if (this.isMobile) {
        this.controlMobileCookie();
      } else {
        this.controlDesktopCookie();
      }*/
    }
  }

  controlDesktopCookie() {
    if (this.checkCookie()) {
      this.closeModal();
    } else {
      this.setCookie();

      setTimeout(() => {
        this.openModal();
      }, 3000);
    }
  }

  controlMobileCookie(action = 'start') {
    if (action === 'click') {
      this.setCookie();
    } else {
      if (!this.checkCookie()) {
        this.openModal();
      }
    }
  }

  setCookie() {
    document.cookie = `${this.cookiename}; max-age=${this.cookieTimer}; path=/`;
  }

  checkCookie() {
    return this.allCookies.split(';').some((item) => item.includes(this.cookiename));
  }

  addOpenButtonListener() {
    if (this.openButton && this.openButton.length > 0) {
      this.openButton.forEach(bt => {
        bt.addEventListener('click', e => {
          this.openModal();
        })
      })
    }
  }

  addCloseButtonListener() {
    if (this.closeButton && this.closeButton.length > 0) {
      this.closeButton.forEach(bt => {
        bt.addEventListener('click', e => {
          this.closeModal();

          /*if (this.isMobile) {
            this.controlMobileCookie('click');
          }*/
        })
      })
    }
  }

  closeModal() {
    this.modal.classList.remove('is_active');
  }

  openModal() {
    this.modal.classList.add('is_active');
  }
}

const appModal = new AppModal();
